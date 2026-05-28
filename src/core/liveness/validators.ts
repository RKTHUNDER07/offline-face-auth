import {
  NormalizedFace,
} from '../detection/normalizeDetection';


export function isFacingRight(
  face: NormalizedFace,
): boolean {

  return face.yaw > 20;
}


export function isFacingLeft(
  face: NormalizedFace,
): boolean {

  return face.yaw < -20;
}


export function isCentered(
  face: NormalizedFace,
): boolean {

  return (
    face.yaw > -8 &&
    face.yaw < 8
  );
}
export function isCloseEnough(
  face: NormalizedFace,
): boolean {

  return (
    face.faceWidth > 420
  );
}