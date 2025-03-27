import { DatabaseSync } from 'node:sqlite';
const myDb = new DatabaseSync('./src/assets/db.sqlite');

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
  INSERT INTO cards (uuid, createdAt, sessionId, boosterId) VALUES (:uuid, datetime(), :sessionId, :boosterId)
`);
export function saveCard(params: { uuid: string, sessionId: string, boosterId: number }) {
  saveCardQuery.run(params);
}
