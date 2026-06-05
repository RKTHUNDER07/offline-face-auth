import RNFS from 'react-native-fs';

const tempFiles: string[] = [];

/*
  REGISTER TEMP FILE
*/

export function registerTempFile(path?: string) {
  if (!path) {
    return;
  }

  tempFiles.push(path);

  console.log('TEMP FILE REGISTERED:', path);
}

/*
  CLEAR ALL TEMP FILES
*/

export async function clearTempFiles() {
  try {
    for (const path of tempFiles) {
      try {
        await RNFS.unlink(path);

        console.log('TEMP FILE DELETED:', path);
      } catch (error) {
        console.log('DELETE FAILED:', path);
      }
    }

    /*
      RESET REGISTRY
    */

    tempFiles.length = 0;

    console.log('ALL TEMP FILES CLEARED');
  } catch (error) {
    console.log('CLEAR TEMP ERROR:', error);
  }
}
