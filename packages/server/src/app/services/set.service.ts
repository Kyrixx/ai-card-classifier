import { Injectable, Logger } from '@nestjs/common';
import { MtgJsonRepository } from '../repositories/mtg-json.repository';

@Injectable()
export class SetService {
  private readonly logger = new Logger(SetService.name);
  private setCodeList: string[] = [];
  private forcedSetCodeList: string[] = [];

  constructor(private readonly mtgJsonRepository: MtgJsonRepository) {
    if (this.forcedSetCodeList.length === 0) {
      this.mtgJsonRepository
        .getDistinctSetCodes()
        .then((setCodes) => {
          this.update(setCodes);
        })
        .catch((err) => {
          this.logger.error('Failed to fetch distinct set codes', err);
          this.setCodeList = [];
        });
    } else {
      this.logger.warn(
        `Using forced set code list: ${this.forcedSetCodeList.join(',')}`,
      );
      this.setCodeList = this.forcedSetCodeList;
    }
  }

  get(): string[] {
    return this.setCodeList.map((setCode) => setCode.toUpperCase());
  }

  update(setCodes: string[]): void {
    this.setCodeList = setCodes;
    this.logger.verbose(`Update set codes: ${JSON.stringify(setCodes)}`);
  }
}
