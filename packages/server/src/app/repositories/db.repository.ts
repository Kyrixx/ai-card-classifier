import { Injectable } from '@nestjs/common';
import { dbPrisma } from '../clients/prisma/db';
import { getSessions } from '@prisma-client/db/sql';

@Injectable()
export class DbRepository {
  saveCard(params: {
    uuid: string;
    sessionId: string;
    boosterId: number;
    createdAt: string;
    setCode: string;
    number: number;
  }): Promise<any> {
    return dbPrisma.cards.create({
      data: {
        setCode: params.setCode,
        number: params.number,
        uuid: params.uuid,
        sessionId: params.sessionId,
        boosterId: params.boosterId,
        createdAt: params.createdAt,
      },
    });
  }

  deleteCard(params: { _id: number }): Promise<any> {
    return dbPrisma.cards.delete({
      where: {
        id: params._id,
      },
    });
  }

  createSession(params: {
    sessionId: string;
    type: string;
    name: string;
  }): Promise<any> {
    return dbPrisma.sessions.create({
      data: {
        id: params.sessionId,
        type: params.type,
        name: params.name,
      },
    });
  }

  getSession(id: string) {
    return dbPrisma.sessions.findFirst({
      include: {
        cards: true,
      },
      where: {
        id: id,
      },
    });
  }
  // A CHECK
  getSessions() {
    return dbPrisma.$queryRawTyped(getSessions());
  }

  patchSession(params: { sessionId: string; type: string; name: string }) {
    return dbPrisma.sessions.update({
      where: {
        id: params.sessionId,
      },
      data: {
        type: params.type,
        name: params.name,
      },
    });
  }

  cleanEmptySessions() {
    return dbPrisma.sessions.deleteMany({
      where: {
        cards: {
          none: {},
        },
      },
    });
  }

  updateSession(params: { sessionId: string; type: string; name: string }) {
    return dbPrisma.sessions.update({
      where: {
        id: params.sessionId,
      },
      data: {
        type: params.type,
        name: params.name,
      },
    });
  }

  getCardForSet(params: { setcode: string }) {
    return dbPrisma.cards.findMany({
      where: {
        setCode: params.setcode,
      },
      orderBy: {
        number: 'asc',
      },
    });
  }

  getSets() {
    return dbPrisma.cards.findMany({
      distinct: ['setCode'],
    });
  }
}
