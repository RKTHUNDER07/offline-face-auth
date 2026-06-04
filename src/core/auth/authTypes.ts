import {ChallengeType} from '../liveness/challengeTypes';
export type AuthPhase =
  | 'ALIGN'
  | 'SELECT_CHALLENGE'
  | 'RUN_CHALLENGE'
  | 'AUTHENTICATING'
  | 'AUTH_SUCCESS'
  | 'AUTH_FAILED';
export interface AuthState {
  phase: AuthPhase;
  currentChallenge?: ChallengeType | null;
  isAuthenticated: boolean;
  message: string;
}
