import { DetectionResult } from '../detection/detectionTypes';

import { AuthState } from './authTypes';

import { getRandomChallenge } from '../liveness/challengeEngine';

import { validateLeftTurn } from '../liveness/leftTurnTest';

import { validateRightTurn } from '../liveness/rightTurnTest';

import { validateMoveCloser } from '../liveness/distanceTest';


export function runAuthMachine(
  currentState: AuthState,
  detection: DetectionResult,
): AuthState {

  switch (currentState.phase) {

    case 'ALIGN':

      if (!detection.hasFace) {
        return {
          ...currentState,
          message: 'No face detected',
        };
      }

      return {
        ...currentState,
        phase: 'SELECT_CHALLENGE',
        message: 'Face aligned',
      };



    case 'SELECT_CHALLENGE':

      const challenge = getRandomChallenge();

      let instructionMessage = '';

      switch (challenge) {

        case 'LEFT_TURN':
          instructionMessage = 'Turn your face left';
          break;

        case 'RIGHT_TURN':
          instructionMessage = 'Turn your face right';
          break;

        case 'MOVE_CLOSER':
          instructionMessage = 'Move closer to camera';
          break;
      }

      return {
        ...currentState,
        phase: 'RUN_CHALLENGE',
        currentChallenge: challenge,
        message: instructionMessage,
      };



    case 'RUN_CHALLENGE':

      let passed = false;

      switch (currentState.currentChallenge) {

        case 'LEFT_TURN':
          passed = validateLeftTurn(detection);
          break;

        case 'RIGHT_TURN':
          passed = validateRightTurn(detection);
          break;

        case 'MOVE_CLOSER':
          passed = validateMoveCloser(detection);
          break;
      }

      if (passed) {

        return {
          ...currentState,
          phase: 'SUCCESS',
          isAuthenticated: true,
          message: 'Authentication successful',
        };
      }

      return currentState;



    case 'SUCCESS':

      return currentState;



    default:
      return currentState;
  }
}