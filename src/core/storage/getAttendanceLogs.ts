import {getDBConnection} from './database';

export async function getAttendanceLogs() {
  const db = await getDBConnection();

  const results = await db.executeSql(`
      SELECT * FROM attendance_logs
      WHERE synced = 0
      ORDER BY timestamp ASC
    `);

  return results[0].rows.raw();
}
