import { Worker } from 'worker_threads';
import * as path from 'path';
import { emit } from '../../clients/websocket';

export let activeThreads = 0;

export async function runWorker(workerData: {
  filename: string;
  sessionId: string;
  boosterId: number;
  date: number;
}) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, 'thread-worker.js'), {
      workerData: {
        path: './app/services/thread/thread-worker.ts',
        ...workerData,
      },
    });
    activeThreads++;
    const log = (...messages: any[]) =>
      console.log(`[${worker.threadId}]`, ...messages);

    log('Worker started');
    worker.on(
      'message',
      (message: { update: string; error: any; card: any; info: string; }) => {
        if (message.update) {
          emit(message.update);
          log(message.update);

          if (message.update === 'finished') {
            resolve(message.card);
          }

          if (message.error) {
            emit('error', message.error);
            log('Error:', message.error);
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject(message.error);
          }
        }

        if (message.info) {
          log('Info:', message.info);
        }
      },
    );

    worker.on('error', (err) => {
      emit('error');
      reject(err);
    });

    worker.on('exit', (code) => {
      activeThreads--;
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
        return;
      }

      log('Worker stopped');
    });
  });
}
