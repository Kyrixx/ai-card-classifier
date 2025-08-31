import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { DbRepository } from '../repositories/db.repository';
import { CardService } from '../services/card.service';

@Controller('card')
export class CardController {
  constructor(
    private readonly dbRepository: DbRepository,
    private readonly cardService: CardService,
  ) {}

  @Get()
  async getCards(@Query('q') query: string) {
    if (query.trim().length === 0) {
      return [];
    }
    const cardQueryList = query
      .split(',')
      .map((q) => ({ setCode: q.split('-')[0], number: q.split('-')[1] }))
      .filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.setCode === value.setCode && t.number === value.number,
          ),
      );

    const cards: any = [];
    for (const cardQuery of cardQueryList) {
      if (cardQuery.setCode.length !== 3 || cardQuery.number.length < 1) {
        throw new Error('Invalid query:' + JSON.stringify(cardQuery));
      }

      const card = await this.cardService.getCardFromMtgJson(
        cardQuery.setCode,
        parseInt(cardQuery.number),
      );
      if (!card) {
        throw new Error('Card not found');
      }
      cards.push(card);
    }

    return cards;
  }

  @Get('/by-name')
  async getCardsByName(@Query('name') name: string) {
    return {
      name,
      cards: await this.cardService.getCardsByName(name),
    };
  }

  @Post()
  addCard() {
    throw new Error('Not implemented.');
  }

  @Post()
  addCards() {
    throw new Error('Not implemented.');
  }

  @Delete(':id')
  deleteCard(@Param('id') id: string) {
    return this.dbRepository.deleteCard({ _id: parseInt(id) });
  }
}
