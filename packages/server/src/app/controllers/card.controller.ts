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
      .map((q) => ({ setcode: q.split('-')[0], number: q.split('-')[1] }))
      .filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.setcode === value.setcode && t.number === value.number,
          ),
      );

    for (const cardQuery of cardQueryList) {
      if (cardQuery.setcode.length !== 3 || cardQuery.number.length < 1) {
        throw new Error('Invalid query:' + JSON.stringify(cardQuery));
      }
    }
    const cards: any = await this.cardService.getCardsFromMtgJson(
      cardQueryList.map((c) => ({
        setcode: c.setcode,
        number: parseInt(c.number),
      })),
    );

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
