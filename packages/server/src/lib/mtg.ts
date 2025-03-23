import axios from 'axios';

export async function getCardFromScryfall(set: string, collector_number: number) {
  try {
    const frResp = await axios.get(`https://api.scryfall.com/cards/${set}/${collector_number}/fr`)
      .then((response) => response.data)
    return frResp;
  } catch (e) {
    return axios.get(`https://api.scryfall.com/cards/${set}/${collector_number}`)
      .then((response) => response.data)
      .catch((error) => console.log(`[mtg] https://api.scryfall.com/cards/${set}/${collector_number}`));
  }
}

export async function getSetsFromScryfall() {
  return axios.get('https://api.scryfall.com/sets')
    .then((response) => response.data)
    .then((data) => data.data)
    .then((sets) => sets.map((set) => set.parent_set_code).filter((set) => !!set))
    .catch((error) => console.log(error));
}
