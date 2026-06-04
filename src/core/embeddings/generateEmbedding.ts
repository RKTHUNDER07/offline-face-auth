import {getEmbeddingModel} from './loadModel';

import {preprocessFace} from './preprocessFace';
import Benchmark from '../../utils/benchmark';
import {cropFace} from './cropFace';

export async function generateEmbedding(imagePath: string, face: any) {
  try {
    const model = getEmbeddingModel();

    if (!model) {
      console.log('MODEL NOT LOADED');

      return null;
    }

    /*
      STEP 1
      Crop face
    */

    const croppedFacePath = await cropFace(imagePath, face);

    if (!croppedFacePath) {
      console.log('FACE CROP FAILED');

      return null;
    }

    /*
      STEP 2
      Preprocess cropped face
    */

    const inputTensor = await preprocessFace(croppedFacePath);

    if (!inputTensor) {
      console.log('PREPROCESS FAILED');

      return null;
    }

    /*
      STEP 3
      Run inference
    */

    console.log('RUNNING MODEL...');
    Benchmark.start('embedding-inference');
    const output = await model.run([inputTensor]);
    const result = Benchmark.end('embedding-inference');

    console.log(result);
    console.log('EMBEDDING GENERATED');

    return output?.[0];
  } catch (error) {
    console.log('EMBEDDING ERROR:', error);

    return null;
  }
}
