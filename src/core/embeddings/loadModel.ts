import {loadTensorflowModel, TensorflowModel} from 'react-native-fast-tflite';
import {test222} from '../../assets/models/test';
let model: TensorflowModel | null = null;

export async function loadEmbeddingModel() {
  try {
    console.log('LOADING TFLITE MODEL...');

    model = await loadTensorflowModel(
      require('../../assets/models/mobilefacenet.tflite'),
    );

    console.log('MODEL LOADED SUCCESSFULLY');

    return model;
  } catch (error) {
    console.log('MODEL LOAD ERROR:', error);

    return null;
  }
}

export function getEmbeddingModel() {
  return model;
}
