import express, { type Request, type Response } from 'express';
import { getAllCards, getCardBySetCode, updateCard } from '../lib/repository/my-db';
import { getCardsByUuids, getMissingCards } from '../lib/repository/mtg-json';
import { getPrices } from '../lib/repository/mtg-prices';

export function collection(): express.Router {
  const app = express.Router();

  app.get('/prices', async (req: Request, res: Response) => {
    const cards: any[] = (getAllCards() as any[]);
    const prices = cards.map((card) => {
      const prices: any[] = getPrices(card.uuid as string).filter((price: any) => price.currency === 'EUR');

      return prices.length > 0 ? prices[0].price : '0.00';
    });
    let totalPrice = prices.reduce((acc: any, price: any) => {
      return acc + parseFloat(price);
    }, 0);
    res.send(`${totalPrice.toFixed(2)} €`);
  });

  app.patch('/fix', async (req: Request, res: Response) => {
    const cards: any[] = (getAllCards() as any[]);
    const goodCards = getCardsByUuids(cards.map((card) => card.uuid as string));
    cards.forEach((card) => {
      const uuid = card.uuid as string;
      const goodCard: any = goodCards.find((goodCard: any) => goodCard.uuid === uuid);
      updateCard({
        uuid: uuid,
        setCode: goodCard.setCode,
        number: goodCard.number,
      });
    });

    res.send(`Updated ${cards.length} cards`);
  });

  app.get('/by-set', async (req: Request, res: Response) => {
    if (!req.query.setCode) {
      res.status(400).send({ error: 'Missing setCode' });
      return;
    }
    const cards: any[] = getCardBySetCode(req.query.setCode as string);
    res.send(cards);
  });

  app.get('/missing', async (req: Request, res: Response) => {
    if (!req.query.setCode) {
      res.status(400).send({ error: 'Missing setCode' });
      return;
    }
    const cards: any[] = getCardBySetCode(req.query.setCode as string);
    const missingUuids = getMissingCards(cards.map((card) => ({
      set: card.setCode,
      collectorNumber: `${card.number}`,
    })));
    const missingCards = getCardsByUuids(missingUuids.map((uuid: any) => uuid.uuid));
    res.send(missingCards.map((card: any) => ({
      setCode: card.setCode,
      collectorNumber: card.number,
      uuid: card.uuid,
    })));
    });


  return app;
}
