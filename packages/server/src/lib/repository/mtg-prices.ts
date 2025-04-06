import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync(process.env.CARD_PRICES_DB_PATH as string);

const getVersionQuery = db.prepare(`
  SELECT DISTINCT date FROM cardPrices
`)
export function getVersion() {
  return (getVersionQuery.get() as any).date;
}

const getPricesQuery = db.prepare(`
  SELECT price, currency, priceProvider FROM cardPrices WHERE uuid = :uuid AND gameAvailability = 'paper' AND providerListing = 'retail' AND cardFinish = :cardFinish
`)
export function getPrices(uuid: string, cardFinish: string = 'normal') {
  return getPricesQuery.all({ uuid, cardFinish });
}
