import { Controller, Get, Param } from '@nestjs/common';
import { MtgJsonRepository } from '../repositories/mtg-json.repository';

@Controller('set')
export class SetController {
  constructor(private readonly mtgJsonRepository: MtgJsonRepository) {}

  @Get(':setCode/card-count')
  setCardCount(@Param('setCode') setCode: string) {
    return this.mtgJsonRepository.getCardCountForSet(setCode);
  }
}
