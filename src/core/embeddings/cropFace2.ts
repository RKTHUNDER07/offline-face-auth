import RNPhotoManipulator from 'react-native-photo-manipulator';

import ImageResizer from 'react-native-image-resizer';

type CropRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export async function cropFace(
  imagePath: string,
  cropRegion: CropRegion,
): Promise<string | null> {
  try {
    console.log('========================');
    console.log('STARTING FACE CROP');
    console.log('========================');

    console.log('ORIGINAL CROP REGION:', cropRegion);

    /*
      FORCE PERFECT SQUARE
    */

    const squareSize = Math.max(cropRegion.width, cropRegion.height);

    /*
      CENTER OF ORIGINAL REGION
    */

    const centerX = cropRegion.x + cropRegion.width / 2;

    const centerY = cropRegion.y + cropRegion.height / 2;

    /*
      BUILD SQUARE REGION
    */

    const squareCrop = {
      x: Math.max(0, Math.round(centerX - squareSize / 2)),

      y: Math.max(0, Math.round(centerY - squareSize / 2)),

      width: Math.round(squareSize),

      height: Math.round(squareSize),
    };
    console.log('FINAL SQUARE CROP:', squareCrop);

    /*
      STEP 1
      CROP IMAGE
    */

    const croppedImage = await RNPhotoManipulator.crop(imagePath, squareCrop);

    console.log('IMAGE CROPPED:', croppedImage);

    /*
      STEP 2
      FORCE 112x112
    */

    const resizedFace = await ImageResizer.createResizedImage(
      croppedImage,

      112,
      112,

      'JPEG',

      100,
    );

    console.log('FACE RESIZED:', resizedFace.uri);

    /*
      VALIDATION
    */

    console.log('FINAL OUTPUT SIZE:', {
      width: 112,
      height: 112,
    });

    console.log('========================');
    console.log('FACE CROP COMPLETE');
    console.log('========================');

    return resizedFace.uri;
  } catch (error) {
    console.log('CROP FACE ERROR:', error);

    return null;
  }
}
