import express from 'express';
import { collection, root, save, session, set } from './endpoints';

export function webServer(): express.Router {
  const app = express.Router();

  app.use('/', root());
  app.use('/collection', collection());
  app.use('/set', set());
  app.use('/save', save());
  app.use('/session', session());

  return app;
}
