import {
  getDBConnection,
} from './database';


export async function getRegistration(
  uid: string,
) {

  try {

    const db =
      await getDBConnection();

    const results =
      await db.executeSql(

        `
        SELECT *
        FROM registrations
        WHERE uid = ?
        `,

        [uid],
      );

    const rows =
      results[0].rows;

    if (
      rows.length === 0
    ) {

      return null;
    }

    const item =
      rows.item(0);

    return {

      uid: item.uid,

      embeddings:
        JSON.parse(
          item.embeddings,
        ),

      registeredAt:
        item.registered_at,
    };

  } catch (error) {

    console.log(
      'GET ERROR:',
      error,
    );

    return null;
  }
}
