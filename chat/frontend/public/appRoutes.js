angular
    .module('appRoutes', ["ui.router"])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    	function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.hashPrefix('');
    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('settings', {
            url: '/settings',
            templateUrl: 'public/components/myapp/templates/settings.html',
            controller: 'SettingsController'
        });

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'public/components/myapp/templates/login.html',
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
	        templateUrl: 'public/components/myapp/templates/message-list.html',
	        controller: 'MessageController'
	    });
}]);