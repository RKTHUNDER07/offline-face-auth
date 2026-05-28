export interface FaceBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectionResult {
  hasFace: boolean;

  bounds?: FaceBounds;

  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;

  faceWidth?: number;
  faceHeight?: number;

  timestamp: number;
}