import ImageResizer from 'react-native-image-resizer';

import RNFS from 'react-native-fs';

import jpeg from 'jpeg-js';

export async function preprocessFace(imagePath: string) {
  try {
    console.log('STARTING PREPROCESS...');

    /*
      STEP 1
      Resize image to 112x112
    */

    const resizedImage = await ImageResizer.createResizedImage(
      imagePath,
      112,
      112,
      'JPEG',
      100,
    );

    console.log('IMAGE RESIZED:', resizedImage.uri);

    /*
      STEP 2
      Read resized image
    */

    const base64Image = await RNFS.readFile(resizedImage.uri, 'base64');

    /*
      STEP 3
      Decode JPEG
    */

    const imageBuffer = Buffer.from(base64Image, 'base64');

    const rawImageData = jpeg.decode(imageBuffer, {
      useTArray: true,
    });

    console.log('IMAGE DECODED:', rawImageData.width, rawImageData.height);

    /*
      STEP 4
      Convert RGBA → RGB tensor
    */

    const floatArray = new Float32Array(1 * 112 * 112 * 3);

    let offset = 0;

    for (let i = 0; i < rawImageData.data.length; i += 4) {
      /*
        RGBA
      */

      const r = rawImageData.data[i];

      const g = rawImageData.data[i + 1];

      const b = rawImageData.data[i + 2];

      /*
        Normalize:
        [0,255]
        →
        [-1,1]
      */

      floatArray[offset++] = (r - 127.5) / 127.5;

      floatArray[offset++] = (g - 127.5) / 127.5;

      floatArray[offset++] = (b - 127.5) / 127.5;
    }

    console.log('TENSOR CREATED:', floatArray.length);

    return floatArray;
  } catch (error) {
    console.log('PREPROCESS ERROR:', error);

    return null;
  }
}
