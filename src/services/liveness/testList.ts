import {runLeftTurnTest} from './leftTurnTest';
import {runRightTurnTest} from './rightTurnTest';
import {runDistanceTest} from './distanceTest';

type Test = {
  run: (face: any) => {
    success: boolean;
    message: string;
  };

  msg: string;
};

export const testList: Test[] = [
  {
    run: runLeftTurnTest,
    msg: 'Turn your face left',
  },

  {
    run: runRightTurnTest,
    msg: 'Turn your face right',
  },

  {
    run: runDistanceTest,
    msg: 'Move closer to camera',
  },
];

export const getRandomTest =(): Test => {
  const randomIndex = Math.floor(
    Math.random() * testList.length,
  );

  return testList[randomIndex];
};