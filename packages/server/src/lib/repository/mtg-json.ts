import { DatabaseSync } from 'node:sqlite';
const mtgJsonDb = new DatabaseSync('./src/assets/cards.sqlite');
const myDb = new DatabaseSync('./src/assets/db.sqlite');

const getCardCountForSetQuery = mtgJsonDb.prepare(`
  select COUNT(distinct cardIdentifiers.scryfallOracleId) as count, cards.rarity from 'cards'
  INNER JOIN cardIdentifiers ON cards.uuid = cardIdentifiers.uuid
  WHERE cards.setCode = ? AND cardIdentifiers.scryfallOracleId IS NOT NULL
  GROUP BY cards.rarity
`)

export function getCardCountForSet(set: string) {
  return getCardCountForSetQuery.all(set);
}

const getCardQuery = mtgJsonDb.prepare(`
    SELECT uuid
    FROM cards
    WHERE setCode = :set
      AND number = :collectorNumber
`);
export function getCards(params: { set: string, collectorNumber: string }[]): string[] {
  return params.map((param) => {
    return (getCardQuery.get(param) as string).toString();
  })
}

