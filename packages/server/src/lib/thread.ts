import { isMainThread, Worker } from 'worker_threads';
import * as path from 'path';
import { io } from './websocket';

let activeThreads = 0;

export async function runWorker(workerData: { filename: string }) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, '..', 'worker.js'), {
      workerData: { path: './lib/thread-worker.ts', ...workerData }
    });
    activeThreads++;
    const threadId = worker.threadId;
    const log = (...messages: any[]) => console.log(`[${threadId}]`, ...messages);

    log('Worker started');
    worker.on('message', (message) => {
      if(message.update) {
        if(isMainThread) {
          io.emit(message.update);
          log(message.update);
        }

        if(message.update === 'finished') {
          log('status : finished');
          resolve(message.card);
        }

        if(message.error) {
          log('status : error', message.error);
          io.emit('error');
          reject(message.error);
        }
      }
    });

    worker.on('error', () => {
      io.emit('error');
      reject();
    });

    worker.on('exit', (code) => {
      activeThreads--;
      if (code !== 0){
        reject(new Error(`Worker stopped with exit code ${code}`));
        return;
      }

      log('Worker stopped');
    });
  });
}
