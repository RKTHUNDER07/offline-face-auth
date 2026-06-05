import {getDBConnection} from './database';

export async function getTodayAttendance() {
  try {
    const db = await getDBConnection();

    const results = await db.executeSql(
      `
        SELECT *
        FROM attendance_logs
        WHERE DATE(timestamp)
        =
        DATE('now', 'localtime')
        ORDER BY timestamp DESC
        LIMIT 1
        `,
    );

    const rows = results[0].rows.raw();

    if (!rows.length) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.log('TODAY ATTENDANCE ERROR:', error);

    return null;
  }
}
