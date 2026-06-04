import React from 'react';

import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

export default function AttendanceScreen({navigation}: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Attendance</Text>

        <Text style={styles.cardValue}>Not Marked</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sync Status</Text>

        <Text style={styles.cardValue}>All Synced</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AttendanceCamera')}>
        <Text style={styles.buttonText}>Mark Attendance</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
    justifyContent: 'center',
  },

  title: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 40,
    alignSelf: 'center',
  },

  card: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },

  cardTitle: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 8,
  },

  cardValue: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: '#22c55e',
    padding: 18,
    borderRadius: 14,
    marginTop: 30,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
