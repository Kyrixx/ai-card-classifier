const socketIO = require('socket.io');
const fs = require("fs");
const https = require("https");

const key = fs.readFileSync("./key.pem");
const cert = fs.readFileSync("./cert.pem");
const httpsServer = https.createServer({
  key,
  cert
});

const io = new socketIO.Server(httpsServer, { cors: { origin: '*' } });


function startWebsocketConnection() {
  io.listen(parseInt(process.env.WEBSOCKET_PORT));
  // httpsServer.listen(process.env.WEBSOCKET_PORT, '0.0.0.0', () => {
  //   console.log(`Websocket listening at https://localhost:${process.env.WEBSOCKET_PORT}`);
  // });
}


module.exports = { io, startWebsocketConnection };
