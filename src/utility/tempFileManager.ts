import RNFS from 'react-native-fs';

const tempFiles: string[] = [];

export function registerTempFile(path?: string) {
  if (!path) {
    return;
  }

  tempFiles.push(path);
}

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

    tempFiles.length = 0;

    console.log('TEMP FILES CLEARED');
  } catch (error) {
    console.log('CLEAR TEMP ERROR:', error);
  }
}
