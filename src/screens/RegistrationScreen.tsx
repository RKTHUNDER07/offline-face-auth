import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function RegistrationScreen({
  navigation,
}: any) {

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Biometric Registration
      </Text>

      <Text style={styles.subtitle}>
        Register your face
        for offline attendance
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate(
            'RegistrationCamera',
          )
        }
      >
        <Text style={styles.buttonText}>
          Start Registration
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 40,
  },

  button: {
    width: 260,
    paddingVertical: 18,
    backgroundColor: '#16a34a',
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
});