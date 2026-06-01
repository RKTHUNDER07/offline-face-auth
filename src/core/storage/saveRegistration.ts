
import {
  getDBConnection,
} from './database';


export async function saveRegistration(
  data: any,
) {

  try {

    const db =
      await getDBConnection();

    await db.executeSql(

      `
      INSERT OR REPLACE INTO registrations
      (
        uid,
        embeddings,
        registered_at
      )

      VALUES (?, ?, ?)
      `,

      [
        data.uid,

        JSON.stringify(
          data.embeddings,
        ),

        data.registeredAt,
      ],
    );

    console.log(
      'REGISTRATION SAVED',
    );

  } catch (error) {

    console.log(
      'SAVE ERROR:',
      error,
    );
  }
}
