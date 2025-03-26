import express, { type Request, type Response } from 'express';
import { getCardCountForSet } from '../lib/repository/mtg-json';

export function set(): express.Router {
  const app = express.Router();

  app.get('/:set', async (req: Request, res: Response) => {
    res.send(getCardCountForSet(req.params.set));
  })

  return app;
}
