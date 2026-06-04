import {getEmbeddingModel} from './loadModel';

import {preprocessFace} from './preprocessFace';

import {cropFace} from './cropFace2';

import {FACE_CROP_CONFIG} from './faceCropConfig';

const {
  OVERLAY_SIZE,

  OVERLAY_TOP,

  FACE_CROP_RATIO,

  FACE_Y_OFFSET,
} = FACE_CROP_CONFIG;

type GenerateEmbeddingParams = {
  imagePath: string;

  photoWidth: number;
  photoHeight: number;

  screenWidth: number;
  screenHeight: number;
};

export async function generateEmbedding({
  imagePath,

  photoWidth,
  photoHeight,

  screenWidth,
  screenHeight,
}: GenerateEmbeddingParams) {
  try {
    console.log('========================');
    console.log('STARTING EMBEDDING');
    console.log('========================');

    /*
      MODEL
    */

    const model = getEmbeddingModel();

    if (!model) {
      console.log('MODEL NOT LOADED');

      return null;
    }

    /*
      SCALE FACTORS
    */

    const scaleX = photoWidth / screenWidth;

    const scaleY = photoHeight / screenHeight;

    console.log('SCALE:', {
      scaleX,
      scaleY,
    });

    /*
      CIRCLE POSITION
    */

    const overlayX = (screenWidth - OVERLAY_SIZE) / 2;

    const overlayY = OVERLAY_TOP;

    /*
      FACE CROP SIZE
    */

    const cropSize = OVERLAY_SIZE * FACE_CROP_RATIO;

    /*
      CENTER INSIDE CIRCLE
    */

    const cropX = overlayX + (OVERLAY_SIZE - cropSize) / 2;

    /*
      SHIFT UPWARD
    */

    const cropY = overlayY + (OVERLAY_SIZE - cropSize) / 2 + FACE_Y_OFFSET;

    /*
      FINAL IMAGE-SPACE CROP
    */

    const cropRegion = {
      x: cropX * scaleX,

      y: cropY * scaleY,

      width: cropSize * scaleX,

      height: cropSize * scaleY,
    };

    console.log('FINAL CROP REGION:', cropRegion);

    /*
      STEP 1
      Crop face
    */

    const croppedFacePath = await cropFace(imagePath, cropRegion);

    if (!croppedFacePath) {
      console.log('FACE CROP FAILED');

      return null;
    }

    /*
      STEP 2
      Preprocess
    */

    const inputTensor = await preprocessFace(croppedFacePath);

    if (!inputTensor) {
      console.log('PREPROCESS FAILED');

      return null;
    }

    /*
      STEP 3
      Run model
    */

    console.log('RUNNING MODEL...');

    const output = await model.run([inputTensor]);

    console.log('EMBEDDING GENERATED');

    console.log('========================');
    console.log('EMBEDDING COMPLETE');
    console.log('========================');

    return {
      embedding: output?.[0],
      previewImage: croppedFacePath,
    };
  } catch (error) {
    console.log('EMBEDDING ERROR:', error);

    return null;
  }
}
