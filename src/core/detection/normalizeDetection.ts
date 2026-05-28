export interface NormalizedFace {

  yaw: number;

  pitch: number;

  roll: number;

  faceWidth: number;

  faceHeight: number;

  centerX: number;

  centerY: number;
}

export function normalizeDetection(
  face: any,
): NormalizedFace {

  const frame = face.frame;

  return {

    yaw: face.rotationY ?? 0,

    pitch: face.rotationX ?? 0,

    roll: face.rotationZ ?? 0,

    faceWidth: frame.width,

    faceHeight: frame.height,

    centerX:
      frame.left + frame.width / 2,

    centerY:
      frame.top + frame.height / 2,
  };
}