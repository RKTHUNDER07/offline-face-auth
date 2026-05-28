export function runLeftTurnTest(face: any) {
  const rotationY = face.rotationY;

  console.log('Right RotationY:', rotationY);

  if (rotationY < 20) {
    return {
      success: true,
      message: 'Authentication successful',
    };
  }

  return {
    success: false,
    message: 'Turn your head right',
  };
}