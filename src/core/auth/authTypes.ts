import { ChallengeType } from '../liveness/challengeTypes';

export type AuthPhase =
  | 'ALIGN'
  | 'SELECT_CHALLENGE'
  | 'RUN_CHALLENGE'
  | 'SUCCESS'
  | 'FAILED';

export interface AuthState {

  phase: AuthPhase;

  currentChallenge?: ChallengeType;

  isAuthenticated: boolean;

  message: string;
}