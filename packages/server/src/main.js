const express = require('express');
const cors = require('cors');
const { getFrameFromVideoBuffer } = require('./utils');
const { getCardInfoFromAI } = require('./ai');
const axios = require('axios');
const { io, startWebsocketConnection } = require('./websocket');
const multer = require('multer');
const { getCardImage } = require('./mtg');
const upload = multer({ storage: multer.memoryStorage() });

startWebsocketConnection();

const app = express();
app.use(cors({
  origin: '*',
}));

app.get('/trigger', (req, res) => {
  io.emit('clicked');
  console.log('triggered');
  res.status(204).send();
});

app.post('/record', upload.single('file'), async (req, res) => {
  const frameFileName = await getFrameFromVideoBuffer(req.file.buffer);
  const info = await getCardInfoFromAI(frameFileName);
  const json = JSON.parse(info);
  const imageUrl = await getCardImage(json.set, json.collector_number);
  res.send(`${imageUrl}`);
});

app.listen(parseInt(process.env.WEBSERVER_PORT), '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${process.env.WEBSERVER_PORT}`);
});
