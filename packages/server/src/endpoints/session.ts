import express, { type Request, type Response } from 'express';
import { cleanEmptySessions, createSession, getCardsBySessionId, getSessions } from '../lib/repository/my-db';
import { getCardsByUuids } from '../lib/repository/mtg-json';
import { getCardFromMtgJson } from '../lib/mtg';
import bodyParser from 'body-parser';

export function session(): express.Router {
  const app = express.Router();

  app.get('/', async (req: Request, res: Response) => {
    res.status(200).send(getSessions());
  });

  app.get('/:sessionId', async (req: Request, res: Response) => {
    const cardsBySessionId = getCardsBySessionId(req.params.sessionId);
    const cards = getCardsByUuids([...new Set(cardsBySessionId.map((card: any) => card.uuid))]);
    const result = cardsBySessionId.map((card: any) => {
      const c: any = cards.find((c: any) => c.uuid === card.uuid);
      return {
        _id: card._id,
        card: getCardFromMtgJson(c.setCode, parseInt(c.number)),
        boosterId: card.boosterId,
        date: card.createdAt
      }
    });
    res.status(200).send(result);
  });


  app.delete('/', async (req: Request, res: Response) => {
    cleanEmptySessions();
    res.status(204).send();
  });

  app.post('/', bodyParser.json(), async (req: Request, res: Response) => {
    if (!req.body.type) {
      res.status(400).send({ error: 'Expected session type' });
      return;
    }
    const session = createSession({ sessionId: Math.random().toString(36).substring(2, 15), type: req.body.type });
    res.status(200).send(session);
  });
  return app;
}
