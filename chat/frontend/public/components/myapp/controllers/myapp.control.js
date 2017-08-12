myapp
  .controller('MessageController', ["$scope", "$window", "$stateParams", "$localStorage", "Message", "Upload", "User", "socket",
    function($scope, $window, $stateParams, $localStorage, Message, Upload, User, socket) {
      if (!('token' in $localStorage)) {
        $window.location.href = '/#/login';
      }

      $scope.send_to = $stateParams.username;
      $scope.text = '';
      $scope.users = [];
      $scope.active_users = [];

      $scope.init = function() {
        socket.init($localStorage.username);

        socket.on('get:message', $localStorage.username, function(data) {
          $scope.messages.push(data);
        });

        var data = {};
        if ($scope.send_to) {
          data = { username: $scope.send_to }
        }

        Message.query(data).$promise.then(function(messages) {
          $scope.messages = messages;
        });

        User.query().$promise.then(function(users) {
          $scope.users = users;
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

            if (message.send_to !== $localStorage.username) {
              socket.emit('send:message', message, $localStorage.username);
            }

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

                if (resp.data.send_to !== $localStorage.username)
                  socket.emit('send:message', resp.data, $localStorage.username);
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
  ]
);