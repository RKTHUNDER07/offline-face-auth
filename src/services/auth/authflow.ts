import {isFaceCentered} from '../../utils/faceAlignment';

export function runAuthFlow(
  faces: any[],
  authPhase: string,
) {
  if (faces.length === 0) {
    return {
      nextPhase: 'ALIGN',
      statusMessage: 'Align your face',
    };
  }

  const face = faces[0];

  if (authPhase === 'ALIGN') {
    const centered = isFaceCentered(face);

    if (centered) {
      return {
        nextPhase: 'LIVENESS',
        statusMessage: '',
      };
    }

    return {
      nextPhase: 'ALIGN',
      statusMessage: 'Align your face',
    };
  }

  return {
    nextPhase: authPhase,
    statusMessage: '',
  };
}