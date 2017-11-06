(function() {
  'use strict';

  chatapp.controller('LogoutController', LogoutController);
  LogoutController.$inject = ["$rootScope", "$scope", "$window", "$localStorage"];

  function LogoutController($rootScope, $scope, $window, $localStorage) {
    if ($rootScope.socket) {
      $rootScope.socket.disconnect();
    }
    $localStorage.$reset();
    setTimeout(function() {
      $window.location.href = '/#/login';
    }, 20);
  }
})();