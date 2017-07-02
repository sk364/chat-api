angular
    .module('appRoutes', ["ui.router"])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    	function($stateProvider, $urlRouterProvider, $locationProvider) {

    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('welcome', {
            url: '/welcome',
            templateUrl: 'public/components/myapp/templates/welcome.template',
            controller: 'WelcomeController'
        });

    $stateProvider
        .state('settings', {
            url: '/settings',
            templateUrl: 'public/components/myapp/templates/settings.template',
            controller: 'SettingsController'
        });

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'public/components/myapp/templates/login.template',
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
	        templateUrl: 'public/components/myapp/templates/message-list.template',
	        controller: 'MessageController'
	    });

    $stateProvider
        .state('message-user', {
            url: '/{username}',
            templateUrl: 'public/components/myapp/templates/message-user.template',
            controller: 'MessageController'
        });
}]);