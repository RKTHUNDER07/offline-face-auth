import React from 'react';
import {StyleSheet, View} from 'react-native';

function FaceOverlay(): JSX.Element {
  return (
    <View style={styles.overlayContainer}>
      <View style={styles.faceCircle} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceCircle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 4,
    borderColor: '#00FF88',
    backgroundColor: 'transparent',
  },
});

export default FaceOverlay;