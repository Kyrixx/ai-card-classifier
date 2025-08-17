import { isMainThread, parentPort, workerData } from 'worker_threads';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { AiService } from '../ai.service';
import { VideoProcessorService } from '../video-processor.service';
import { CardService } from '../card.service';
import { DbRepository } from 'src/app/repositories/db.repository';
import slugify from 'slugify';
import { Logger } from '@nestjs/common';

const formatDate = (date: string) => {
  const dateObj = new Date(date);
  const formatter = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts = formatter.formatToParts(dateObj).reduce(
    (acc, part) => {
      if (part.type !== 'literal') {
        acc[part.type] = part.value;
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
};
const threadMain = async (): Promise<any> => {
  const { filename, sessionId, boosterId, date } = workerData;

  const app = await NestFactory.createApplicationContext(AppModule);
  const aiService = app.get(AiService);
  const videoProcessorService = app.get(VideoProcessorService);
  const cardService = app.get(CardService);
  const dbRepository = app.get(DbRepository);

  const frameFileName: string = await videoProcessorService.getFrameFromBuffer(
    filename as string,
  );
  const json: {
    error: any;
    set: string;
    collector_number: number;
    name: string;
  } = JSON.parse(await aiService.getCardInfoFromAI(frameFileName));

  if (json.error) {
    parentPort?.postMessage({
      update: 'error',
      error: { message: 'No card detected' },
    });
    throw new Error('No card detected');
  }
  parentPort?.postMessage({ update: 'waiting_scryfall' });

  const card = await cardService.getCardFromMtgJson(
    json.set,
    json.collector_number,
  );

  if (
    !!card.foreignData[0] &&
    card.foreignData?.[0].name?.length > 0 &&
    slugify(card.foreignData[0].name) !== slugify(json.name)
  ) {
    console.log('Card name mismatch:', card.foreignData[0].name, json.name);
    parentPort?.postMessage({
      update: 'error',
      error: { message: 'Card name does not match AI detection' },
    });
    parentPort?.postMessage({ info: card.foreignData[0].name });
    throw new Error('Card name does not match AI detection');
  }

  try {
    await dbRepository.saveCard({
      uuid: card.uuid,
      setCode: card.setcode,
      number: parseInt(card.number, 10),
      sessionId,
      boosterId,
      createdAt: formatDate(date),
    });
  } catch (e) {
    console.log(e);
    parentPort?.postMessage({
      update: 'error',
      error: { message: 'Card already saved' },
    });
    throw new Error('Card already saved');
  }
  parentPort?.postMessage({ update: 'finished', card });
  return card;
};

if (!isMainThread) {
  threadMain()
    .then((res) => {
      parentPort?.postMessage(`Completed: ${res.name}`);
    })
    .catch((error) => {
      parentPort?.postMessage(`Error: ${error}`);
    });
} else {
  throw new Error(
    'This file should not be run directly. It is a worker thread.',
  );
}
