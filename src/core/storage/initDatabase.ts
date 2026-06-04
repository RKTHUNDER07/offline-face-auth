import {getDBConnection} from './database';

export async function initDatabase() {
  const db = await getDBConnection();

  /*
    REGISTRATIONS TABLE
  */

  await db.executeSql(`

    CREATE TABLE IF NOT EXISTS registrations (

      uid TEXT PRIMARY KEY,

      embeddings TEXT,

      registered_at INTEGER
    );

  `);

  /*
    ATTENDANCE TABLE
  */

  await db.executeSql(`

    CREATE TABLE IF NOT EXISTS attendance_logs (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      user_id TEXT NOT NULL,

      timestamp TEXT NOT NULL,

      similarity REAL NOT NULL,

      latitude REAL,

      longitude REAL,

      synced INTEGER DEFAULT 0
    );

  `);

  console.log('DATABASE INITIALIZED');
}
