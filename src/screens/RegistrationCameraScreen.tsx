import React, {useEffect, useRef, useState} from 'react';

import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';
import {FACE_CROP_CONFIG} from '../core/embeddings/faceCropConfig';
import {runRegistrationMachine} from '../core/registration/registrationMachine';
import {registerTempFile, clearTempFiles} from '../utility/tempFileManager';
import {normalizeDetection} from '../core/detection/normalizeDetection';

import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {normalizeEmbedding} from '../core/embeddings/normalizeEmbedding';
import {generateEmbedding} from '../core/embeddings/generateFixedEmbedding';
import FaceDetection from '@react-native-ml-kit/face-detection';

import {createEmptyEmbeddings} from '../core/registration/registrationEmbeddings';

import {isCentered, isCloseEnough} from '../core/liveness/validators';

import {saveRegistration} from '../core/storage/saveRegistration';
export default function RegistrationCameraScreen({navigation}: any) {
  const cameraRef = useRef<Camera>(null);

  const device = useCameraDevice('front');
  const [croppedFaceUri, setCroppedFaceUri] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const embeddingInProgressRef = useRef(false);
  const [registrationState, setRegistrationState] = useState({
    stage: 'ALIGN',
    message: 'Align Face',
    circleColor: 'red',
    stageStartedAt: Date.now(),
  });
  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
  const [embeddings, setEmbeddings] = useState<any[]>([]);
  const registrationCompletedRef = useRef(false);
  const previousStageRef = useRef(registrationState.stage);
  const lastEmbeddingCaptureRef = useRef(0);
  const [registrationEmbeddings, setRegistrationEmbeddings] = useState(
    createEmptyEmbeddings(),
  );
  const {
    OVERLAY_SIZE,

    OVERLAY_TOP,
  } = FACE_CROP_CONFIG;
  //-------------------------------------------------------------------

  // useEffect(() => {
  //   if (registrationState.stage === 'SUCCESS') {
  //     registrationCompletedRef.current = true;

  //     console.log('REGISTRATION SUCCESS');

  //     console.log('FINAL EMBEDDINGS:', registrationEmbeddings);
  //   }
  // }, [registrationState.stage]);

  //-------------------------------------------------------------------

  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Camera.requestCameraPermission();

      setHasPermission(permission === 'granted');
    };

    requestPermission();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    interval = setInterval(async () => {
      try {
        /*
        REGISTRATION FINISHED
      */

        if (registrationCompletedRef.current) {
          clearInterval(interval);

          return;
        }

        /*
        ALREADY SUCCESS
      */

        if (registrationState.stage === 'SUCCESS') {
          return;
        }

        /*
        CAMERA NOT READY
      */

        if (!cameraRef.current) {
          return;
        }

        /*
        CAPTURE PHOTO
      */

        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'speed',

          flash: 'off',

          enableShutterSound: false,
        });

        if (!photo?.path) {
          return;
        }
        registerTempFile(photo.path);
        /*
        FACE DETECTION
      */

        const faces = await FaceDetection.detect(`file://${photo.path}`);

        /*
        NO FACE
      */

        if (faces.length === 0) {
          setRegistrationState(prev => ({
            ...prev,

            message: 'No Face Detected',

            circleColor: 'red',
          }));

          return;
        }

        /*
        NORMALIZE DETECTION
      */

        const normalizedFace = normalizeDetection(faces[0]);

        /*
        EMBEDDING CAPTURE RULES
      */

        const now = Date.now();

        const canCaptureEmbedding = now - lastEmbeddingCaptureRef.current > 500;

        const validForEmbedding = isCloseEnough(normalizedFace);

        /*
        GENERATE EMBEDDING
      */

        if (
          canCaptureEmbedding &&
          validForEmbedding &&
          !embeddingInProgressRef.current
        ) {
          /*
          LOCK INFERENCE
        */

          embeddingInProgressRef.current = true;

          lastEmbeddingCaptureRef.current = now;

          generateEmbedding({
            imagePath: `file://${photo.path}`,

            photoWidth: photo.width,

            photoHeight: photo.height,

            screenWidth,

            screenHeight,
          })
            .then(result => {
              /*
              INVALID RESULT
            */

              if (!result?.embedding) {
                return;
              }
              setCroppedFaceUri(result.previewImage); /*
              REGISTRATION COMPLETE
            */

              if (registrationCompletedRef.current) {
                return;
              }

              /*
              STORE EMBEDDING
            */

              setRegistrationEmbeddings(prev => {
                /*
                  HARD LIMIT
                */

                if (prev.embeddings.length >= 15) {
                  return prev;
                }

                const normalized = normalizeEmbedding(result.embedding);

                const updated = {
                  embeddings: [...prev.embeddings, normalized],
                };

                console.log('TOTAL EMBEDDINGS:', updated.embeddings.length);

                return updated;
              });
            })
            .catch(error => {
              console.log('EMBEDDING GENERATION ERROR:', error);
            })
            .finally(() => {
              /*
              RELEASE LOCK
            */

              embeddingInProgressRef.current = false;
            });
        }

        /*
        UPDATE REGISTRATION STATE
      */

        setRegistrationState(prevState =>
          runRegistrationMachine(prevState, normalizedFace),
        );
      } catch (error) {
        console.log('DETECTION ERROR:', error);
      }
    }, 1400);

    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    const handleSuccess = async () => {
      if (registrationState.stage === 'SUCCESS') {
        registrationCompletedRef.current = true;
        console.log('REGISTRATION SUCCESS');
        // console.log('FINAL EMBEDDINGS:', registrationEmbeddings);
        await saveRegistration({
          uid: 'demo-user',
          embeddings: registrationEmbeddings.embeddings,
          registeredAt: Date.now(),
        });
        await clearTempFiles();
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      }
    };

    handleSuccess();
  }, [registrationState.stage]);

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Camera Permission Required</Text>
      </View>
    );
  }

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
          width: OVERLAY_SIZE,

          height: OVERLAY_SIZE,

          borderRadius: OVERLAY_SIZE / 2,

          top: OVERLAY_TOP,
          borderWidth: 5,
          borderColor: registrationState.circleColor,
          alignSelf: 'center',
        }}
      />
      {croppedFaceUri && (
        <Image
          source={{uri: croppedFaceUri}}
          style={{
            position: 'absolute',

            top: 80,

            right: 20,

            width: 140,

            height: 140,

            borderWidth: 3,

            borderColor: 'white',

            borderRadius: 12,

            backgroundColor: 'black',
          }}
        />
      )}

      <Text style={styles.message}>{registrationState.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
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
