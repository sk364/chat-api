angular
    .module('appRoutes', ["ui.router"])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    	function($stateProvider, $urlRouterProvider, $locationProvider) {

    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('welcome', {
            url: '/welcome',
            templateUrl: 'public/components/myapp/templates/welcome.html',
            controller: 'WelcomeController'
        });

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
	        url: '/',
	        templateUrl: 'public/components/myapp/templates/message-list.html',
	        controller: 'MessageController'
	    });

    $stateProvider
        .state('message-user', {
            url: '/{username}',
            templateUrl: 'public/components/myapp/templates/message-user.html',
            controller: 'MessageController'
        });
}]);