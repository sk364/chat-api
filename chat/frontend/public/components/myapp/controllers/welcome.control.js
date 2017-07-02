myapp
	.controller('WelcomeController',
		["$scope", "$localStorage", "$window", "$stateParams", "ChangePwd",
		function($scope, $localStorage, $window, $stateParams, ChangePwd) {
			$scope.password = '';
			$scope.confirm_password = '';

			$scope.change_pwd = function() {
				if ($scope.password != $scope.confirm_password) {
					$scope.errors = 'Passwords do not match';
				}

				else {
					ChangePwd.update(
						{
							password: $scope.password,
							confirm_password: $scope.confirm_password
						}
					).$promise.then(function(data) {
						if (data.username)
							$window.location.href = '/#!/';

						else if (data.errors) {
							$scope.errors = data.errors;
						}
					});
				}

				$scope.password = '';
				$scope.confirm_password = '';
			}
		}
	]
);