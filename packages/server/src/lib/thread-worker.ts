import { isMainThread, parentPort, workerData } from 'worker_threads';
import { getFrameFromVideoBuffer } from './video';
import { getCardInfoFromAI } from './ai';
import { assertCardIsUsable, getCardFromMtgJson } from './mtg';
import { getUuids } from './repository/mtg-json';
import { saveCard } from './repository/my-db';

const threadMain = async () => {
  const { filename, sessionId, boosterId, date } = workerData;
  const frameFileName: string = await getFrameFromVideoBuffer(filename as string);
  const info = await getCardInfoFromAI(frameFileName);
  const json: { error: any, set: string, collector_number: number } = JSON.parse(info);
  if (json.error) {
    parentPort?.postMessage({ update: 'error', error: { message: 'No card detected' } });
    throw new Error('No card detected');
  }

  parentPort?.postMessage({ update: 'waiting_scryfall' });
  const card = await getCardFromMtgJson(json.set, json.collector_number);
  if (!assertCardIsUsable(card)) {
    parentPort?.postMessage({
      update: 'error', error: {
        message: 'Card has issues', card,
      },
    });
    throw new Error('Card has issues');
  }

  const uuids = getUuids([{ set: json.set, collectorNumber: `${json.collector_number}` }]);
  if (uuids.length === 0) {
    parentPort?.postMessage({ update: 'error', error: { message: 'No UUID found' } });
    throw new Error('No UUID found');
  }

  try {
    saveCard({uuid: uuids[0], sessionId, boosterId, createdAt: date});
  } catch (e) {
    parentPort?.postMessage({ update: 'error', error: { message: 'Card already saved' } });
    throw new Error('Card already saved');
  }
  parentPort?.postMessage({ update: 'finished', card });
  return card;
};

if (!isMainThread) {
  threadMain().then((res) => {
    parentPort?.postMessage(`Completed: ${res.name}`);
  }).catch((error) => {
    parentPort?.postMessage(`Error: ${error}`);
  });
} else {
  throw new Error('This file should not be run directly. It is a worker thread.');
}
