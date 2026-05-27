import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Camera} from 'react-native-camera-kit';
import FaceOverlay from '../components/FaceOverlay';

function CameraScreen(): JSX.Element {
  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NHAI EdgeAuth</Text>
      </View>
      <Camera
        style={styles.camera}
        cameraType={'front'}
      />
        <FaceOverlay />
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
});

export default CameraScreen;