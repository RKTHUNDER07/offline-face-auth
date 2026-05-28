import { DetectionResult } from '../detection/detectionTypes';

export function validateRightTurn(
  detection: DetectionResult,
): boolean {

  if (detection.rotationY == null) {
    return false;
  }

  return detection.rotationY < -15;
}