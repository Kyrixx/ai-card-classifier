import express from 'express';
import cors from 'cors';
import * as fs from 'fs';
import * as https from 'https';
import { startWebsocketConnection } from './lib/websocket';
import { webServer } from './app';
import { parseBoolean } from './lib/utils';

startWebsocketConnection();

const app = express();
app.use(cors({ origin: '*' }));

app.use('/', webServer());

let port = process.env.WEBSERVER_PORT ?? "3100";
const useHttps = parseBoolean(process.env.USE_HTTPS);

/**
const server = useHttps
  ? https.createServer({
      key: fs.readFileSync(process.env.KEY_PATH as string),
      cert: fs.readFileSync(process.env.CERT_PATH as string),
    }, app)
  : app;
*/

app.listen(parseInt(port), '0.0.0.0', () => {
  console.log(`Server is running on ${useHttps ? "https" : "http"}://localhost:${port}`);
});
