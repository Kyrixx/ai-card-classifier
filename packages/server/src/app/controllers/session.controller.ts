import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DbRepository } from '../repositories/db.repository';
import { Card } from '../models/card';
import { MtgJsonRepository } from '../repositories/mtg-json.repository';
import { CardService } from '../services/card.service';

@Controller('session')
export class SessionController {
  constructor(
    private readonly dbRepository: DbRepository,
    private readonly cardService: CardService,
  ) {}

  @Get('/')
  async getSessions() {
    return this.dbRepository.getSessions();
  }

  @Get('/:id')
  async getSession(@Param('id') id: string) {
    const session: any = await this.dbRepository.getSession(id);
    const completeCards: any[] = [];
    for (const card of session.cards) {
      completeCards.push(
        await this.cardService.getCardFromMtgJson(card.setCode, card.number),
      );
    }

    return session;
    // return { ...session, cards: completeCards };
  }

  @Delete('/')
  deleteSessions() {
    return this.dbRepository.cleanEmptySessions();
  }

  @Post('/')
  createSession(@Body('type') type: string, @Body('name') name: string) {
    const session = {
      sessionId: Math.random().toString(36).substring(2, 15),
      type: type,
      name: name ?? '',
    };
    return this.dbRepository.createSession(session);
  }

  @Patch('/:sessionId')
  updateSession(
    @Body('name') name: string,
    @Body('type') type: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.dbRepository.patchSession({ sessionId, name, type });
  }
}
