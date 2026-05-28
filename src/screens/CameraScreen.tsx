import React, {
  useRef,
    useEffect,
} from 'react';

import {
  View,
  StyleSheet,

} from 'react-native';

import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import FaceDetection from '@react-native-ml-kit/face-detection';
import ViewShot from 'react-native-view-shot';

import {
  isFacingLeft,
  isFacingRight,
  isCentered,
  isCloseEnough,
} from '../core/liveness/validators';

import {
  normalizeDetection,
} from '../core/detection/normalizeDetection';

export default function CameraScreen() {

  const device = useCameraDevice('front');
  const cameraRef = useRef<Camera>(null);
  const viewShotRef = useRef<ViewShot>(null);


  if (!device) {
    return <View />;
  }



useEffect(() => {

  let interval: NodeJS.Timeout;

  const startDetectionLoop = () => {

    interval = setInterval(async () => {

      try {

        const photo =
          await cameraRef.current?.takePhoto({
            qualityPrioritization: 'speed',
            flash: 'off',
            enableShutterSound: false,
          });

        if (!photo?.path) {
          return;
        }

        const faces =
          await FaceDetection.detect(
            `file://${photo.path}`
          );
          //-------------------------------------------------------------------------------------------

          if (faces.length === 0) {
            return;
          }

          const normalizedFace =
            normalizeDetection(faces[0]);

          // console.log(
          //   'Normalized:',
          //   normalizedFace
          // );

//           const left =
//   isFacingLeft(normalizedFace);

// const right =
//   isFacingRight(normalizedFace);

// const center =
//   isCentered(normalizedFace);

// console.log(
//   JSON.stringify(
//     {
//       yaw: normalizedFace.yaw,
//       left,
//       right,
//       center,
//     },
//     null,
//     2,
//   ),
// );
          //----------------------------------------------------------------------------------------------------
        console.log(
          'Detected:',
          faces.length
        );
    
//         console.log(
//   JSON.stringify(faces[0], null, 2)
// );

      } catch (error) {

        console.log(
          'Detection error:',
          error
        );
      }

    }, 1000);

  };

  startDetectionLoop();

  return () => {

    if (interval) {
      clearInterval(interval);
    }
  };

}, []);

 
  
  
 

  return (
    <View style={styles.container}>

  <ViewShot
    ref={viewShotRef}
    style={{ flex: 1 }}
    options={{
      format: 'jpg',
      quality: 0.4,
      result: 'tmpfile',
    }}
  >
   
    <Camera
      ref={cameraRef}
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      photo={true}
    />

  </ViewShot>

</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});