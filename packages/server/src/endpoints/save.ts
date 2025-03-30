import express, { type Request, type Response } from 'express';
import { getUuids, getCardsByUuids } from '../lib/repository/mtg-json';
import { createSession, deleteCard, getCardsBySessionId, saveCard } from '../lib/repository/my-db';
import bodyParser from 'body-parser';
import { getCardFromMtgJson } from '../lib/mtg';
/*

card: Card;
  boosterId: number;
  date: number;
 */
export function save(): express.Router {
  const app = express.Router();

  app.get('/session/:sessionId', async (req: Request, res: Response) => {
    const cardsBySessionId = getCardsBySessionId(req.params.sessionId);
    const cards = getCardsByUuids([...new Set(cardsBySessionId.map((card: any) => card.uuid))]);
    const result = cardsBySessionId.map((card: any) => {
      const c: any = cards.find((c: any) => c.uuid === card.uuid);
      return {
        card: getCardFromMtgJson(c.setCode, parseInt(c.number)),
        boosterId: card.boosterId,
        date: card.createdAt
      }
    });
    res.status(200).send(result);
  });

  app.post('/session', bodyParser.json(), async (req: Request, res: Response) => {
    if (!req.body.type) {
      res.status(400).send({ error: 'Expected session type' });
      return;
    }
    const session = createSession({ sessionId: Math.random().toString(36).substring(2, 15), type: req.body.type });
    res.status(200).send(session);
  });

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
    for(const card of req.body) {
      const cardUuids = getUuids([{ set: card.set, collectorNumber: card.collectorNumber }]);
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
    const cardUuids = getUuids([{ set: req.body.set, collectorNumber: req.body.collectorNumber }]);
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
