'use strict';

var chatapp = angular.module('chatapp',
[
  'appRoutes',
  'ngStorage',
  'angular-jwt',
  'ngFileUpload',
  'ngResource',
  'ui.bootstrap',
])
.run(function($rootScope, authManager, $window) {
  authManager.checkAuthOnRefresh();
  $rootScope.$on('tokenHasExpired', function() {
    $window.location.href = '/#/logout';
  });
});

chatapp.config(['$qProvider', '$httpProvider', '$localStorageProvider', 'jwtInterceptorProvider', 'jwtOptionsProvider',
  function ($qProvider, $httpProvider, $localStorageProvider,
    jwtInterceptorProvider, jwtOptionsProvider) {
      $qProvider.errorOnUnhandledRejections(false);
      jwtOptionsProvider.config({
        authPrefix: 'JWT ',
        whiteListedDomains: ['localhost'],
        tokenGetter: ['options', function(options) {
          // Skip authentication for any requests ending in .html
          if (options && options.url.substr(options.url.length - 5) == '.html') {
            return null;
          }

          var token = localStorage.getItem('ngStorage-token');
        		
          if (token)
            token = token.substring(1, token.length-1);
            return token;
        }]
      });

  $httpProvider.interceptors.push('jwtInterceptor');
}]);
