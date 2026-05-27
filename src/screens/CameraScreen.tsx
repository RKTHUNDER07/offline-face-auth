import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {Camera} from 'react-native-camera-kit';
import FaceOverlay from '../components/FaceOverlay';
import StatusBanner from '../components/StatusBanner';
import {detectFaces} from '../services/faceDetection';

function CameraScreen(): JSX.Element {
    const [status, setStatus] = useState('Align your face');
    const cameraRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
        setStatus('Face detected');
            }, 3000);

        setTimeout(() => {
            setStatus('Authentication successful');
        }, 6000);
    }, []);

    const handleFaceDetection = async () => {
        try {
            if (!cameraRef.current) {
                return;
            }

            const image = await cameraRef.current.capture();

            console.log('Captured image:', image);

            const faces = await detectFaces(image.uri);

            console.log('Detected faces:', faces);

            if (faces.length > 0) {
                setStatus('Face detected');
            } else {
                setStatus('Align your face');
            }
        } catch (error) {
            console.log(error);
        }
    };


const getBorderColor = () => {
  switch (status) {
    case 'Align your face':
      return '#FFD700';

    case 'Face detected':
      return '#00BFFF';

    case 'Authentication successful':
      return '#00FF88';

    default:
      return '#FFD700';
  }
};


  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NHAI EdgeAuth</Text>
      </View>
      <Camera
            ref={cameraRef}
            style={styles.camera}
            cameraType={'front'}
        />
      <StatusBanner message={status} />
      <TouchableOpacity
             style={styles.button}
            onPress={handleFaceDetection}>
            <Text style={styles.buttonText}>Detect Face</Text>
        </TouchableOpacity>
        <FaceOverlay borderColor={getBorderColor()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    backgroundColor: '#111',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  button: {
  position: 'absolute',
  bottom: 140,
  alignSelf: 'center',
  backgroundColor: '#00BFFF',
  paddingHorizontal: 24,
  paddingVertical: 14,
  borderRadius: 14,
},

buttonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
});

export default CameraScreen;