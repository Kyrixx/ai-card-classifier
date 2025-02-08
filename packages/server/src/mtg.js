const axios = require('axios');

async function getCardFromScryfall(set, collector_number) {
  return axios.get(`https://api.scryfall.com/cards/${set}/${collector_number}`)
    .then((response) => response.data)
    .catch((error) => console.log(`https://api.scryfall.com/cards/${set}/${collector_number}/fr`));
}

async function getSetsFromScryfall() {
  return axios.get('https://api.scryfall.com/sets')
    .then((response) => response.data)
    .then((data) => data.data)
    .then((sets) => sets.map((set) => set.parent_set_code).filter((set) => !!set))
    .catch((error) => console.log(error));
}

module.exports = { getCardFromScryfall, getSetsFromScryfall };
