import {getDBConnection} from './database';

export async function markAttendanceAsSynced(id: number) {
  const db = await getDBConnection();

  await db.executeSql(
    `
    UPDATE attendance_logs
    SET synced = 1
    WHERE id = ?
    `,
    [id],
  );

  console.log('ATTENDANCE MARKED SYNCED:', id);
}
