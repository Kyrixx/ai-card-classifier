import { Controller, Get, Patch, Query } from '@nestjs/common';
import { CollectionService } from '../services/collection.service';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get('price')
  getCollectionPrice() {
    throw new Error('Not implemented.');
  }

  @Patch('/fix')
  fixCollection() {
    throw new Error('Not implemented.');
  }

  @Get('sets')
  getSets() {

  }

  @Get('/by-set')
  async getCardsBySet(@Query('set') set: string) {
    if (!set || set.trim().length === 0) {
      throw new Error('Set code is required');
    }

    const cardsForSet = await this.collectionService.getCardsForSet(set);

    return cardsForSet.reduce<any[]>((acc, item) => {
      if (acc.find((c) => c.number === item.number) === undefined) {
        acc.push(item);
      }
      return acc;
    }, []);
  }

  @Get('/missing')
  getMissingCards() {
    throw new Error('Not implemented.');
  }
}
