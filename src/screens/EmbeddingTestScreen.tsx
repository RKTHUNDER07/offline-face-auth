import React, {useRef} from 'react';
import {compareEmbeddings} from '../core/embeddings/compareEmbeddings';
import {getRegistration} from '../core/storage/getRegistration';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import {normalizeEmbedding} from '../core/embeddings/normalizeEmbedding';
import {Camera, useCameraDevice} from 'react-native-vision-camera';

import {generateEmbedding} from '../core/embeddings/generateFixedEmbedding';
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
import {FACE_CROP_CONFIG} from '../core/embeddings/faceCropConfig';

const {
  OVERLAY_SIZE,

  OVERLAY_TOP,

  FACE_CROP_RATIO,

  FACE_Y_OFFSET,
} = FACE_CROP_CONFIG;

export default function EmbeddingTestScreen() {
  const cameraRef = useRef<Camera>(null);

  const device = useCameraDevice('front');

  const [croppedFaceUri, setCroppedFaceUri] = React.useState<string | null>(
    null,
  );

  const handleTest = async () => {
    try {
      if (!cameraRef.current) {
        return;
      }

      console.log('========================');
      console.log('STARTING AUTH TEST');
      console.log('========================');

      /*
      CAPTURE PHOTO
    */

      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: 'speed',

        flash: 'off',

        enableShutterSound: false,
      });

      /*
      GENERATE LIVE EMBEDDING
    */

      const result = await generateEmbedding({
        imagePath: `file://${photo.path}`,

        photoWidth: photo.width,

        photoHeight: photo.height,

        screenWidth,

        screenHeight,
      });

      /*
      INVALID EMBEDDING
    */

      if (!result?.embedding) {
        console.log('LIVE EMBEDDING FAILED');

        return;
      }

      /*
      SHOW CROPPED FACE
    */

      setCroppedFaceUri(result.previewImage);

      /*
      FETCH REGISTERED USER

      CHANGE UID
      TO YOUR TEST USER
    */

      const registration = await getRegistration('demo-user');

      if (!registration) {
        console.log('NO REGISTRATION FOUND');

        return;
      }

      console.log('REGISTERED EMBEDDINGS:', registration.embeddings.length);

      /*
      COMPARE AGAINST
      ALL STORED EMBEDDINGS
    */

      let bestScore = 0;

      for (const storedEmbedding of registration.embeddings) {
        const liveEmbedding = normalizeEmbedding(result.embedding);
        const similarity = compareEmbeddings(liveEmbedding, storedEmbedding);

        console.log('SIMILARITY:', similarity);

        if (similarity > bestScore) {
          bestScore = similarity;
        }
      }

      /*
      FINAL RESULT
    */

      console.log('========================');
      console.log('BEST SCORE:', bestScore);
      console.log('========================');

      /*
      THRESHOLD
    */

      if (bestScore > 0.75) {
        console.log('AUTH SUCCESS');
      } else {
        console.log('AUTH FAILED');
      }
    } catch (error) {
      console.log('AUTH TEST ERROR:', error);
    }
  };

  if (!device) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />

      {/* CROPPED FACE PREVIEW */}

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

      {/* GUIDE CIRCLE */}

      <View
        style={{
          position: 'absolute',
          width: OVERLAY_SIZE,
          height: OVERLAY_SIZE,
          borderRadius: OVERLAY_SIZE / 2,
          borderWidth: 5,
          borderColor: '#22c55e',
          alignSelf: 'center',
          top: OVERLAY_TOP,
        }}
      />
      {/* DEBUG CROP SQUARE */}

      {/* DEBUG FACE CROP */}

      <View
        style={{
          position: 'absolute',

          width: OVERLAY_SIZE * FACE_CROP_RATIO,

          height: OVERLAY_SIZE * FACE_CROP_RATIO,

          left: (screenWidth - OVERLAY_SIZE * FACE_CROP_RATIO) / 2,

          top:
            OVERLAY_TOP +
            (OVERLAY_SIZE - OVERLAY_SIZE * FACE_CROP_RATIO) / 2 +
            FACE_Y_OFFSET,

          borderWidth: 3,

          borderColor: 'red',
        }}
      />
      <TouchableOpacity style={styles.button} onPress={handleTest}>
        <Text style={styles.text}>Test Embedding</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  camera: {
    flex: 1,
  },

  button: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 12,
  },

  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
