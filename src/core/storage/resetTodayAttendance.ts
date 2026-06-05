import {getDBConnection} from './database';

export async function resetTodayAttendance() {
  try {
    const db = await getDBConnection();

    await db.executeSql(
      `
      DELETE FROM attendance_logs
      WHERE DATE(timestamp)
      =
      DATE('now', 'localtime')
      `,
    );

    console.log('TODAY ATTENDANCE RESET');
  } catch (error) {
    console.log('RESET ERROR:', error);
  }
}
