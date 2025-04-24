import { DatabaseSync } from 'node:sqlite';

const myDb = new DatabaseSync(process.env.COLLECTION_DB_PATH as string);

export function setupUp() {
  myDb.exec(`
      create table if not exists cards 
      (
          _id       INTEGER   not null /*autoincrement needs PK*/
              constraint cards_pk
                  unique,
          uuid      TEXT,
          createdAt TIMESTAMP not null,
          sessionId TEXT,
          boosterId integer
      );

      create index cards__id_index
          on cards (_id);

      create index cards_uuid_index
          on cards (uuid);
  `);
}

const saveCardQuery = myDb.prepare(`
  INSERT INTO cards (uuid, createdAt, sessionId, boosterId, setCode, number) VALUES (:uuid, datetime(:createdAt, 'unixepoch'), :sessionId, :boosterId, :setCode, :number)
`);
export function saveCard(params: { uuid: string, sessionId: string, boosterId: number, createdAt: number, setCode?: string, number?: number }) {
  const statement = saveCardQuery.run({
    ...params,
    setCode: params?.setCode ?? null,
    number: params?.number ?? null,
    createdAt: params.createdAt / 1000,
  });
  return statement.lastInsertRowid;
}

const deleteCardQuery = myDb.prepare(`
  DELETE FROM cards 
  WHERE _id = :_id
`);
export function deleteCard(params: { _id: number }) {
  deleteCardQuery.run(params);
}

const createSessionQuery = myDb.prepare(`
  INSERT INTO sessions (sessionId, name, type) VALUES (:sessionId, :name, :type)
`);
const getSessionsByIdQuery = myDb.prepare(`
  SELECT * FROM sessions WHERE sessionId = :id
`);
export function createSession(params: { sessionId: string, type: string, name: string }) {
  createSessionQuery.run(params);
  return getSessionsByIdQuery.get({ id: params.sessionId });
}

const getCardsBySessionIdQuery = myDb.prepare(`
  SELECT * FROM cards WHERE sessionId = :sessionId
`);
export function getCardsBySessionId(sessionId: string) {
  return getCardsBySessionIdQuery.all({ sessionId });
}

const getSessionsQuery = myDb.prepare(`
    SELECT
        sessions.sessionId,
        sessions.type,
        sessions.name,
        COUNT(*) as card_count,
        COUNT(DISTINCT cards.boosterId) as booster_count
    FROM sessions
             INNER JOIN main.cards cards on sessions.sessionId = cards.sessionId
    GROUP BY cards.sessionId
`);
export function getSessions() {
  return getSessionsQuery.all();
}

const cleanEmptySessionsQuery = myDb.prepare(`
  DELETE FROM sessions WHERE sessionId NOT IN (SELECT DISTINCT sessionId FROM cards)
`);
export function cleanEmptySessions() {
  console.log(`[my-db] Cleaning empty sessions`);
  cleanEmptySessionsQuery.run();
}

const updateSessionQuery = myDb.prepare(`
  UPDATE sessions SET type = :type, name = :name WHERE sessionId = :sessionId
`);
export function updateSession(params: { sessionId: string, type: string, name: string }) {
  updateSessionQuery.run(params);
  return getSessionsByIdQuery.get({ id: params.sessionId });
}

const getAllCardsQuery = myDb.prepare(`
    SELECT DISTINCT(uuid) FROM cards
`);
export function getAllCards() {
  return getAllCardsQuery.all();
}

const updateCardQuery = myDb.prepare(`
    UPDATE cards SET setCode = :setCode, number = :number WHERE uuid = :uuid
`);
export function updateCard(params: { setCode: string, number: number, uuid: string }) {
  updateCardQuery.run(params);
}

const getCardBySetCodeQuery = myDb.prepare(`
    SELECT DISTINCT(uuid), setCode, number FROM cards WHERE setCode = :setCode ORDER BY number
`);
export function getCardBySetCode(setCode: string) {
  return getCardBySetCodeQuery.all({ setCode });
}
