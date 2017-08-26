angular
    .module('appRoutes', ["ui.router"])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    	function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.hashPrefix('');
    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'public/components/chatapp/templates/login.html',
            controller: 'LoginController'
        });

    $stateProvider
        .state('logout', {
            url: '/logout',
            controller: 'LogoutController'
        });

    $stateProvider
    	.state('message-list', {
	        url: '/{username}',
	        templateUrl: 'public/components/chatapp/templates/message-list.html',
	        controller: 'MessageController'
	    });
}]);