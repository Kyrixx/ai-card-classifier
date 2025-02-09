import { parseBoolean } from './utils';
import socketIO from 'socket.io';
import * as fs from 'fs';

const USE_HTTPS = parseBoolean(process.env.USE_HTTPS);
const scheme = USE_HTTPS ? require('https') : require('http');

const server = scheme.createServer(
  USE_HTTPS ?
  {
    key: fs.readFileSync(process.env.KEY_PATH ?? './key.pem'),
    cert: fs.readFileSync(process.env.CERT_PATH ?? './cert.pem'),
  } :
  {}
);


const io = new socketIO.Server(server, { cors: { origin: '*' } });

export function startWebsocketConnection() {
  const port = process.env.WEBSOCKET_PORT ?? '3000';
  if (USE_HTTPS) {
    server.listen(port, '0.0.0.0', () => {
      console.log(`Websocket listening at https://localhost:${port}`);
    });
  } else {
    io.listen(parseInt(port));
    console.log(`Websocket listening at http://localhost:${port}`);
  }
}

export { io };
