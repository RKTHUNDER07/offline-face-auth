import React from 'react';
import {StyleSheet, View} from 'react-native';

type Props = {
  borderColor: string;
};

function FaceOverlay({borderColor}: Props): JSX.Element {
  return (
    <View style={styles.overlayContainer}>
      <View
        style={[
          styles.faceCircle,
          {
            borderColor,
          },
        ]}
      />
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
    backgroundColor: 'transparent',
  },
});

export default FaceOverlay;