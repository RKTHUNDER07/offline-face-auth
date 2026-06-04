import {
  isCentered,
  isFacingLeft,
  isFacingRight,
  isCloseEnough,
} from '../liveness/validators';
import {NormalizedFace} from '../detection/normalizeDetection';

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

  stageStartedAt: number;
}

export function runRegistrationMachine(
  state: RegistrationState,
  face: NormalizedFace,
): RegistrationState {
  const now = Date.now();
  // TOO FAR
  if (!isCloseEnough(face)) {
    return {
      ...state,
      message: 'Move Closer',
      circleColor: 'red',
    };
  }

  // ALIGN
  if (state.stage === 'ALIGN') {
    if (!isCentered(face)) {
      return {
        ...state,
        message: 'Align Face',
        circleColor: 'yellow',
      };
    }

    console.log('ALIGN SUCCESS');

    return {
      stage: 'CENTER',
      message: 'Look Center',
      circleColor: '#22c55e',
      stageStartedAt: Date.now(),
    };
  }

  // CENTER

  if (state.stage === 'CENTER') {
    const elapsed = now - state.stageStartedAt;

    if (elapsed >= 8000) {
      // return {

      //   stage: 'LEFT',

      //   message:
      //     'Look Left',

      //   circleColor:
      //     'yellow',

      //   stageStartedAt:
      //     now,
      // };
      return {
        stage: 'SUCCESS',

        message: 'Registration Success',

        circleColor: '#22c55e',

        stageStartedAt: now,
      };
    }

    return {
      ...state,

      message: `Hold Center ${Math.ceil((8000 - elapsed) / 1000)}`,
    };
  }

  // LEFT
  if (state.stage === 'LEFT') {
    if (!isFacingLeft(face)) {
      return {
        ...state,

        message: 'Turn Left',
      };
    }

    const elapsed = now - state.stageStartedAt;

    if (elapsed >= 5000) {
      return {
        stage: 'RIGHT',

        message: 'Look Right',

        circleColor: 'yellow',

        stageStartedAt: now,
      };
    }

    return {
      ...state,

      message: `Hold Left ${Math.ceil((5000 - elapsed) / 1000)}`,
    };
  }

  // RIGHT
  if (state.stage === 'RIGHT') {
    if (!isFacingRight(face)) {
      return {
        ...state,

        message: 'Turn Right',
      };
    }

    const elapsed = now - state.stageStartedAt;

    if (elapsed >= 5000) {
      return {
        stage: 'SUCCESS',

        message: 'Registration Success',

        circleColor: '#22c55e',

        stageStartedAt: now,
      };
    }

    return {
      ...state,

      message: `Hold Right ${Math.ceil((5000 - elapsed) / 1000)}`,
    };
  }

  return state;
}
