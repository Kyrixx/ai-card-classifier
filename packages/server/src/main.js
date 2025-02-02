const express = require('express');
const cors = require('cors');
const { getFrameFromVideoBuffer } = require('./utils');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { getCardInfoFromAI } = require('./ai');
const axios = require('axios');
const { io } = require('./websocket');

const app = express();
app.use(cors({
  origin: '*',
}));

app.get('/trigger', (req, res) => {
  io.emit('clicked');
  console.log('triggered');
  res.send('Triggered');
});



app.post('/record', upload.single('file'), async (req, res) => {
  const frameFileName = await getFrameFromVideoBuffer(req.file.buffer);
  const info = await getCardInfoFromAI(frameFileName);
  const json = JSON.parse(info);
  const imageUrl = await axios.get(`https://api.scryfall.com/cards/${json.set}/${json.collector_number}/fr`).then((response) => response.data.image_uris.large);
  res.send(`${imageUrl}`);
});

app.listen(3100, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:3100`);
});
