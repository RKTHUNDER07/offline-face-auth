import FaceDetection from '@react-native-ml-kit/face-detection';

export async function detectFaces(imagePath: string) {
  try {
    const faces = await FaceDetection.detect(imagePath);

    return faces;
  } catch (error) {
    console.log('Face detection error:', error);
    return [];
  }
}