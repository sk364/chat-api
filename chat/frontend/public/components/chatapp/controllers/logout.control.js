(function() {
    'use strict';

    chatapp.controller('LogoutController', LogoutController);
    LogoutController.$inject = ["$scope", "$window", "$localStorage"];

    function LogoutController($scope, $window, $localStorage) {
        $localStorage.$reset();
        $window.location.href = '/#/login';
    }
})();