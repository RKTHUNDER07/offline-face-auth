import React, {useEffect, useState} from 'react';

import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {getLastAttendance} from '../core/storage/getLastAttendance';
import {getTodayAttendance} from '../core/storage/getTodayAttendance';
import {getAttendanceLogs} from '../core/storage/getAttendanceLogs';
import {resetTodayAttendance} from '../core/storage/resetTodayAttendance';
export default function AttendanceScreen({navigation}: any) {
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const loadAttendance = async () => {
    const attendance = await getTodayAttendance();

    setTodayAttendance(attendance);
  };
  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString([], {
      day: '2-digit',

      month: 'short',

      year: 'numeric',

      hour: '2-digit',

      minute: '2-digit',
    });
  };
  const [lastAttendance, setLastAttendance] = useState<any>(null);
  const loadSyncStatus = async () => {
    const pendingLogs = await getAttendanceLogs();

    setPendingSyncCount(pendingLogs.length);
  };
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  const loadDashboard = async () => {
    const attendance = await getTodayAttendance();
    const last = await getLastAttendance();

    setLastAttendance(last);
    setTodayAttendance(attendance);

    const pendingLogs = await getAttendanceLogs();

    setPendingSyncCount(pendingLogs.length);
  };
  useEffect(() => {
    loadAttendance();
    loadSyncStatus();
    loadDashboard();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDashboard();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadAttendance);

    return unsubscribe;
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Attendance</Text>

        <Text style={styles.cardValue}>
          {todayAttendance ? 'Marked' : 'Not Marked'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sync Status</Text>

        <Text style={styles.cardValue}>
          {pendingSyncCount === 0
            ? 'All Synced'
            : `${pendingSyncCount} Pending`}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Last Attendance</Text>

        <Text style={styles.cardValue}>
          {lastAttendance
            ? formatDateTime(lastAttendance.timestamp)
            : 'No Records'}
        </Text>
      </View>
      <TouchableOpacity
        disabled={!!todayAttendance}
        style={[
          styles.button,

          todayAttendance && {
            backgroundColor: '#555',
          },
        ]}
        onPress={() => navigation.navigate('AttendanceCamera')}>
        <Text style={styles.buttonText}>
          {todayAttendance ? 'Attendance Already Marked' : 'Mark Attendance'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.resetButton}
        onPress={async () => {
          await resetTodayAttendance();

          loadAttendance();
        }}>
        <Text style={styles.buttonText}>Reset Today's Attendance</Text>
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
  resetButton: {
    backgroundColor: '#ef4444',
    padding: 18,
    borderRadius: 14,
    marginTop: 20,
    alignItems: 'center',
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
