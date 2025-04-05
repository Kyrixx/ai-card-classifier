import axios from 'axios';
import { getCard } from './repository/mtg-json';
import { getPrices } from './repository/mtg-prices';

function buildScryfallImageUrl(id: string) {
  const fileFace: string = 'front';
  const fileType: string = 'png';
  const fileFormat: string = 'png';
  const fileName: string = id;
  const dir1: string = fileName.charAt(0);
  const dir2: string = fileName.charAt(1);
  return `https://cards.scryfall.io/${fileType}/${fileFace}/${dir1}/${dir2}/${fileName}.${fileFormat}`;
}

function buildGathererImageUrl(id: string): string {
  return `https://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=${id}`;
}

export async function getCardFromScryfall(set: string, collector_number: number) {
  return Promise.all([
    axios.get(`https://api.scryfall.com/cards/${set}/${collector_number}/fr`)
      .then((response) => response.data)
      .catch(() => {
        return { fr_status: 404 }
      }),
    axios.get(`https://api.scryfall.com/cards/${set}/${collector_number}`)
      .then((response) => response.data)
      .catch(() => {
        return { en_status: 404 }
      }),
  ]).then(([frResp, enResp]) => {
    if (frResp.fr_status === 404 && enResp.en_status === 404) {
      throw new Error('Card not found');
    }
    return {
      ...frResp,
      ...enResp,
      image_uris: frResp.image_uris || enResp.image_uris,
      prices: {
        ...enResp.prices,
        eur: frResp.prices?.eur || enResp.prices?.eur || enResp.prices?.usd,
      }
    };
  })
    .catch((error) => {
      console.log(`[mtg] https://api.scryfall.com/cards/${set}/${collector_number}`);
      console.log(error);
    });
}

export async function getSetsFromScryfall() {
  return axios.get('https://api.scryfall.com/sets')
    .then((response) => response.data)
    .then((data) => data.data)
    .then((sets) => sets.map((set) => set.parent_set_code).filter((set) => !!set))
    .catch((error) => console.log(error));
}

export function assertCardIsUsable(card: any): boolean {
  if(!card) {
    return false;
  }

  const requiredFields = ['imageUris', 'rarity', 'setCode', 'number', 'name'];
  for(const field of requiredFields) {
    if(!card[field]) {
      console.log(field);
      return false;
    }
  }
  return !!card && !!card.imageUris && !!card.rarity && !!card.setCode && !!card.number && !!card.name;
}

export function getCardFromMtgJson(set: string, collector_number: number) {
  try {
    const card = getCard({ set, collectorNumber: collector_number.toString() }) as any;
    const prices = getPrices(card.uuid);

    return {
      ...card,
      imageUris: { en: buildScryfallImageUrl(card.identifiers.scryfallId), fr: buildGathererImageUrl(card.foreignData[0].multiverseId) },
      prices
    };
  } catch (e) {
    return null;
  }
}
