import SQLite
from 'react-native-sqlite-storage';

SQLite.enablePromise(
  true,
);

export async function getDBConnection() {

  return SQLite.openDatabase({

    name: 'edgeauth.db',

    location: 'default',
  });
}
