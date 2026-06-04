import React, {useRef, useEffect, useState} from 'react';
import {markAttendance} from '../core/attendance/markAttendance';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Benchmark from '../utils/benchmark';

import {Camera, useCameraDevice} from 'react-native-vision-camera';

import FaceDetection from '@react-native-ml-kit/face-detection';

import {AuthState} from '../core/auth/authTypes';

import {runAuthMachine} from '../core/auth/authMachine';

import {normalizeDetection} from '../core/detection/normalizeDetection';

import {generateEmbedding} from '../core/embeddings/generateFixedEmbedding';

import {runEmbeddingAuth} from '../core/auth/runEmbeddingAuth';

import {isCentered} from '../core/liveness/validators';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export default function AttendanceCameraScreen({navigation}: any) {
  const device = useCameraDevice('front');

  const cameraRef = useRef<Camera>(null);

  const isDetecting = useRef(false);

  const authPhotoRef = useRef<any>(null);

  const alignmentStartRef = useRef<number | null>(null);

  const isRunningEmbeddingAuth = useRef(false);
  const alignmentCompletedRef = useRef(false);
  const {height} = Dimensions.get('window');

  const [authState, setAuthState] = useState<AuthState>({
    phase: 'ALIGN',

    currentChallenge: null,

    isAuthenticated: false,

    message: 'Align your face',
  });

  /*
    SUCCESS NAVIGATION
  */

  useEffect(() => {
    if (authState.phase === 'AUTH_SUCCESS') {
      Benchmark.end('full-auth');

      const timeout = setTimeout(() => {
        navigation.goBack();
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [authState.phase]);

  /*
    EMBEDDING AUTH FLOW
  */

  const runEmbeddingFlow = async (nextState: AuthState) => {
    try {
      if (isRunningEmbeddingAuth.current) {
        return;
      }

      isRunningEmbeddingAuth.current = true;

      console.log('STARTING EMBEDDING AUTH');

      if (!authPhotoRef.current) {
        setAuthState({
          ...nextState,

          phase: 'AUTH_FAILED',

          message: 'Auth frame missing',
        });

        return;
      }

      const authPhoto = authPhotoRef.current;

      /*
          GENERATE EMBEDDING
        */

      const embeddingResult = await generateEmbedding({
        imagePath: `file://${authPhoto.path}`,

        photoWidth: authPhoto.width,

        photoHeight: authPhoto.height,

        screenWidth,

        screenHeight,
      });

      /*
          EMBEDDING FAILED
        */

      if (!embeddingResult?.embedding) {
        authPhotoRef.current = null;

        setAuthState({
          ...nextState,

          phase: 'AUTH_FAILED',

          message: 'Embedding failed',
        });

        return;
      }

      /*
          RUN AUTH
        */

      Benchmark.start('embedding-auth');

      const authResult = await runEmbeddingAuth(embeddingResult.embedding);

      Benchmark.end('embedding-auth');
      console.log('AUTH SCORE:', authResult.score);

      /*
          SUCCESS
        */

      if (authResult.success) {
        authPhotoRef.current = null;
        /* MARK ATTENDANCE */
        Benchmark.start('attendance-save');

        await markAttendance({
          userId: 'demo-user',
          similarity: authResult.score,
        });

        Benchmark.end('attendance-save');
        setAuthState({
          ...nextState,

          phase: 'AUTH_SUCCESS',

          isAuthenticated: true,

          message: `Attendance Marked (${authResult.score.toFixed(2)})`,
        });

        return;
      }

      /*
          FAILED
        */

      authPhotoRef.current = null;

      setAuthState({
        ...nextState,

        phase: 'AUTH_FAILED',

        message: `Authentication Failed (${authResult.score.toFixed(2)})`,
      });
    } catch (error) {
      console.log('EMBEDDING FLOW ERROR:', error);
    } finally {
      isRunningEmbeddingAuth.current = false;
    }
  };

  /*
    CIRCLE COLOR
  */

  const getCircleColor = () => {
    if (authState.phase === 'ALIGN') {
      return 'red';
    }

    if (authState.phase === 'RUN_CHALLENGE') {
      return 'yellow';
    }

    if (authState.phase === 'AUTH_SUCCESS') {
      return '#22c55e';
    }

    if (authState.phase === 'AUTH_FAILED') {
      return '#ef4444';
    }

    return 'white';
  };

  /*
    DETECTION LOOP
  */

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isDetecting.current) {
        return;
      }

      try {
        isDetecting.current = true;

        /*
            STOP AFTER SUCCESS
          */

        if (authState.isAuthenticated) {
          return;
        }

        /*
            CAMERA CHECK
          */

        if (!cameraRef.current) {
          return;
        }

        /*
            CAPTURE PHOTO
          */
        Benchmark.start('camera-capture');
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'speed',

          flash: 'off',

          enableShutterSound: false,
        });
        Benchmark.end('camera-capture');
        if (!photo?.path) {
          return;
        }

        /*
            FACE DETECTION
          */ Benchmark.start('mlkit-detection');
        const faces = await FaceDetection.detect(`file://${photo.path}`);
        Benchmark.end('mlkit-detection');
        /*
            NO FACE
          */

        if (faces.length === 0) {
          alignmentStartRef.current = null;

          setAuthState(prevState => ({
            ...prevState,

            message: 'No face detected',
          }));

          return;
        }

        /*
            NORMALIZE FACE
          */

        Benchmark.start('face-normalize');

        const normalizedFace = normalizeDetection(faces[0]);

        Benchmark.end('face-normalize');
        const detectionResult = {
          hasFace: true,

          face: normalizedFace,

          timestamp: Date.now(),
        };

        /*
            ALIGNMENT HOLD LOGIC
          */

        if (authState.phase === 'ALIGN' && !alignmentCompletedRef.current) {
          const centered = isCentered(normalizedFace);

          if (!centered) {
            alignmentStartRef.current = null;

            setAuthState(prevState => ({
              ...prevState,

              message: 'Align your face',
            }));

            return;
          }

          /*
              START TIMER
            */

          if (!alignmentStartRef.current) {
            alignmentStartRef.current = Date.now();

            setAuthState(prevState => ({
              ...prevState,

              message: 'Hold still...',
            }));

            return;
          }

          const elapsed = Date.now() - alignmentStartRef.current;

          /*
  WAIT 3 SECONDS
*/

          if (elapsed < 3000) {
            return;
          }

          /*
              STORE CLEAN FRAME
            */

          console.log('STORING AUTH PHOTO');

          authPhotoRef.current = photo;
          alignmentCompletedRef.current = true;

          alignmentStartRef.current = null;
        }

        /*
            RUN MACHINE
          */

        setAuthState(prevState => {
          const nextState = runAuthMachine(prevState, detectionResult);

          console.log('PHASE:', nextState.phase);
          if (
            prevState.phase !== 'AUTHENTICATING' &&
            nextState.phase === 'AUTHENTICATING'
          ) {
            Benchmark.start('full-auth');
          }

          /*
                START EMBEDDING AUTH
              */

          if (nextState.phase === 'AUTHENTICATING') {
            runEmbeddingFlow(nextState);
          }

          return nextState;
        });
      } catch (error) {
        console.log('Detection error:', error);
      } finally {
        isDetecting.current = false;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /*
    DEVICE NOT READY
  */

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

      {/* FACE GUIDE */}

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

      {/* STATUS */}

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
