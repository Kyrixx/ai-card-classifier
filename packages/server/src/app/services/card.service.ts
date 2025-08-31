import { Injectable } from '@nestjs/common';
import { MtgJsonRepository } from '../repositories/mtg-json.repository';

@Injectable()
export class CardService {
  constructor(private readonly mtgJsonRepository: MtgJsonRepository) {}

  async getCardFromMtgJson(
    set: string,
    collector_number: number,
  ): Promise<any> {
    try {
      const card = await this.mtgJsonRepository.getCard({
        setCode: set,
        number: collector_number.toString(),
      });
      const prices = await this.mtgJsonRepository.getCardPrice(card.uuid);

      return {
        ...card,
        image_uris: {
          en: this.buildScryfallImageUrl(card?.identifiers?.scryfallid!),
          fr: this.buildGathererImageUrl(
            card.foreignData?.[0]?.multiverseid!?.toString(),
          ),
        },
        prices,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getCardsFromMtgJson(
    cards: { set: string; collector_number: number }[],
  ): Promise<any[]> {
    return await Promise.all(
      cards.map((card) =>
        this.getCardFromMtgJson(card.set, card.collector_number),
      ),
    );
  }

  async getCardsByName(name: string) {
    if (!name || name.trim().length === 0) {
      return [];
    }

    const cards = await this.mtgJsonRepository.getCardsByName(name);
    return cards.map((card) => ({
      setcode: card.setcode,
      number: card.number,
      image_uris: {
        en: this.buildScryfallImageUrl(card.identifiers?.scryfallid),
      },
    }));
  }

  private buildScryfallImageUrl(id: string) {
    const fileFace: string = 'front';
    const fileType: string = 'png';
    const fileFormat: string = 'png';
    const fileName: string = id;
    const dir1: string = fileName.charAt(0);
    const dir2: string = fileName.charAt(1);
    return `https://cards.scryfall.io/${fileType}/${fileFace}/${dir1}/${dir2}/${fileName}.${fileFormat}`;
  }

  private buildGathererImageUrl(id: string): string | null {
    if (!id || id.trim().length === 0) {
      return null;
    }
    return `https://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=${id}`;
  }
}
