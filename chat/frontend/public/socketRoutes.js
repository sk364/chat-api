var fs = require('fs');

const getUsersData = function() {
  var usersData = fs.readFileSync("./usersData.json", 'utf8');
  usersData = usersData ? JSON.parse(usersData) : {};
  return usersData;
}

const setUsersData = function(usersData){
  fs.writeFileSync( "./usersData.json", JSON.stringify(usersData), "utf8");
}

const addUser = function(username, socket_id) {
  usersData = getUsersData();
  (usersData[username] = usersData[username] || []).push(socket_id);
  setUsersData(usersData);

  return usersData;
}

const removeUser = function(username) {
  usersData = getUsersData();
  delete usersData[username];
  setUsersData(usersData);
}

const removeUserSocket = function(username, socket_id) {
  usersData = getUsersData();

  if (usersData[username]) {
    var idx = usersData[username].indexOf(socket_id);
    if (idx >= 0) {
      usersData[username].splice(idx, 1);
    }
    if (usersData[username].length === 0) {
      delete usersData[username];
    }
    setUsersData(usersData);
  }
}

module.exports = function (socket) {
  const username = socket.request._query.username;
  socket.broadcast.emit('update:users', addUser(username, socket.id));
  socket.emit('update:users', getUsersData());

  socket.on('send:message', function (data) {
    const usersData = getUsersData(),
          send_to = data.send_to,
          userSocketIds = usersData[send_to];

    data.is_received = true;
    if (userSocketIds) {
      userSocketIds.map(function(userSocketId, idx) {
        socket.to(userSocketId).emit('get:message', data)
      });
    }
  });

  /*
  // validate a user's name change, and broadcast it on success
  socket.on('change:name', function (data, fn) {
    if (userNames.claim(data.name)) {
      var oldName = name;
      userNames.free(oldName);

      name = data.name;
      
      socket.broadcast.emit('change:name', {
        oldName: oldName,
        newName: name
      });

      fn(true);
    } else {
      fn(false);
    }
  });
  */

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    var timeoutId = setTimeout(function() {
      removeUser(username);
    }, 5000);

    clearTimeout(timeoutId);
    removeUserSocket(username, socket.id);
    socket.broadcast.emit('update:users', getUsersData());
  });
};