const axios = require('axios');

async function getCardImage(set, collector_number) {
  return axios.get(`https://api.scryfall.com/cards/${set}/${collector_number}/fr`).then((response) => response.data.image_uris.large);
}

module.exports = { getCardImage };
