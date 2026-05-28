export function runDistanceTest(face: any) {
  const faceWidth = face.frame.width;

  console.log('Face Width:', faceWidth);

  if (faceWidth > 500) {
    return {
      success: true,
      message: 'Authentication successful',
    };
  }

  return {
    success: false,
    message: 'Move closer to camera',
  };
}