import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogEntry } from './types';

const STORAGE_KEY = '@shaolin_isometric_logs';

export function useLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLogs = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLogs(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load logs from storage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const addLog = async (log: LogEntry) => {
    try {
      const newLogs = [...logs, log];
      setLogs(newLogs);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
    } catch (e) {
      console.error('Failed to save log', e);
    }
  };

  const deleteLog = async (id: string) => {
    try {
      const newLogs = logs.filter((log) => log.id !== id);
      setLogs(newLogs);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
    } catch (e) {
      console.error('Failed to delete log', e);
    }
  };

  const getLogsForExercise = useCallback((exerciseId: string) => {
    return logs
      .filter((log) => log.exerciseId === exerciseId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [logs]);

  return {
    logs,
    isLoading,
    addLog,
    deleteLog,
    getLogsForExercise,
    reloadLogs: loadLogs,
  };
}
