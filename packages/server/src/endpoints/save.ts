import express, { type Request, type Response } from 'express';
import { getCards } from '../lib/repository/mtg-json';
import { saveCard } from '../lib/repository/my-db';

export function save(): express.Router {
  const app = express.Router();

  app.post('/card', async (req: Request, res: Response) => {
    const cardUuids = getCards([{ set: req.body.set, collectorNumber: req.body.collectorNumber }]);
    cardUuids.forEach((uuid) => {
      saveCard({ uuid: uuid, sessionId: req.body.sessionId, boosterId: req.body.boosterId });
    });
  })

  return app;
}
