import { DetectionResult } from '../detection/detectionTypes';

export function validateLeftTurn(
  detection: DetectionResult,
): boolean {

  if (!detection.rotationY) {
    return false;
  }

  return detection.rotationY > 15;
}