myapp
  .controller('MessageController', ["$scope", "$window", "$stateParams", "$localStorage", "Message", "Upload",
    function($scope, $window, $stateParams, $localStorage, Message, Upload) {
      if (!('token' in $localStorage)) {
        $window.location.href = '/#!/login';
      }

      $scope.send_to = $stateParams.username;
      $scope.text = '';
      $scope.users = ['a@iiitdmj.ac.in'];

      $scope.init = function() {
        Message.query({username:$scope.send_to}).$promise.then(
          function(messages) {
            $scope.messages = messages;
          }
        );
      }

      $scope.onSelect = function($item, $model, $value) {
        window.location.href = '/#!/' + $item;
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

          Message.save({}, data).$promise.then(function(data) {
            $scope.messages.push(data);

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
        $scope.send_to = '';
        $scope.text = '';
        $scope.ufiles = null;
        $scope.errors = '';
      }
    }
  ]
);