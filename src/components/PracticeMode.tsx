import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Modal,
} from 'react-native';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  Check,
  Flame,
  Clock,
  ChevronDown,
  Layers,
  X,
} from 'lucide-react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { practiceSets, getExercisesForSet } from '../data';
import { Exercise, LogEntry } from '../types';
import { useLogs } from '../store';
import { speak, stopSpeech, triggerHaptic } from '../audio';
import ExerciseGraphic from './ExerciseGraphic';
import { theme } from '../theme';

interface PracticeModeProps {
  practiceSetId: string;
  onBack: () => void;
  onOpenExerciseDetail?: (exerciseId: string) => void;
}

export default function PracticeMode({
  practiceSetId,
  onBack,
  onOpenExerciseDetail,
}: PracticeModeProps) {
  const [currentSetId, setCurrentSetId] = useState(practiceSetId);
  const [showSetPicker, setShowSetPicker] = useState(false);

  const practiceSet = useMemo(
    () => practiceSets.find((s) => s.id === currentSetId) || practiceSets[0],
    [currentSetId]
  );

  const setExercises = useMemo(
    () => getExercisesForSet(practiceSet.id),
    [practiceSet.id]
  );

  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const activeExercise: Exercise = setExercises[activeExerciseIndex] || setExercises[0];

  const { addLog, logs } = useLogs();

  // Stopwatch state
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [logToast, setLogToast] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef<number>(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Keep screen awake during practice
  useEffect(() => {
    activateKeepAwakeAsync();
    return () => {
      deactivateKeepAwake();
      stopSpeech();
    };
  }, []);

  // Timer interval handling
  useEffect(() => {
    if (isRunning) {
      lastTickRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const delta = now - lastTickRef.current;
        lastTickRef.current = now;
        setElapsedMs((prev) => prev + delta);
      }, 50);

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.04,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      pulseAnim.setValue(1);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, pulseAnim]);

  const handleSwitchSet = (newSetId: string) => {
    if (newSetId === currentSetId) {
      setShowSetPicker(false);
      return;
    }
    setIsRunning(false);
    setElapsedMs(0);
    setCurrentSet(1);
    setActiveExerciseIndex(0);
    setCurrentSetId(newSetId);
    setShowSetPicker(false);
  };

  // Handle exercise change: pause and reset timer
  const handleSelectExercise = (index: number) => {
    if (index === activeExerciseIndex) return;
    setIsRunning(false);
    setElapsedMs(0);
    setCurrentSet(1);
    setActiveExerciseIndex(index);
    if (soundEnabled) {
      speak(setExercises[index].title);
    }
  };

  const handleToggleTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      triggerHaptic('hold');
      if (soundEnabled && elapsedMs === 0) {
        speak('Hold');
      }
    } else {
      setIsRunning(false);
      triggerHaptic('rest');
    }
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setElapsedMs(0);
    triggerHaptic('rest');
  };

  const handleLogHold = () => {
    const durationSeconds = Math.max(1, Math.round(elapsedMs / 1000));
    const newLog: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      exerciseId: activeExercise.id,
      date: new Date().toISOString(),
      sets: 1,
      durationReps: durationSeconds,
      weight: 0,
    };

    addLog(newLog);
    triggerHaptic('complete');
    if (soundEnabled) {
      speak(`Logged ${durationSeconds} seconds`);
    }

    setLogToast(`Set ${currentSet} saved: ${durationSeconds}s hold`);
    setTimeout(() => {
      setLogToast(null);
    }, 3000);

    // Auto-advance set counter and reset stopwatch for next set
    setCurrentSet((prev) => prev + 1);
    setIsRunning(false);
    setElapsedMs(0);
  };

  // Today's logs check
  const todayDatePrefix = new Date().toISOString().split('T')[0];
  const todayLogs = useLogsForToday(logs, todayDatePrefix);

  const formatTimer = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${tenths}`;
  };

  const activeHoldLogsToday = todayLogs.filter(
    (l) => l.exerciseId === activeExercise.id
  );

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={theme.colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerTitles}
          onPress={() => setShowSetPicker(true)}
          activeOpacity={0.7}
        >
          <View style={styles.headerSubtitleRow}>
            <Text style={styles.headerSubtitle}>{practiceSet.title}</Text>
            <ChevronDown size={13} color={theme.colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Practice Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSoundEnabled((prev) => !prev)}
          style={styles.soundButton}
          activeOpacity={0.7}
        >
          {soundEnabled ? (
            <Volume2 size={20} color={theme.colors.primary} />
          ) : (
            <VolumeX size={20} color={theme.colors.textSubtle} />
          )}
        </TouchableOpacity>
      </View>

      {/* Toast Notification Banner */}
      {logToast && (
        <View style={styles.toast}>
          <CheckCircle2 size={16} color={theme.colors.success} />
          <Text style={styles.toastText}>{logToast}</Text>
        </View>
      )}

      {/* Horizontal Hold Selector Carousel */}
      <View style={styles.selectorWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectorScroll}
        >
          {setExercises.map((ex, idx) => {
            const isSelected = idx === activeExerciseIndex;
            const hasPracticedToday = todayLogs.some(
              (l) => l.exerciseId === ex.id
            );

            return (
              <TouchableOpacity
                key={ex.id}
                onPress={() => handleSelectExercise(idx)}
                style={[
                  styles.selectorChip,
                  isSelected && styles.selectorChipActive,
                ]}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.chipBadge,
                    isSelected && styles.chipBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipBadgeText,
                      isSelected && styles.chipBadgeTextActive,
                    ]}
                  >
                    {idx + 1}
                  </Text>
                </View>

                <Text
                  numberOfLines={1}
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextActive,
                  ]}
                >
                  {ex.title}
                </Text>

                {hasPracticedToday && (
                  <View style={styles.practicedDot}>
                    <Check size={10} color={theme.colors.success} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Exercise Card / Banner */}
        <View style={styles.card}>
          <View style={styles.graphicContainer}>
            <ExerciseGraphic
              exerciseId={activeExercise.id}
              style={styles.graphic}
            />
            <View style={styles.graphicOverlay} />
            <View style={styles.graphicTextContent}>
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    Hold {activeExerciseIndex + 1} of {setExercises.length}
                  </Text>
                </View>
                <View style={styles.targetBadge}>
                  <Clock size={12} color={theme.colors.primary} />
                  <Text style={styles.targetBadgeText}>
                    Target: {activeExercise.progression.week1}
                  </Text>
                </View>
              </View>
              <Text style={styles.exerciseName}>{activeExercise.title}</Text>
            </View>
          </View>
        </View>

        {/* Big Interactive Stopwatch Timer */}
        <View style={styles.timerSection}>
          <View style={styles.setRow}>
            <Text style={styles.setLabel}>Set Number</Text>
            <View style={styles.setStepper}>
              <TouchableOpacity
                onPress={() => setCurrentSet((s) => Math.max(1, s - 1))}
                style={styles.setStepButton}
                activeOpacity={0.7}
              >
                <Minus size={14} color={theme.colors.textMuted} />
              </TouchableOpacity>
              <Text style={styles.setNumberText}>Set {currentSet}</Text>
              <TouchableOpacity
                onPress={() => setCurrentSet((s) => s + 1)}
                style={styles.setStepButton}
                activeOpacity={0.7}
              >
                <Plus size={14} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Animated Timer Display */}
          <Animated.View
            style={[
              styles.timerRing,
              isRunning && styles.timerRingActive,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Text
              style={[
                styles.timerDigits,
                isRunning && styles.timerDigitsActive,
              ]}
            >
              {formatTimer(elapsedMs)}
            </Text>
            <Text style={styles.timerStatus}>
              {isRunning
                ? 'HOLDING'
                : elapsedMs > 0
                ? 'PAUSED'
                : 'TAP START TO HOLD'}
            </Text>
          </Animated.View>

          {/* Timer Controls */}
          <View style={styles.controlsRow}>
            <TouchableOpacity
              onPress={handleResetTimer}
              style={styles.secondaryButton}
              activeOpacity={0.7}
              disabled={elapsedMs === 0}
            >
              <RotateCcw
                size={20}
                color={elapsedMs > 0 ? theme.colors.text : theme.colors.textSubtle}
              />
              <Text
                style={[
                  styles.secondaryButtonText,
                  elapsedMs === 0 && styles.disabledText,
                ]}
              >
                Reset
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleToggleTimer}
              style={[
                styles.primaryTimerButton,
                isRunning && styles.primaryTimerButtonHolding,
              ]}
              activeOpacity={0.85}
            >
              {isRunning ? (
                <>
                  <Pause
                    size={24}
                    color={theme.colors.primaryText}
                    fill={theme.colors.primaryText}
                  />
                  <Text style={styles.primaryTimerButtonText}>Pause</Text>
                </>
              ) : (
                <>
                  <Play
                    size={24}
                    color={theme.colors.primaryText}
                    fill={theme.colors.primaryText}
                  />
                  <Text style={styles.primaryTimerButtonText}>
                    {elapsedMs > 0 ? 'Resume' : 'Start Hold'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogHold}
              style={[
                styles.logButton,
                elapsedMs < 1000 && styles.logButtonDisabled,
              ]}
              activeOpacity={0.8}
              disabled={elapsedMs < 1000}
            >
              <CheckCircle2
                size={20}
                color={elapsedMs >= 1000 ? theme.colors.success : theme.colors.textSubtle}
              />
              <Text
                style={[
                  styles.logButtonText,
                  elapsedMs < 1000 && styles.disabledText,
                ]}
              >
                Log Hold
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hold Posture Cues */}
        <View style={styles.cuesCard}>
          <Text style={styles.sectionHeading}>Posture Key Steps</Text>
          <View style={styles.stepsList}>
            {activeExercise.steps.map((step, sIdx) => (
              <View key={sIdx} style={styles.stepItem}>
                <View style={styles.stepBullet}>
                  <Text style={styles.stepBulletText}>{sIdx + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Today's Practice Stats for this Hold */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <View style={styles.statsIconWrapper}>
              <Flame size={18} color={theme.colors.primary} />
            </View>
            <Text style={styles.statsTitle}>Today's Holds ({activeExercise.title})</Text>
          </View>

          {activeHoldLogsToday.length === 0 ? (
            <Text style={styles.emptyStatsText}>
              No sets logged for this hold today yet. Complete a hold and tap "Log Hold"!
            </Text>
          ) : (
            <View style={styles.logsList}>
              {activeHoldLogsToday.map((log, lIdx) => (
                <View key={log.id} style={styles.logRow}>
                  <Text style={styles.logIndex}>Set #{lIdx + 1}</Text>
                  <Text style={styles.logDuration}>{log.durationReps} seconds</Text>
                  <CheckCircle2 size={16} color={theme.colors.success} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Set Switcher Modal */}
      <Modal
        visible={showSetPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSetPicker(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Layers size={18} color={theme.colors.primary} />
                <Text style={styles.modalTitle}>Choose Practice Group</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowSetPicker(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <X size={18} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalSetsList} showsVerticalScrollIndicator={false}>
              {practiceSets.map((pSet) => {
                const isCurrent = pSet.id === practiceSet.id;
                return (
                  <TouchableOpacity
                    key={pSet.id}
                    onPress={() => handleSwitchSet(pSet.id)}
                    style={[
                      styles.modalSetItem,
                      isCurrent && styles.modalSetItemActive,
                    ]}
                    activeOpacity={0.8}
                  >
                    <View style={styles.modalSetItemInfo}>
                      <View style={styles.modalSetTitleRow}>
                        <Text
                          style={[
                            styles.modalSetTitle,
                            isCurrent && styles.modalSetTitleActive,
                          ]}
                        >
                          {pSet.title}
                        </Text>
                        <View style={styles.modalSetBadge}>
                          <Text style={styles.modalSetBadgeText}>
                            {pSet.exerciseIds.length} Holds
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.modalSetSubtitle} numberOfLines={2}>
                        {pSet.subtitle || pSet.description}
                      </Text>
                    </View>
                    {isCurrent && <Check size={18} color={theme.colors.primary} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Hook helper to filter today's logs
function useLogsForToday(logs: LogEntry[], todayDatePrefix: string) {
  return useMemo(() => {
    return logs.filter((log) => log.date.startsWith(todayDatePrefix));
  }, [logs, todayDatePrefix]);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    padding: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.card,
  },
  headerTitles: {
    alignItems: 'center',
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  soundButton: {
    padding: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.card,
  },
  toast: {
    position: 'absolute',
    top: 60,
    left: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderWidth: 1,
    borderColor: theme.colors.success,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 99,
    shadowColor: theme.colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  selectorWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.card,
  },
  selectorScroll: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    gap: 8,
  },
  selectorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    gap: 6,
  },
  selectorChipActive: {
    backgroundColor: theme.colors.primaryBg,
    borderColor: theme.colors.primary,
  },
  chipBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.cardBorderHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipBadgeActive: {
    backgroundColor: theme.colors.primary,
  },
  chipBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.textSubtle,
  },
  chipBadgeTextActive: {
    color: theme.colors.primaryText,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  chipTextActive: {
    color: theme.colors.text,
    fontWeight: '700',
  },
  practicedDot: {
    marginLeft: 2,
  },
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  graphicContainer: {
    height: 180,
    position: 'relative',
  },
  graphic: {
    width: '100%',
    height: '100%',
  },
  graphicOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 7, 18, 0.55)',
  },
  graphicTextContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text,
  },
  targetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: theme.colors.primaryBg,
  },
  targetBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  exerciseName: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
  },
  timerSection: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  setLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  setStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.cardLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  setStepButton: {
    padding: 4,
  },
  setNumberText: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.text,
  },
  timerRing: {
    width: 220,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.cardLight,
    borderWidth: 2,
    borderColor: theme.colors.cardBorderHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  timerRingActive: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(234, 179, 8, 0.08)',
  },
  timerDigits: {
    fontSize: 42,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    color: theme.colors.text,
    letterSpacing: -1,
  },
  timerDigitsActive: {
    color: theme.colors.primary,
  },
  timerStatus: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.textMuted,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
    marginTop: 16,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.cardLight,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  primaryTimerButton: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryTimerButtonHolding: {
    backgroundColor: theme.colors.warning,
  },
  primaryTimerButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primaryText,
  },
  logButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.cardLight,
  },
  logButtonDisabled: {
    opacity: 0.45,
  },
  logButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  disabledText: {
    color: theme.colors.textSubtle,
  },
  cuesCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  stepsList: {
    gap: 10,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepBulletText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.textMuted,
  },
  statsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  statsIconWrapper: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: theme.colors.primaryBg,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  emptyStatsText: {
    fontSize: 12,
    color: theme.colors.textSubtle,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  logsList: {
    gap: 8,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.cardLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.sm,
  },
  logIndex: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  logDuration: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.82)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    maxHeight: '80%',
    padding: theme.spacing.md,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.text,
  },
  modalCloseBtn: {
    padding: 6,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.cardLight,
  },
  modalSetsList: {
    maxHeight: 400,
  },
  modalSetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.cardLight,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: 10,
  },
  modalSetItemActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryBg,
  },
  modalSetItemInfo: {
    flex: 1,
    gap: 4,
    paddingRight: 8,
  },
  modalSetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalSetTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.text,
  },
  modalSetTitleActive: {
    color: theme.colors.primary,
  },
  modalSetBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalSetBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  modalSetSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 16,
  },
});
