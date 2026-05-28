import { DetectionResult } from './detectionTypes';

export function normalizeDetection(face: any): DetectionResult {
  if (!face) {
    return {
      hasFace: false,
      timestamp: Date.now(),
    };
  }

  return {
    hasFace: true,

    bounds: {
      x: face.frame.left,
      y: face.frame.top,
      width: face.frame.width,
      height: face.frame.height,
    },

    rotationX: face.rotationX,
    rotationY: face.rotationY,
    rotationZ: face.rotationZ,

    faceWidth: face.frame.width,
    faceHeight: face.frame.height,

    timestamp: Date.now(),
  };
}