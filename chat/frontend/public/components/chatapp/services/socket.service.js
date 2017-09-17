'use strict';

chatapp.factory('socket', ['$rootScope', 'config', function ($rootScope, config) {
  var server = config.socketServerUrl;
  return {
    on: function (socket, eventName, username, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (socket, eventName, data, username, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    },
    init: function(username, callback) {
      var socket = io.connect(server, {query: {username: username}});
      $rootScope.$apply(function () {
        if (callback) {
          callback.apply(socket, args);
        }
      });
      return socket;
    }
  };
}]);
