import * as socketIO from 'socket.io';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import { isMainThread, parentPort } from 'worker_threads';
import { environment } from '../../environment';

const server = environment.useHttps
  ? https.createServer(environment.httpsOptions)
  : http.createServer();

const io = new socketIO.Server(server, { cors: { origin: '*' } });

export function startWebsocketConnection() {
  if (environment.useHttps) {
    server.listen(environment.websocketPort, '0.0.0.0', () => {
      console.log(
        `Websocket listening at https://localhost:${environment.websocketPort}`,
      );
    });
  } else {
    io.listen(environment.websocketPort);
    console.log(
      `Websocket listening at http://localhost:${environment.websocketPort}`,
    );
  }
}

export const emit = (eventName: string, ...messages: any[]) => {
  if (isMainThread) {
    io.emit(eventName, ...messages);
  } else {
    parentPort?.postMessage({ update: eventName, ...messages });
  }
};

export { io };
