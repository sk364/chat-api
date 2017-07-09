myapp.controller('LoginController',
    ["$scope", "$state", "$localStorage", "$window", "$stateParams", "Login", "GLogin",
      function($scope, $state, $localStorage, $window, $stateParams, Login, GLogin) {
        $scope.username = '';
        $scope.password = '';
        $scope.errors = '';
        $blankFieldErrMsg = 'Field(s) cannot be left blank.';
        $unlistedDomainErrMsg = 'Only IIIT mail id (@iiitdmj.ac.in) is allowed.';

        $scope.login = function() {
          if (!$scope.username || !$scope.password){
            $scope.errors = $blankFieldErrMsg;
            return;
          }

          Login.query({username: $scope.username, password: $scope.password}).$promise.then(function(data) {
            if(data.token) {
              $localStorage.token = data.token;
              $localStorage.username = $scope.username;
              $state.transitionTo('message-list', $stateParams, {
                reload: true, inherit: false, notify: true
              });
            }
          }, function(error) {
            if ('non_field_errors' in error.data) {
              $scope.errors = error.data.non_field_errors[0];
            }
            else if ('username' in error.data || 'password' in error.data) {
              $scope.errors = $blankFieldErrMsg;
            }
          });
        };

        $scope.glogin = function(id_token) {
          GLogin.save({id_token: id_token}).$promise.then(function(data) {
            if (data.token) {
              $localStorage.token = data.token;
              $localStorage.username = data.username;
              $state.transitionTo('message-list', $stateParams, {
                reload: true, inherit: false, notify: true
              });
            }
          }, function(error) {
            var err_resp = error.data.errors;
            if (err_resp === 'Unlisted domain.'){
              $scope.errors = $unlistedDomainErrMsg;
            }

            $('.abcRioButtonContents').html('Sign in with Google');
          });
        }
		}
	]
);