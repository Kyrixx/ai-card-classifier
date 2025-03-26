import express, { type Request, type Response } from 'express';
import multer from 'multer';
import { io } from '../lib/websocket';
import { getFrameFromVideoBuffer } from '../lib/video';
import { getCardInfoFromAI } from '../lib/ai';
import { assertCardIsUsable, getCardFromScryfall } from '../lib/mtg';

export function root(): express.Router {
  const app = express.Router();
  const upload = multer({ storage: multer.memoryStorage() });

  app.get('/trigger', (req: Request, res: Response) => {
    io.emit('clicked');
    res.status(204).send();
  });

  app.post('/record', upload.single('file'), async (req: Request, res: Response) => {
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
    if (!assertCardIsUsable(card)) {
      io.emit('error');
      console.log(card);
      res.status(400).send({ error: 'Card as issues', card });
      return;
    }
    io.emit('finished', card);
    res.send(card);
  });

  return app;

}
