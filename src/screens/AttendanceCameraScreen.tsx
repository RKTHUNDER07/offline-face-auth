import React, {useRef, useEffect, useState} from 'react';

import {View, Text, StyleSheet, Dimensions} from 'react-native';

import {Camera, useCameraDevice} from 'react-native-vision-camera';

import FaceDetection from '@react-native-ml-kit/face-detection';

import {runAuthMachine} from '../core/auth/authMachine';

import {normalizeDetection} from '../core/detection/normalizeDetection';
import {generateEmbedding} from '../core/embeddings/generateFixedEmbedding';

import {runEmbeddingAuth} from '../core/auth/runEmbeddingAuth';
export default function AttendanceCameraScreen({navigation}: any) {
  const device = useCameraDevice('front');

  const cameraRef = useRef<Camera>(null);

  const {height} = Dimensions.get('window');

  const [authState, setAuthState] = useState({
    phase: 'ALIGN',
    currentChallenge: null,
    isAuthenticated: false,
    message: 'Align your face',
  });

  const getCircleColor = () => {
    if (authState.phase === 'ALIGN') {
      return 'red';
    }

    if (authState.phase === 'RUN_CHALLENGE') {
      return 'yellow';
    }

    if (authState.phase === 'SUCCESS') {
      return '#22c55e';
    }

    return 'white';
  };
  useEffect(() => {
    if (authState.phase === 'SUCCESS') {
      navigation.goBack();
    }
  }, [authState.phase]);
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const startDetectionLoop = () => {
      interval = setInterval(async () => {
        try {
          if (authState.isAuthenticated) {
            return;
          }

          const photo = await cameraRef.current?.takePhoto({
            qualityPrioritization: 'speed',
            flash: 'off',
            enableShutterSound: false,
          });

          if (!photo?.path) {
            return;
          }

          const faces = await FaceDetection.detect(`file://${photo.path}`);

          if (faces.length === 0) {
            setAuthState(prevState => ({
              ...prevState,
              message: 'No face detected',
            }));

            return;
          }

          const normalizedFace = normalizeDetection(faces[0]);

          const detectionResult = {
            hasFace: true,

            face: normalizedFace,

            timestamp: Date.now(),
          };

          setAuthState(prevState => {
            const nextState = runAuthMachine(prevState, detectionResult);

            console.log('PHASE:', nextState.phase);

            return nextState;
          });
        } catch (error) {
          console.log('Detection error:', error);
        }
      }, 1000);
    };

    startDetectionLoop();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [authState.isAuthenticated]);

  if (!device) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
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
          borderColor: getCircleColor(),
          alignSelf: 'center',
          top: height / 2 - 180,
        }}
      />

      <Text
        style={{
          position: 'absolute',
          top: 100,
          alignSelf: 'center',
          fontSize: 26,
          color: 'white',
          fontWeight: 'bold',
        }}>
        {authState.message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
