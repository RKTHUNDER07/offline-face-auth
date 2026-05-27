export function isFaceCentered(face: any) {
  const frame = face.frame;

  const faceCenterX = frame.left + frame.width / 2;
  const faceCenterY = frame.top + frame.height / 2;

  const screenCenterX = 540;
  const screenCenterY = 1037;

  const threshold = 180;

  const isCenteredX =
    Math.abs(faceCenterX - screenCenterX) < threshold;

  const isCenteredY =
    Math.abs(faceCenterY - screenCenterY) < threshold;

  return isCenteredX && isCenteredY;
}