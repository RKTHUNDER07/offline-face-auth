
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { runRegistrationMachine, } from '../core/registration/registrationMachine';
 import { normalizeDetection, } from '../core/detection/normalizeDetection';
import {
  Camera,
  useCameraDevice,
} from 'react-native-vision-camera';

import FaceDetection
from '@react-native-ml-kit/face-detection';


export default function RegistrationCameraScreen() {

  const cameraRef =
    useRef<Camera>(null);

  const device =
    useCameraDevice('front');

  const [hasPermission,
    setHasPermission] =
      useState(false);

    const [registrationState, setRegistrationState] = useState({ stage: 'ALIGN', message: 'Align Face', circleColor: 'red', });


  useEffect(() => {

    const requestPermission =
      async () => {

        const permission =
          await Camera.requestCameraPermission();

        setHasPermission(
          permission === 'granted',
        );
      };

    requestPermission();

  }, []);


  useEffect(() => {

    let interval:
      NodeJS.Timeout;

    interval = setInterval(
      async () => {

        try {

          const photo =
            await cameraRef.current?.takePhoto({
              qualityPrioritization:
                'speed',

              flash: 'off',

              enableShutterSound:
                false,
            });

          if (!photo?.path) {
            return;
          }

          const faces =
            await FaceDetection.detect(
              `file://${photo.path}`,
            );


          // NO FACE
          if (
            faces.length === 0
          ) {

           
setRegistrationState(
  prev => ({
    ...prev,
    message:
      'No Face Detected',
    circleColor: 'red',
  }),
);
    return;

          }


          // FACE FOUND
          

            const normalizedFace =
            normalizeDetection(
                faces[0],
            );

            setRegistrationState(
            prevState =>
                runRegistrationMachine(
                prevState,
                normalizedFace,
                ),
            );




        } catch (error) {

          console.log(
            'Detection Error:',
            error,
          );
        }

      },
      1500,
    );

    return () => {

      clearInterval(interval);
    };

  }, []);


  if (!hasPermission) {

    return (

      <View
        style={
          styles.center
        }
      >
        <Text
          style={
            styles.text
          }
        >
          Camera Permission Required
        </Text>
      </View>
    );
  }


  if (!device) {
    return <View />;
  }


  return (

    <View
      style={
        styles.container
      }
    >

      <Camera
        ref={cameraRef}
        style={
          StyleSheet.absoluteFill
        }
        device={device}
        isActive={true}
        photo={true}
      />
      
<View
  style={{
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 5,
    borderColor: registrationState.circleColor,
    alignSelf: 'center',
    top: 220,
  }}
/>



      <Text
        style={
          styles.message
        }
      >
        {registrationState.message}
      </Text>

    </View>
  );
}


const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        'black',
    },

    center: {
      flex: 1,
      justifyContent:
        'center',
      alignItems:
        'center',
      backgroundColor:
        'black',
    },

    text: {
      color: 'white',
      fontSize: 22,
    },

    message: {
      position: 'absolute',
      top: 100,
      alignSelf: 'center',
      color: 'white',
      fontSize: 26,
      fontWeight: 'bold',
    },
  });
