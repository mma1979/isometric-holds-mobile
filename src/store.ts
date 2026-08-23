import { useState, useEffect } from 'react';
import { LogEntry } from './types';

const STORAGE_KEY = 'shaolin_isometric_logs';

export function useLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Load on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setLogs(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse logs from local storage', e);
      }
    }
  }, []);

  const addLog = (log: LogEntry) => {
    const newLogs = [...logs, log];
    setLogs(newLogs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
  };

  const deleteLog = (id: string) => {
    const newLogs = logs.filter((log) => log.id !== id);
    setLogs(newLogs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
  };

  const getLogsForExercise = (exerciseId: string) => {
    return logs.filter((log) => log.exerciseId === exerciseId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  return {
    logs,
    addLog,
    deleteLog,
    getLogsForExercise
  };
}
