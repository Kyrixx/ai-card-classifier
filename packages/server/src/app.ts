import express from 'express';
import { root, save, set } from './endpoints';

export function webServer(): express.Router {
  const app = express.Router();

  app.use('/', root());
  app.use('/set', set());
  app.use('/save', save());

  return app;
}
