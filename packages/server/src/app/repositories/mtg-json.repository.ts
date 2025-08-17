import { Injectable } from '@nestjs/common';
import { mtgJsonPrisma } from '../clients/prisma/mtgjson';
import { Prisma } from '@prisma-client/mtgjson';
import {
  getCardCountForSet,
  getUniqueCardsForSet,
} from '@prisma-client/mtgjson/sql';

@Injectable()
export class MtgJsonRepository {
  async getCard({
    number,
    setCode,
    side,
    language,
  }: {
    number: string;
    setCode: string;
    side?: 'a' | 'b';
    language?: 'French' | 'English';
  }): Promise<
    Prisma.cardsGetPayload<object> & {
      identifiers: Prisma.cardidentifiersGetPayload<object> | null;
      foreignData: (Prisma.cardforeigndataGetPayload<object> | null)[];
    }
  > {
    const card: Prisma.cardsGetPayload<object> =
      await mtgJsonPrisma.cards.findFirstOrThrow({
        where: {
          OR: [
            {
              setcode: setCode.toUpperCase(),
              number,
              side: side ?? 'a',
            },
            {
              setcode: setCode.toUpperCase(),
              number,
              side: null,
            },
          ],
        },
      });

    const cardIdentifier: Prisma.cardidentifiersGetPayload<object> | null =
      await mtgJsonPrisma.cardidentifiers.findFirst({
        where: { uuid: card.uuid },
      });

    const frenchCard: Prisma.cardforeigndataGetPayload<object> | null =
      await mtgJsonPrisma.cardforeigndata.findFirst({
        where: { uuid: card.uuid, language: language ?? 'French' },
      });

    return {
      ...card,
      identifiers: cardIdentifier,
      foreignData: [frenchCard],
    };
  }

  async getCardsByName(name: string) {
    const cards: {
      uuid: string;
      setcode: string | null;
      number: string | null;
    }[] = await mtgJsonPrisma.cards.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: {
        setcode: 'asc',
      },
      select: {
        uuid: true,
        setcode: true,
        number: true,
      },
    });

    const c: any[] = [];
    for (const card of cards) {
      const cardIdentifier: Prisma.cardidentifiersGetPayload<object> | null =
        await mtgJsonPrisma.cardidentifiers.findFirst({
          where: { uuid: card.uuid },
        });

      c.push({
        ...card,
        identifiers: cardIdentifier,
      });
    }

    return c;
  }

  async getDistinctSetCodes() {
    return mtgJsonPrisma.sets
      .findMany({
        where: {
          totalsetsize: { gt: 0 },
          releasedate: { gt: '2015-01-01' },
          type: {
            notIn: ['alchemy', 'promo'],
          },
        },
        select: {
          code: true,
        },
      })
      .then((sets) => sets.map((set) => set.code));
  }

  async getCardCountForSet(set: string) {
    return mtgJsonPrisma.$queryRawTyped(getCardCountForSet(set));
  }

  async getUniqueCardsForSet(set: string) {
    return (await mtgJsonPrisma.$queryRawTyped(getUniqueCardsForSet(set))).map(
      (card) => ({ number: card.number, setcode: card.setcode }),
    );
  }

  async getCardPrice(uuid: string) {
    const prismaPromise = await mtgJsonPrisma.cardprices.findMany({
      select: {
        price: true,
        currency: true,
        priceprovider: true,
      },
      where: {
        uuid,
        gameavailability: 'paper',
        providerlisting: 'retail',
        cardfinish: 'normal',
      },
    });
    return prismaPromise;
  }
}
