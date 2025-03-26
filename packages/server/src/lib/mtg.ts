import axios from 'axios';

export async function getCardFromScryfall(set: string, collector_number: number) {
  console.log(`[mtg] ${set}/${collector_number}`);
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

export function getSetInfoFromScryfall(set: string) {
  return axios.get(`https://api.scryfall.com/sets/${set}`)
    .then((response) => response.data)
    .catch((error) => console.log(error));
}

export function getCardCountForSet(set: string) {
  return axios.get(`https://api.scryfall.com/cards/search?order=set&q=e%3A${set}&unique=cards`)
    .then((response) => response.data.total_cards)
    .catch((error) => console.log(error));
}

export function assertCardIsUsable(card: any): boolean {
  return !!card && !!card.image_uris && !!card.rarity && !!card.set && !!card.collector_number && !!card.name;
}
