import { DatabaseSync } from 'node:sqlite';
const mtgJsonDb = new DatabaseSync('./src/assets/cards.sqlite');

const getCardCountForSetQuery = mtgJsonDb.prepare(`
  select COUNT(distinct cardIdentifiers.scryfallOracleId) as count, cards.rarity from 'cards'
  INNER JOIN cardIdentifiers ON cards.uuid = cardIdentifiers.uuid
  WHERE cards.setCode = ? AND cardIdentifiers.scryfallOracleId IS NOT NULL
  GROUP BY cards.rarity
`)
export function getCardCountForSet(set: string) {
  return getCardCountForSetQuery.all(set);
}

const getCardUuidQuery = mtgJsonDb.prepare(`
    SELECT uuid
    FROM cards
    WHERE setCode = :set
      AND number = :collectorNumber
`);
export function getUuids(params: { set: string, collectorNumber: string }[]): string[] {
  return params.map((param) => {
    let newVar = getCardUuidQuery.get({
      set: param.set.toUpperCase(),
      collectorNumber: param.collectorNumber
    }) as any;
    return newVar.uuid as string;
  })
}

const getCardByUuidQuery = mtgJsonDb.prepare(`
    SELECT * FROM cards WHERE uuid = :uuid
`);
export function getCardsByUuids(uuids: string[]) {
  return uuids.map((uuid) => {
    return getCardByUuidQuery.get({ uuid });
  });
}

const distinctSetCodesQuery = mtgJsonDb.prepare(`
    SELECT DISTINCT code
    FROM sets
    WHERE totalSetSize > 0 AND releaseDate > '2015-01-01' AND type not in ('alchemy', 'promo')
`);
export function getDistinctSetCodes(): string[] {
  return distinctSetCodesQuery.all().map((set: any) => set.code);
}

const getCardQuery = mtgJsonDb.prepare(`
    SELECT * FROM cards WHERE setCode = :set AND number = :collectorNumber
`);
const getCardIdentifiersQuery = mtgJsonDb.prepare(`
    SELECT * FROM cardIdentifiers WHERE uuid = :uuid
`);
const getCardFrenchQuery = mtgJsonDb.prepare(`
    SELECT * FROM cardForeignData WHERE uuid = :uuid AND language = 'French'
`);
export function getCard(params: { set: string, collectorNumber: string }) {
  const card: any = getCardQuery.get(params);
  const identifiers: any = getCardIdentifiersQuery.get({ uuid: card.uuid });
  const french = getCardFrenchQuery.get({ uuid: card.uuid });
  return {
    ...card,
    identifiers: identifiers,
    foreignData: [french],
  };
}
