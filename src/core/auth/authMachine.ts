
import { DetectionResult } from '../detection/detectionTypes';

import { AuthState } from './authTypes';

import { getRandomChallenge } from '../liveness/challengeEngine';

import {
  isFacingLeft,
  isFacingRight,
  isCentered,
} from '../liveness/validators';


export function runAuthMachine(
  currentState: AuthState,
  detection: DetectionResult,
): AuthState {

  switch (currentState.phase) {

    case 'ALIGN':

      if (!detection.face) {

        return {
          ...currentState,
          message: 'No face detected',
        };
      }

      if (
        isCentered(detection.face)
      ) {

        return {
          ...currentState,
          phase: 'SELECT_CHALLENGE',
          message: 'Face aligned',
        };
      }

      return {
        ...currentState,
        message: 'Align your face',
      };



    case 'SELECT_CHALLENGE':

      // Prevent challenge reselection
      if (
        currentState.currentChallenge
      ) {

        return {
          ...currentState,
          phase: 'RUN_CHALLENGE',
        };
      }

      const challenge =
        getRandomChallenge();

      let instructionMessage = '';

      switch (challenge) {

        case 'LEFT_TURN':

          instructionMessage =
            'Turn your face left';

          break;


        case 'RIGHT_TURN':

          instructionMessage =
            'Turn your face right';

          break;
      }

      return {
        ...currentState,
        phase: 'RUN_CHALLENGE',
        currentChallenge: challenge,
        message: instructionMessage,
      };



    case 'RUN_CHALLENGE':

      if (!detection.face) {

        return {
          ...currentState,
          message: 'Face lost',
        };
      }

      let passed = false;

      switch (
        currentState.currentChallenge
      ) {

        case 'LEFT_TURN':

          passed = isFacingLeft(
            detection.face,
          );

          break;


        case 'RIGHT_TURN':

          passed = isFacingRight(
            detection.face,
          );

          break;
      }

      if (passed) {

        return {
          ...currentState,
          phase: 'SUCCESS',
          isAuthenticated: true,
          currentChallenge: null,
          message:
            'Authentication successful',
        };
      }

      return currentState;



    case 'SUCCESS':

      return currentState;



    default:

      return currentState;
  }
}

