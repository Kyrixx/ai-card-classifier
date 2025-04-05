import express, { type Request, type Response } from 'express';
import { getUuids, getCardsByUuids } from '../lib/repository/mtg-json';
import {
  cleanEmptySessions,
  createSession,
  deleteCard,
  getCardsBySessionId,
  getSessions,
  saveCard,
} from '../lib/repository/my-db';
import bodyParser from 'body-parser';
import { getCardFromMtgJson } from '../lib/mtg';

export function save(): express.Router {
  const app = express.Router();

  app.post('/card', bodyParser.json(), async (req: Request, res: Response) => {
    const cardUuids = getUuids([{ set: req.body.set, collectorNumber: req.body.collectorNumber }]);
    for(const uuid of cardUuids) {
      try {
        saveCard({ uuid: uuid, sessionId: req.body.sessionId, boosterId: req.body.boosterId, createdAt: req.body.createdAt });
      } catch (e) {
        res.status(409).send({ error: 'Card already saved' });
        console.log(e);
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
    let count = 0;
    for(const card of req.body) {
      const cardUuids = getUuids([{ set: card.set, collectorNumber: card.collectorNumber }]);
      for(const uuid of cardUuids) {
        try {
          const cardInfo = { uuid: uuid, sessionId: card.sessionId, boosterId: card.boosterId, createdAt: card.createdAt };
          const addedId = saveCard(cardInfo);
          addedCards.push({ ...cardInfo, _id: addedId });
        } catch (e) {
          count++;
        }
      }
    }

    console.log(`Saved ${addedCards.length} cards, ${count} already saved`);
    if(req.body.length > 0 && addedCards.length === 0) {
      res.status(409).send({ error: 'All cards already saved' });
      return;
    }
    res.status(200).send(addedCards);
  })

  app.delete('/card', bodyParser.json(), async (req: Request, res: Response) => {
    deleteCard({ _id: req.body._id });
    res.status(204).send();
  })

  return app;
}
