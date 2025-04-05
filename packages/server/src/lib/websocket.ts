import { parseBoolean } from './utils';
import socketIO from 'socket.io';
import * as fs from 'fs';
import { isMainThread, parentPort } from 'worker_threads';

const USE_HTTPS = parseBoolean(process.env.USE_HTTPS);
const scheme = USE_HTTPS ? require('https') : require('http');

/**
const server = scheme.createServer(
  USE_HTTPS ?
  {
    key: fs.readFileSync(process.env.KEY_PATH ?? './key.pem'),
    cert: fs.readFileSync(process.env.CERT_PATH ?? './cert.pem'),
  } :
  {}
);
 */

const io = new socketIO.Server({}, { cors: { origin: '*' } });

export function startWebsocketConnection() {
  const port = process.env.WEBSOCKET_PORT ?? '3000';
  io.listen(parseInt(port));
  console.log(`Websocket listening at http://localhost:${port}`);
}

export const emit = (eventName: string, ...messages: any[]) => {
  if(isMainThread) {
    io.emit(eventName, ...messages);
  } else {
    parentPort?.postMessage({ update: eventName, ...messages });
  }
}

export { io };
