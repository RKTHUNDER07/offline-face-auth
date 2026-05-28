import { Frame } from 'react-native-vision-camera';

export function processFrame(
  frame: Frame,
) {

  'worklet';

  console.log(
    `Frame: ${frame.width} x ${frame.height}`
  );
}