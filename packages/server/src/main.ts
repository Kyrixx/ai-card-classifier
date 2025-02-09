import express from 'express';
import cors from 'cors';
import { startWebsocketConnection } from './lib/websocket';
import { webServer } from './app';

startWebsocketConnection();

const app = express();
app.use(cors({ origin: '*' }));

app.use('/', webServer());

let port = process.env.WEBSERVER_PORT ?? "3100";
app.listen(parseInt(port), '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});
