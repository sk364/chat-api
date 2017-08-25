myapp.directive('messageItem', MessageItem);

function MessageItem() {
    var ddo = {
        templateUrl: 'public/components/myapp/templates/message-item.html',
        restrict: 'E'
    }

    return ddo;
}