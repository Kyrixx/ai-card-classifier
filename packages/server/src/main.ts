import express from 'express';
import cors from 'cors';
import { getFrameFromVideoBuffer } from './utils';
import { getCardInfoFromAI } from './ai';
import { io, startWebsocketConnection } from './websocket';
import multer from 'multer';
import { getCardFromScryfall, getSetsFromScryfall } from './mtg';


const upload = multer({ storage: multer.memoryStorage() });

startWebsocketConnection();

const app = express();
app.use(cors({
  origin: '*',
}));

app.get('/trigger', (req, res) => {
  io.emit('clicked');
  res.status(204).send();
});

app.post('/record', upload.single('file'), async (req, res) => {
  io.emit('requested');
  const frameFileName: string = await getFrameFromVideoBuffer((req as any).file.buffer);
  const info = await getCardInfoFromAI(frameFileName);
  const json = JSON.parse(info);
  io.emit('waiting_scryfall');
  const card = await getCardFromScryfall(json.set, json.collector_number);
  io.emit('finished', card);
  res.send(card);
});

app.get('/scryfall-sets', async (req, res) => {
  const sets = [...new Set(await getSetsFromScryfall())];
  res.send(sets);
})

let port = process.env.WEBSERVER_PORT ?? "3100";
app.listen(parseInt(port), '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${process.env.WEBSERVER_PORT}`);
});
