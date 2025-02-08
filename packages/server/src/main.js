const express = require('express');
const cors = require('cors');
const { getFrameFromVideoBuffer } = require('./utils');
const { getCardInfoFromAI } = require('./ai');
const { io, startWebsocketConnection } = require('./websocket');
const multer = require('multer');
const { getCardFromScryfall, getSetsFromScryfall } = require('./mtg');
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
  const frameFileName = await getFrameFromVideoBuffer(req.file.buffer);
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

app.listen(parseInt(process.env.WEBSERVER_PORT), '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${process.env.WEBSERVER_PORT}`);
});
