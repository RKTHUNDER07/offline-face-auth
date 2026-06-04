import {NormalizedFace} from '../detection/normalizeDetection';
import {FACE_CROP_CONFIG} from '../embeddings/faceCropConfig';

import {Dimensions} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const {OVERLAY_SIZE, OVERLAY_TOP} = FACE_CROP_CONFIG;

/*
  OVERLAY POSITION
*/

const OVERLAY_LEFT = (SCREEN_WIDTH - OVERLAY_SIZE) / 2;

export function isCentered(face: NormalizedFace): boolean {
  console.log({
    centerX: face.centerX,
    centerY: face.centerY,
    faceWidth: face.faceWidth,
  });

  /*
    YAW
  */

  const centeredYaw = face.yaw > -8 && face.yaw < 8;

  /*
    HORIZONTAL POSITION
  */

  const centeredX = face.centerX > 650 && face.centerX < 950;

  /*
    VERTICAL POSITION
  */

  const centeredY = face.centerY > 850 && face.centerY < 1200;

  /*
    FACE SIZE
  */

  const closeEnough = face.faceWidth > 450;

  return centeredYaw && centeredX && centeredY && closeEnough;
}

export function isFacingRight(face: NormalizedFace): boolean {
  console.log('inside RIGHT CHECK ');
  return face.yaw > 20;
}

export function isFacingLeft(face: NormalizedFace): boolean {
  console.log('inside left CHECK ');

  return face.yaw < -20;
}

// export function isCentered(face: NormalizedFace): boolean {
//   return face.yaw > -8 && face.yaw < 8;
// }
export function isCloseEnough(face: NormalizedFace): boolean {
  return face.faceWidth > 250;
}
