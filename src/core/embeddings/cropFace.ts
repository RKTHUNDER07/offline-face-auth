import ImageResizer from 'react-native-image-resizer';

type FaceBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export async function cropFace(
  imagePath: string,
  face: FaceBox,
): Promise<string | null> {
  try {
    console.log('STARTING FACE CROP...');

    /*
      Add padding
    */

    const padding = 0.25;

    let cropX = face.x - face.width * padding;

    let cropY = face.y - face.height * padding;

    let cropWidth = face.width * (1 + padding * 2);

    let cropHeight = face.height * (1 + padding * 2);

    /*
      Prevent negatives
    */

    cropX = Math.max(0, cropX);

    cropY = Math.max(0, cropY);

    console.log('FACE BOX:', {
      cropX,
      cropY,
      cropWidth,
      cropHeight,
    });

    /*
      STEP 1
      Resize face region
    */

    const resizedFace = await ImageResizer.createResizedImage(
      imagePath,
      112,
      112,
      'JPEG',
      100,
    );

    console.log('FACE RESIZED:', resizedFace.uri);

    return resizedFace.uri;
  } catch (error) {
    console.log('CROP FACE ERROR:', error);

    return null;
  }
}
