myapp
    .controller('LogoutController', ["$scope", "$window", "$localStorage",
    	function($scope, $window, $localStorage) {
	        $localStorage.$reset();
	        $window.location.href = '/#/login'
		}
	]
);