import express, { type Request, type Response } from 'express';
import {
  cleanEmptySessions,
  createSession,
  getCardsBySessionId,
  getSessions,
  updateSession,
} from '../lib/repository/my-db';
import { getCards } from '../lib/repository/mtg-json';
import { getCardFromMtgJson } from '../lib/mtg';
import bodyParser from 'body-parser';

export function session(): express.Router {
  const app = express.Router();

  app.get('/', async (req: Request, res: Response) => {
    res.status(200).send(getSessions());
  });

  app.get('/:sessionId', async (req: Request, res: Response) => {
    console.log(`[session] Getting session ${req.params.sessionId}`);
    const cardsBySessionId = getCardsBySessionId(req.params.sessionId);
    const cards = getCards(cardsBySessionId.map((card: any) => ({
      set: card.setCode,
      collectorNumber: card.number,
    })));

    // Error handling
    if (!cards || cards.length === 0) {
      res.status(500).send({ error: 'No cards were found' });
      return;
    }
    let notFoundCards = cards.filter(c => c === undefined);
    if (notFoundCards.length > 0) {
      const nfc = cards
        .filter(c => c !== undefined)
        .map((c: any) => c.uuid)
        .reduce((acc: string[], card: any) => {
          return acc.filter(c => c !== card);
        }, cardsBySessionId.map((ca: any) => ca.uuid));
      res.status(500).send({ error: 'Some cards were not found', count: notFoundCards.length, uuids: nfc });
      return;
    }


    const result = cardsBySessionId.map((card: any) => {
      const c: any = cards.find((ca: any) => ca.setCode === card.setCode && parseInt(ca.number) === parseInt(card.number));
      if (!c) {
        console.log(`Card not found ${card.setCode} ${card.number}`);
        return null;
      }
      return {
        _id: card._id,
        card: getCardFromMtgJson(c.setCode, parseInt(c.number)),
        boosterId: card.boosterId,
        date: card.createdAt,
      };
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
    const session = createSession({
      sessionId: Math.random().toString(36).substring(2, 15),
      type: req.body.type,
      name: req.body.name ?? '',
    });
    res.status(200).send(session);
  });

  app.patch('/:sessionId', bodyParser.json(), async (req: Request, res: Response) => {
    if (!req.params.sessionId) {
      res.status(400).send({ error: 'Expected session Id' });
      return;
    }
    const session = updateSession({ sessionId: req.params.sessionId, type: req.body.type, name: req.body.name ?? '' });
    res.status(200).send(session);
  });
  return app;
}
