const socketIO = require('socket.io');
const io = new socketIO.Server({ cors: { origin: '*' } });

function startWebsocketConnection() {
  io.listen(parseInt(process.env.WEBSOCKET_PORT));
}


module.exports = { io, startWebsocketConnection };
