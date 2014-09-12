/**
 * @file
 * Provides web-socket intergration through socket.io.
 */

// Private variables.
var sio;

var secureConnect = function secureConnectEnable(secret) {
  var socketio_jwt = require('socketio-jwt');
  sio.set('authorization', socketio_jwt.authorize({
    secret: secret,
    handshake: true
  }));
};

var SocketIO = function(server, secret) {
  var self = this;

  // Get socket.io started.
  sio = require('socket.io')(server);

  if (secret !== undefined) {
    secureConnectEnable(secret);
  }
}

SocketIO.prototype.on = function on(eventName, callback) {
  sio.on(eventName, function() {
    var args = arguments;
    callback.apply(sio, args);
  });
}

SocketIO.prototype.emit = function emit(eventName, data, callback) {
  sio.emit(eventName, data, function() {
    if (callback) {
      var args = arguments;
      callback.apply(sio, args);
    }
  });
}

module.exports = function (options, imports, register) {
  // Runned here to esure that only exists one socket server.
  var socketIO = new SocketIO(imports.server, options.secret || undefined);

  // Register exposed function with architect.
  register(null, {
    onDestruct: function (callback) {
      server.close(callback);
      logger.debug('Express server stopped');
    },
    "socket": socketIO
  });
};