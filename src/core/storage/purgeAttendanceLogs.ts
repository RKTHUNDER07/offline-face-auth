import {getDBConnection} from './database';

export async function purgeAttendanceLogs() {
  try {
    const db = await getDBConnection();

    /*
      DELETE SYNCED LOGS
      OLDER THAN 7 DAYS
    */

    await db.executeSql(
      `
      DELETE FROM attendance_logs
      WHERE synced = 1
      AND timestamp < datetime(
        'now',
        '-7 days'
      )
      `,
    );

    console.log('OLD SYNCED LOGS PURGED');
  } catch (error) {
    console.log('PURGE ERROR:', error);
  }
}
