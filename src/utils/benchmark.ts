type BenchmarkEntry = {
  label: string;
  duration: number;
  timestamp: string;
};

class Benchmark {
  private static timers: Record<string, number> = {};

  static logs: BenchmarkEntry[] = [];

  static start(label: string) {
    this.timers[label] = performance.now();
  }

  static end(label: string) {
    const start = this.timers[label];

    if (!start) {
      console.log(`NO TIMER FOUND FOR ${label}`);

      return;
    }

    const end = performance.now();

    const duration = end - start;

    const entry = {
      label,
      duration,
      timestamp: new Date().toISOString(),
    };

    this.logs.push(entry);

    console.log(this.logs);

    return entry;
  }
  static getLogs() {
    return this.logs;
  }

  static clear() {
    this.logs = [];
  }
  static getSummary() {
    const grouped: Record<string, number[]> = {};

    this.logs.forEach(log => {
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
  }
}

export default Benchmark;
