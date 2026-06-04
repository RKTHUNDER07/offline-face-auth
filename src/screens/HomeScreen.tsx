import React, {useEffect} from 'react';

import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {getRegistration} from '../core/storage/getRegistration';
export default function HomeScreen({navigation}: any) {
  useEffect(() => {
    const checkRegistration = async () => {
      const registration = await getRegistration('demo-user');
      console.log('HOME REGISTRATION FOUND:', !!registration);
      console.log('EMBEDDING COUNT:', registration?.embeddings?.length);
    };
    checkRegistration();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EdgeAuth</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Registration')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EmbeddingTest')}>
        <Text style={styles.buttonText}>Test Embeddings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Attendance')}>
        <Text style={styles.buttonText}>Attendance</Text>
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
  },

  title: {
    fontSize: 34,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 50,
  },

  button: {
    width: 220,
    paddingVertical: 18,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
});
