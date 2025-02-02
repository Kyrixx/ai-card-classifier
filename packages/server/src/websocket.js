const socketIO = require('socket.io');
const io = new socketIO.Server({ cors: { origin: '*' } });
io.listen(parseInt(process.env.WEBSOCKET_PORT));

module.exports = { io };
