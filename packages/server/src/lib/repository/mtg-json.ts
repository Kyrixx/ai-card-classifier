import { DatabaseSync } from 'node:sqlite';
const mtgJsonDb = new DatabaseSync(process.env.CARDS_DB_PATH as string);

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
    SELECT * FROM cards WHERE setCode = :setCode AND number = :number
`);
const getCardIdentifiersQuery = mtgJsonDb.prepare(`
    SELECT * FROM cardIdentifiers WHERE uuid = :uuid
`);
const getCardFrenchQuery = mtgJsonDb.prepare(`
    SELECT * FROM cardForeignData WHERE uuid = :uuid AND language = 'French'
`);
export function getCard(params: { set: string, collectorNumber: string }) {
  const namedParameters = {
    setCode: params.set.toUpperCase(),
    number: params.collectorNumber.toString(),
  };
  const card: any = getCardQuery.get(namedParameters);
  if(!card || !card.uuid) {
    console.log(`Card not found ${JSON.stringify(namedParameters, null, 2)}`);
    throw new Error('Card not found');
  }
  const identifiers: any = getCardIdentifiersQuery.get({ uuid: card.uuid });
  const french = getCardFrenchQuery.get({ uuid: card.uuid });
  return {
    ...card,
    identifiers: identifiers,
    foreignData: [french],
  };
}
export function getCards(params: { set: string, collectorNumber: string }[]) {
  return params.map((param) => {
    try {
      return getCard(param);
    } catch (e) {
      // console.log(`Card not found ${param.set} ${param.collectorNumber}`);
      return undefined;
    }
  });
}

const getUniqueCardsForSetQuery = mtgJsonDb.prepare(`
    select distinct cardIdentifiers.scryfallOracleId, cards.setCode, cards.number, cards.uuid
    from 'cards'
             INNER JOIN cardIdentifiers ON cards.uuid = cardIdentifiers.uuid
    WHERE cards.setCode = :set
      AND cardIdentifiers.scryfallOracleId IS NOT NULL
`);
const getScryfallOracleIdQuery = mtgJsonDb.prepare(`
    SELECT scryfallOracleId
    FROM cardIdentifiers
    WHERE uuid = :uuid
`);
const getByScryfallOracleIdQuery = mtgJsonDb.prepare(`
  SELECT uuid FROM cardIdentifiers WHERE scryfallOracleId = :scryfallOracleId
`);
export function getMissingCards(actualCards: { set: string, collectorNumber: string }[]) {
  const actualOracleIds = actualCards.map((card) => {
    const cardData = getCard(card);
    return cardData.identifiers.scryfallOracleId;
  });
  const uniqueCardsForSet = getUniqueCardsForSetQuery.all({ set: actualCards[0].set });
  const missingCards = uniqueCardsForSet.filter((card: any) => {
    const oracleId = getScryfallOracleIdQuery.get({ uuid: card.uuid }) as any;
    return !actualOracleIds.includes(oracleId.scryfallOracleId);
  });
  const missingCardsWithUuids = missingCards.map((card: any) => {
    const scryfallOracleId = getScryfallOracleIdQuery.get({ uuid: card.uuid }) as any;
    return {
      ...card,
      uuid: (getByScryfallOracleIdQuery.get({ scryfallOracleId: scryfallOracleId.scryfallOracleId }) as any).uuid
    };
  });
  return missingCards;
}
