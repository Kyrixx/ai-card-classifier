import express, { type Request, type Response } from 'express';
import { getCardCountForSet } from '../lib/repository/mtg-json';
import { getSetsFromScryfall } from '../lib/mtg';

export function set(): express.Router {
  const app = express.Router();

  app.get('/:set/card-count', async (req: Request, res: Response) => {
    let cardCountForSet = getCardCountForSet(req.params.set.toUpperCase());
    res.send([
      ...cardCountForSet,
      { rarity: 'total', count: cardCountForSet.reduce((acc: number, curr: any) => acc + curr.count, 0) }
    ]);
  })

  app.get('/scryfall-sets', async (req: Request, res: Response) => {
    const sets = [...new Set(await getSetsFromScryfall())];
    res.send(sets);
  });

  return app;
}
