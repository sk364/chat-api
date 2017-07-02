myapp.controller('LoginController',
    ["$scope", "$localStorage", "$window", "$stateParams", "Login", "GLogin",
    	function($scope, $localStorage, $window, $stateParams, Login, GLogin) {
    		$scope.non_field_errors = '';
    		$scope.field_errors = '';

    		if ('token' in $localStorage) {
    			$window.location.href = '/#!/';
    		}

    		$scope.login = function(username, password) {
		        Login.query({username: username, password: password})
		        	.$promise.then(function(data) {
		            
					if(data.token) {
		            	$localStorage.token = data.token;
		            	$localStorage.username = username;
		            	$window.location.href = '/#!/';
		            }

		        }, function(error) {
		        	if ('non_field_errors' in error.data) {
		        		$scope.non_field_errors = error.data.non_field_errors[0];
		        	}
		        	else if ('username' in error.data || 'password' in error.data) {
		        		$scope.field_errors = error.data.username[0] || error.data.password[0];
		        	}
		        });
			};

			$scope.glogin = function(id_token) {
				GLogin.save({id_token: id_token})
					.$promise.then(function(data) {
					
					if (data.token) {
						$localStorage.token = data.token;
						$localStorage.username = data.username;

						if (data.first_time) {
							$window.location.href = '/#!/welcome';
						}
						else {
							$window.location.href = '/#!/';
						}
					}
				});
			}
		}
	]
);