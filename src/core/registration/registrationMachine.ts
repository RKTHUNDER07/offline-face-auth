

import { isCentered, isFacingLeft, isFacingRight, isCloseEnough, } from '../liveness/validators';
import {
  NormalizedFace,
} from '../detection/normalizeDetection';


export type RegistrationStage =
  | 'ALIGN'
  | 'CENTER'
  | 'LEFT'
  | 'RIGHT'
  | 'SUCCESS';


export interface RegistrationState {

  stage: RegistrationStage;

  message: string;

  circleColor: string;
}


export function runRegistrationMachine(
  state: RegistrationState,
  face: NormalizedFace,
): RegistrationState {

  // TOO FAR
  if (
    !isCloseEnough(face)
  ) {

    return {
      ...state,
      message: 'Move Closer',
      circleColor: 'red',
    };
  }


  // ALIGN
  if (
    state.stage === 'ALIGN'
  ) {

    if (
      !isCentered(face)
    ) {

      return {
        ...state,
        message: 'Align Face',
        circleColor: 'yellow',
      };
    }

    console.log(
      'ALIGN SUCCESS',
    );

    return {
      stage: 'CENTER',
      message: 'Look Center',
      circleColor: '#22c55e',
    };
  }


  // CENTER
  if (
    state.stage === 'CENTER'
  ) {

    if (
      isCentered(face)
    ) {

      console.log(
        'CENTER STORED',
      );

      return {
        stage: 'LEFT',
        message: 'Look Left',
        circleColor: '#22c55e',
      };
    }

    return {
      ...state,
      message: 'Look Center',
    };
  }


  // LEFT
  if (
    state.stage === 'LEFT'
  ) {

    if (
      isFacingLeft(face)
    ) {

      console.log(
        'LEFT STORED',
      );

      return {
        stage: 'RIGHT',
        message: 'Look Right',
        circleColor: '#22c55e',
      };
    }

    return {
      ...state,
      message: 'Turn Left',
    };
  }


  // RIGHT
  if (
    state.stage === 'RIGHT'
  ) {

    if (
      isFacingRight(face)
    ) {

      console.log(
        'RIGHT STORED',
      );

      return {
        stage: 'SUCCESS',
        message:
          'Registration Success',
        circleColor: '#22c55e',
      };
    }

    return {
      ...state,
      message: 'Turn Right',
    };
  }


  return state;
}

