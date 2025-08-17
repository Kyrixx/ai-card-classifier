import { Injectable } from '@nestjs/common';
import { DbRepository } from '../repositories/db.repository';

@Injectable()
export class CollectionService {
  constructor(private readonly dbRepository: DbRepository) {
  }

  async getCardsForSet(setcode: string) {
    return this.dbRepository.getCardForSet({ setcode });
  }

  async getSets() {
    return this.dbRepository.getSets();
  }
}
