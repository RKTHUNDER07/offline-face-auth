import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import Benchmark from '../utils/benchmark';

type BenchmarkSummary = {
  label: string;
  count: number;
  avg: number;
  min: number;
  max: number;
};

const BenchmarkScreen = () => {
  const [logs, setLogs] = useState(Benchmark.getLogs());

  const [summary, setSummary] = useState<BenchmarkSummary[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentLogs = Benchmark.getLogs();

      setLogs([...currentLogs]);

      setSummary(generateSummary(currentLogs));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const generateSummary = (logs: any[]): BenchmarkSummary[] => {
    const grouped: Record<string, number[]> = {};

    logs.forEach(log => {
      if (!grouped[log.label]) {
        grouped[log.label] = [];
      }

      grouped[log.label].push(log.duration);
    });

    return Object.entries(grouped).map(([label, durations]) => {
      const total = durations.reduce((sum, d) => sum + d, 0);

      const avg = total / durations.length;

      const min = Math.min(...durations);

      const max = Math.max(...durations);

      return {
        label,
        count: durations.length,
        avg,
        min,
        max,
      };
    });
  };

  const clearLogs = () => {
    Benchmark.clear();

    setLogs([]);

    setSummary([]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 40,
      }}>
      <Text style={styles.heading}>Benchmark Dashboard</Text>

      <TouchableOpacity style={styles.clearButton} onPress={clearLogs}>
        <Text style={styles.clearText}>Clear Logs</Text>
      </TouchableOpacity>

      {/* SUMMARY SECTION */}

      <Text style={styles.sectionTitle}>Summary Metrics</Text>

      {summary.length === 0 ? (
        <Text style={styles.emptyText}>No benchmark data yet</Text>
      ) : (
        summary.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.label}>{item.label}</Text>

            <Text style={styles.metric}>Count: {item.count}</Text>

            <Text style={styles.metric}>Avg: {item.avg.toFixed(2)} ms</Text>

            <Text style={styles.metric}>Min: {item.min.toFixed(2)} ms</Text>

            <Text style={styles.metric}>Max: {item.max.toFixed(2)} ms</Text>
          </View>
        ))
      )}

      {/* RAW LOGS */}

      <Text style={styles.sectionTitle}>Raw Logs</Text>

      {logs.length === 0 ? (
        <Text style={styles.emptyText}>No raw logs available</Text>
      ) : (
        <FlatList
          scrollEnabled={false}
          data={[...logs].reverse()}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.rawLogCard}>
              <Text style={styles.rawLabel}>{item.label}</Text>

              <Text style={styles.rawDuration}>
                {item.duration.toFixed(2)} ms
              </Text>

              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },

  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginTop: 20,
    marginBottom: 12,
  },

  emptyText: {
    fontSize: 16,
    color: '#555',
  },

  card: {
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
  },

  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },

  metric: {
    fontSize: 15,
    color: '#111',
    marginBottom: 4,
  },

  rawLogCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },

  rawLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  rawDuration: {
    fontSize: 18,
    color: '#000',
    marginTop: 4,
  },

  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },

  clearButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },

  clearText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BenchmarkScreen;
