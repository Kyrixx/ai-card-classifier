const socketIO = require('socket.io');
const io = new socketIO.Server({ cors: { origin: '*' } });
io.listen(3000);

module.exports = { io };
