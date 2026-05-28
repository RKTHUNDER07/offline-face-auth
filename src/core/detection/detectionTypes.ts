export interface FaceBounds {

  x: number;

  y: number;

  width: number;

  height: number;
}


export interface NormalizedFace {

  yaw: number;

  pitch: number;

  roll: number;

  faceWidth: number;

  faceHeight: number;

  centerX: number;

  centerY: number;
}


export interface DetectionResult {

  hasFace: boolean;

  face?: NormalizedFace;

  bounds?: FaceBounds;

  timestamp: number;
}