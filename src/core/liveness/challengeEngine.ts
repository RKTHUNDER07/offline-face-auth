import { ChallengeType } from './challengeTypes';

const challenges: ChallengeType[] = [
  'LEFT_TURN',
  'RIGHT_TURN',
  'MOVE_CLOSER',
];

export function getRandomChallenge(): ChallengeType {

  const randomIndex = Math.floor(
    Math.random() * challenges.length
  );

  return challenges[randomIndex];
}