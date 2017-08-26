(function() {
  'use strict';

  chatapp.controller('MessageController', MessageController);
  MessageController.$inject = ["$scope", "$window", "$stateParams", "$localStorage", "Message", "Upload", "User",
                               "Conversation", "UpdateReadStatus", "socket"];

  function MessageController($scope, $window, $stateParams, $localStorage, Message, Upload, User, Conversation, UpdateReadStatus, socket) {

    if (!('token' in $localStorage)) {
      $window.location.href = '/#/login';
    }

    $scope.send_to = $stateParams.username;
    $scope.text = '';
    $scope.users = [];
    $scope.active_users = [];
    $scope.conversations = [];
    $scope.online_users = [];

    $scope.init = function() {
      var data = {};
      if ($scope.send_to) {
        data = { username: $scope.send_to }
      }

      socket.init($localStorage.username);
      socket.on('get:message', $localStorage.username, function(data) {
        if (data.send_by === $scope.send_to) {
          var oldScrollHeight = $('#messages')[0].scrollHeight;
          $scope.messages.push(data);

          setTimeout(function() {
            var currentScrollTop = $('#messages')[0].scrollTop;
            if (currentScrollTop + 464 === oldScrollHeight) {
              $('#messages').scrollTop($('#messages')[0].scrollHeight);
            }
          }, 1);
        }
        $scope.updateConversations(data);
      });

      socket.on('update:users', $localStorage.username, function(data) {
        console.log(data);
        if (data) {
          var online_users = Object.keys(data);
          online_users.splice($localStorage.username, 1);
          $scope.online_users = online_users;
        }
      });

      Message.query(data).$promise.then(function(messages) {
        $scope.messages = messages;
        setTimeout(function() {
          $('#messages').scrollTop($('#messages')[0].scrollHeight);
        }, 56);
      });

      User.query().$promise.then(function(users) {
        $scope.users = users;
      });

      Conversation.query().$promise.then(function(conversations) {
        $scope.conversations = conversations;
      });

      data = {'username': $scope.send_to, 'timestamp': new Date()};
      UpdateReadStatus.update({}, data).$promise.then(function(data) {
        if (data.success) {
          // idk what to do here.
        }
      })
    }

    $scope.updateConversations = function(message) {
      var updated = false;
      $scope.conversations.map(function(msg, index) {
        if (message.send_by === msg.user) {
          msg.text = message.text;
          msg.ufile_name = message.ufile_name;
          msg.created_at = message.created_at;
          updated = true;
        }
      });

      if (!updated) {
        $scope.conversations.push({
          user: message.send_by,
          text: message.text,
          ufile_name: message.ufile_name,
          created_at: message.created_at
        });
      }

      $scope.conversations.sort(function(msg1, msg2) {
        return new Date(msg1.created_at) - new Date(msg2.created_at);
      });
    }

    $scope.onSelect = function($item, $model, $value) {
      window.location.href = '/#/' + $value;
    }

    $scope.create_message = function(ufiles) {
      if (!$scope.send_to) {
        $scope.errors = 'No user has been selected.'
        return;
      }

      if (!$scope.text && !ufiles.length) {
        $scope.errors = 'Nothing to send to user (no text/image to upload)';
        return;
      }

      var data = {
        send_by : $localStorage.username,
        send_to : $scope.send_to,
      };

      if ($scope.text) {
        data.text = $scope.text;

        Message.save({}, data).$promise.then(function(message) {
          $scope.messages.push(message);

          setTimeout(function() {
            $('#messages').scrollTop($('#messages')[0].scrollHeight);
          }, 1);

          if (message.send_to !== $localStorage.username) {
            socket.emit('send:message', message, $localStorage.username);
          }

          $scope.updateConversations(message);
        }, function(error){
          $scope.errors = error;
        });
      }
      else if (ufiles.length) {
        for (var i=0; i < ufiles.length; i++) {
          Upload.upload({
            url: 'http://localhost:8000/api/messages/',
            data: {
              ufile: ufiles[i],
              send_by : data['send_by'],
              send_to : data['send_to']
            }
          }).then(
            function (resp) {
              $scope.messages.push(resp.data);

              setTimeout(function() {
                $('#messages').scrollTop($('#messages')[0].scrollHeight);
              }, 1);

              if (resp.data.send_to !== $localStorage.username)
                socket.emit('send:message', resp.data, $localStorage.username);

              $scope.updateConversations(resp.data);
            },
            function (resp) {
              $scope.errors = resp.data;
            }/*,
            function (evt) {
              console.log(evt);
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              console.log('progress: ' + progressPercentage + '% ' + evt.config.data.ufile.name);
            }*/
          );
        }
      }

      $scope.send_by = '';
      $scope.text = '';
      $scope.ufiles = null;
      $scope.errors = '';
    }
  }
})();