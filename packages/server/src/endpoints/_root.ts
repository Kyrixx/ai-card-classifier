import express, { type Request, type Response } from 'express';
import multer from 'multer';
import { io } from '../lib/websocket';
import { getFrameFromVideoBuffer } from '../lib/video';
import { getCardInfoFromAI } from '../lib/ai';
import { assertCardIsUsable, getCardFromMtgJson } from '../lib/mtg';
import { getVersion } from '../lib/repository/mtg-prices';
import axios from 'axios';
import * as fs from 'fs';

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
    const card = await getCardFromMtgJson(json.set, json.collector_number);
    if (!assertCardIsUsable(card)) {
      io.emit('error');
      res.status(400).send({ error: 'Card as issues', card });
      return;
    }
    io.emit('finished', card);
    res.send(card);
  });

  app.post('/update-prices', async (req: Request, res: Response) => {
    const currentVersion = getVersion() as string;
    let date = new Date(currentVersion);
    const now = new Date();
    if(date.getDate() !== now.getDate() || date.getMonth() !== now.getMonth() || date.getFullYear() !== now.getFullYear()) {
      const file = (await axios.get('https://mtgjson.com/api/v5/AllPricesToday.sqlite', {
        responseType: 'arraybuffer',
        onDownloadProgress: (progressEvent) => {
          console.log(Math.round((progressEvent.progress ?? 0) * 100) + '%');
        }
      })).data;
      fs.writeFileSync('./src/assets/prices.sqlite', file);
      res.send('ok');
    } else {
      console.log('Prices already up to date');
      res.status(304).send('Prices already up to date');
    }

    //
  });

  return app;

}
