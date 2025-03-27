import express, { type Request, type Response } from 'express';
import { getCards } from '../lib/repository/mtg-json';
import { deleteCard, saveCard } from '../lib/repository/my-db';
import bodyParser from 'body-parser';

export function save(): express.Router {
  const app = express.Router();

  app.post('/card', bodyParser.json(), async (req: Request, res: Response) => {
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

  app.post('/cards', bodyParser.json(), async (req: Request, res: Response) => {
    if (!Array.isArray(req.body)) {
      res.status(400).send({ error: 'Expected array of cards' });
      return;
    }

    const addedCards: any = [];
    for(const card of req.body) {
      const cardUuids = getCards([{ set: card.set, collectorNumber: card.collectorNumber }]);
      for(const uuid of cardUuids) {
        try {
          const cardInfo = { uuid: uuid, sessionId: card.sessionId, boosterId: card.boosterId, createdAt: card.createdAt };
          saveCard(cardInfo);
          addedCards.push(cardInfo);
        } catch (e) {
        }
      }
    }

    if(req.body.length > 0 && addedCards.length === 0) {
      res.status(409).send({ error: 'All cards already saved' });
      return;
    }
    res.status(204).send(addedCards);
  })

  app.delete('/card', bodyParser.json(), async (req: Request, res: Response) => {
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
