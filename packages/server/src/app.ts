import { io } from './lib/websocket';
import { getFrameFromVideoBuffer } from './lib/video';
import { getCardInfoFromAI } from './lib/ai';
import { getCardFromScryfall, getSetsFromScryfall } from './lib/mtg';
import express from 'express';
import multer from 'multer';

export function webServer(): express.Router {
  const app = express.Router();
  const upload = multer({ storage: multer.memoryStorage() });

  app.get('/trigger', (req, res) => {
    io.emit('clicked');
    res.status(204).send();
  });

  app.post('/record', upload.single('file'), async (req, res) => {
    io.emit('requested');
    const frameFileName: string = await getFrameFromVideoBuffer((req as any).file.buffer);
    const info = await getCardInfoFromAI(frameFileName);
    const json = JSON.parse(info);
    if (json.error) {
      io.emit('error');
      res.status(400).send({ error: 'No card detected' });
      return;
    }
    io.emit('waiting_scryfall');
    const card = await getCardFromScryfall(json.set, json.collector_number);
    io.emit('finished', card);
    res.send(card);
  });

  app.get('/scryfall-sets', async (req, res) => {
    const sets = [...new Set(await getSetsFromScryfall())];
    res.send(sets);
  });

  return app;
}
