
import {
  getDBConnection,
} from './database';


export async function initDatabase() {

  const db =
    await getDBConnection();

  await db.executeSql(`

    CREATE TABLE IF NOT EXISTS registrations (

      uid TEXT PRIMARY KEY,

      embeddings TEXT,

      registered_at INTEGER
    );

  `);

  console.log(
    'DATABASE INITIALIZED',
  );
}
