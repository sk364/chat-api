(function() {
  'use strict';

  chatapp.controller('LogoutController', LogoutController);
  LogoutController.$inject = ["$scope", "$window", "$localStorage"];

  function LogoutController($scope, $window, $localStorage) {
    $localStorage.$reset();

    setTimeout(function() {
      $window.location.href = '/#/login';
    }, 20);
  }
})();