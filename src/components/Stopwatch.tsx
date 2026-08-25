import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { theme } from '../theme';

interface StopwatchProps {
  onUseTime: (seconds: number) => void;
}

export default function Stopwatch({ onUseTime }: StopwatchProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // Time in milliseconds
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      activateKeepAwakeAsync('stopwatch');
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setTime(accumulatedTimeRef.current + elapsed);
      }, 50);
    } else {
      deactivateKeepAwake('stopwatch');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      deactivateKeepAwake('stopwatch');
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => {
    if (isRunning) {
      accumulatedTimeRef.current = time;
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    accumulatedTimeRef.current = 0;
    setTime(0);
  };

  const handleUseTime = () => {
    onUseTime(Math.round(time / 1000));
  };

  // Format time (MM:SS.ms)
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = Math.floor((time % 1000) / 10); // 2 digits

  const formatUnit = (unit: number) => unit.toString().padStart(2, '0');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Isometric Hold Timer</Text>

      <View style={styles.timeDisplay}>
        <Text style={styles.timeMain}>
          {formatUnit(minutes)}:{formatUnit(seconds)}
        </Text>
        <Text style={styles.timeSub}>.{formatUnit(milliseconds)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={resetTimer}
          style={styles.secondaryButton}
          activeOpacity={0.7}
        >
          <RotateCcw size={20} color={theme.colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleTimer}
          style={[
            styles.primaryButton,
            isRunning ? styles.pauseButton : styles.playButton,
          ]}
          activeOpacity={0.8}
        >
          {isRunning ? (
            <Pause size={28} color={theme.colors.text} fill={theme.colors.text} />
          ) : (
            <Play
              size={28}
              color={theme.colors.primaryText}
              fill={theme.colors.primaryText}
              style={{ marginLeft: 3 }}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleUseTime}
          disabled={time === 0}
          style={[
            styles.secondaryButton,
            time === 0 && styles.disabledButton,
          ]}
          activeOpacity={0.7}
        >
          <CheckCircle2
            size={22}
            color={time === 0 ? theme.colors.textSubtle : theme.colors.success}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.lg,
  },
  timeMain: {
    fontSize: 44,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    color: theme.colors.text,
    letterSpacing: -1,
  },
  timeSub: {
    fontSize: 26,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: theme.colors.textSubtle,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.cardLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.4,
  },
  primaryButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  playButton: {
    backgroundColor: theme.colors.primary,
  },
  pauseButton: {
    backgroundColor: theme.colors.error,
  },
});
