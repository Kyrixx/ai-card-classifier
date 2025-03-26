import express, { type Request, type Response } from 'express';
import { getCardCountForSet } from '../lib/repository/mtg-json';
import { getSetsFromScryfall } from '../lib/mtg';

export function set(): express.Router {
  const app = express.Router();

  app.get('/:set', async (req: Request, res: Response) => {
    res.send(getCardCountForSet(req.params.set));
  })

  app.get('/scryfall-sets', async (req: Request, res: Response) => {
    const sets = [...new Set(await getSetsFromScryfall())];
    res.send(sets);
  });

  return app;
}
