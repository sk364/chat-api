chatapp.directive('dropdownListener', DropdownListener);

function DropdownListener($window, $rootScope) {
  return {
    restrict: 'A',

    link: function(scope, element, attr) {
      var w = angular.element($window);

      w.bind('click', function(){
        $rootScope.$broadcast('dropdown:close');
      });
    }
  }
}