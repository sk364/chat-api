chatapp.directive('messageItem', MessageItem);

function MessageItem() {
    var ddo = {
        templateUrl: 'public/components/chatapp/templates/message-item.html',
        restrict: 'E'
    }

    return ddo;
}