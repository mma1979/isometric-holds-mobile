import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogEntry, PracticeSet } from './types';

const STORAGE_KEY = '@shaolin_isometric_logs';
const CUSTOM_PRACTICES_KEY = '@custom_practice_sets';

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

let customPracticesListeners: Array<(practices: PracticeSet[]) => void> = [];
let cachedCustomPractices: PracticeSet[] | null = null;

const notifyCustomPractices = (practices: PracticeSet[]) => {
  cachedCustomPractices = practices;
  customPracticesListeners.forEach((listener) => listener(practices));
};

export function useCustomPractices() {
  const [customPractices, setCustomPractices] = useState<PracticeSet[]>(
    cachedCustomPractices || []
  );
  const [isLoading, setIsLoading] = useState(cachedCustomPractices === null);

  const loadCustomPractices = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(CUSTOM_PRACTICES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        notifyCustomPractices(parsed);
      } else {
        notifyCustomPractices([]);
      }
    } catch (e) {
      console.error('Failed to load custom practice sets', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const listener = (updated: PracticeSet[]) => {
      setCustomPractices(updated);
    };
    customPracticesListeners.push(listener);

    if (cachedCustomPractices === null) {
      loadCustomPractices();
    } else {
      setCustomPractices(cachedCustomPractices);
      setIsLoading(false);
    }

    return () => {
      customPracticesListeners = customPracticesListeners.filter((l) => l !== listener);
    };
  }, [loadCustomPractices]);

  const addCustomPractice = async (
    practice: Omit<PracticeSet, 'id' | 'isCustom' | 'createdAt'>
  ): Promise<PracticeSet> => {
    const newPractice: PracticeSet = {
      ...practice,
      id: `custom-practice-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [...(cachedCustomPractices || []), newPractice];
    notifyCustomPractices(updated);
    try {
      await AsyncStorage.setItem(CUSTOM_PRACTICES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save custom practice set', e);
    }
    return newPractice;
  };

  const updateCustomPractice = async (
    id: string,
    updates: Partial<Omit<PracticeSet, 'id' | 'isCustom'>>
  ): Promise<void> => {
    const current = cachedCustomPractices || [];
    const updated = current.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    notifyCustomPractices(updated);
    try {
      await AsyncStorage.setItem(CUSTOM_PRACTICES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update custom practice set', e);
    }
  };

  const deleteCustomPractice = async (id: string): Promise<void> => {
    const current = cachedCustomPractices || [];
    const updated = current.filter((item) => item.id !== id);
    notifyCustomPractices(updated);
    try {
      await AsyncStorage.setItem(CUSTOM_PRACTICES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete custom practice set', e);
    }
  };

  return {
    customPractices,
    isLoading,
    addCustomPractice,
    updateCustomPractice,
    deleteCustomPractice,
    reloadCustomPractices: loadCustomPractices,
  };
}

