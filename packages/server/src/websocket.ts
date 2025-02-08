import socketIO from 'socket.io';
import * as fs from 'fs';
import https from 'https';

const httpsServer = https.createServer({
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem")
});
const io = new socketIO.Server(httpsServer, { cors: { origin: '*' } });

export function startWebsocketConnection() {
  io.listen(parseInt(process.env.WEBSOCKET_PORT ?? '3000'));
  // httpsServer.listen(process.env.WEBSOCKET_PORT, '0.0.0.0', () => {
  //   console.log(`Websocket listening at https://localhost:${process.env.WEBSOCKET_PORT}`);
  // });
}

export { io };
