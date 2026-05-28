import { DetectionResult } from '../detection/detectionTypes';

export function validateMoveCloser(
  detection: DetectionResult,
): boolean {

  if (!detection.faceWidth) {
    return false;
  }

  return detection.faceWidth > 300;
}