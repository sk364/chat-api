'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
myapp.factory('socket', function ($rootScope) {
  var server = 'http://localhost:8081/';
  return {
    on: function (eventName, username, callback) {
      var socket = io.connect(server, {query: {username: username}});
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, username, callback) {
      var socket = io.connect(server, {query: {username: username}});
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
    }
  };
});
