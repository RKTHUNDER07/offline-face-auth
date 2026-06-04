import {getDBConnection} from './database';

interface SaveAttendanceParams {
  userId: string;

  similarity: number;

  latitude: number | null;

  longitude: number | null;
}

export async function saveAttendance({
  userId,
  similarity,
  latitude,
  longitude,
}: SaveAttendanceParams) {
  const timestamp = new Date().toISOString();

  const db = await getDBConnection();

  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
          INSERT INTO attendance_logs (
            user_id,
            timestamp,
            similarity,
            latitude,
            longitude,
            synced
          )
          VALUES (?, ?, ?, ?, ?, 0)
          `,
        [userId, timestamp, similarity, latitude, longitude],

        () => {
          console.log('ATTENDANCE SAVED LOCALLY');

          resolve();
        },

        (_, error) => {
          console.log('SAVE ATTENDANCE ERROR:', error);

          reject(error);

          return false;
        },
      );
    });
  });
}
