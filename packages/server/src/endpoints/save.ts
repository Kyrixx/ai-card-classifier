import express, { type Request, type Response } from 'express';
import { getCards } from '../lib/repository/mtg-json';
import { deleteCard, saveCard } from '../lib/repository/my-db';
import bodyParser from 'body-parser';

export function save(): express.Router {
  const app = express.Router();

  app.post('/card', bodyParser(), async (req: Request, res: Response) => {
    const cardUuids = getCards([{ set: req.body.set, collectorNumber: req.body.collectorNumber }]);
    for(const uuid of cardUuids) {
      try {
        saveCard({ uuid: uuid, sessionId: req.body.sessionId, boosterId: req.body.boosterId, createdAt: req.body.createdAt });
      } catch (e) {
        res.status(409).send({ error: 'Card already saved' });
        return;
      }
    }
    res.status(204).send();
  })

  app.delete('/card', bodyParser(), async (req: Request, res: Response) => {
    const cardUuids = getCards([{ set: req.body.set, collectorNumber: req.body.collectorNumber }]);
    for(const uuid of cardUuids) {
      try {
        deleteCard({ uuid: uuid, sessionId: req.body.sessionId, boosterId: req.body.boosterId, createdAt: req.body.createdAt });
      } catch (e) {
        res.status(409).send({ error: 'Card already saved' });
        return;
      }
    }
    res.status(204).send();
  })

  return app;
}
