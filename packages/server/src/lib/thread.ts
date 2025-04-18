import { Worker } from 'worker_threads';
import * as path from 'path';
import { emit } from './websocket';

export let activeThreads = 0;

export async function runWorker(workerData: { filename: string, sessionId: string, boosterId: number, date: number }) {
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
        emit(message.update);
        log(message.update);

        if(message.update === 'finished') {
          resolve(message.card);
        }

        if(message.error) {
          emit('error', message.error);
          reject(message.error);
        }
      }
    });

    worker.on('error', () => {
      emit('error');
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
