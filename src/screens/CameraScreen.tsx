import React from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';

import {
  Camera,
  useCameraDevice,
} from 'react-native-vision-camera';

export default function CameraScreen() {

  const device = useCameraDevice('front');

  if (!device) {
    return <View />;
  }

  return (
    <View style={styles.container}>

      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});