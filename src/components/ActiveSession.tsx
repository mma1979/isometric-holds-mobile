import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  BackHandler,
  Alert,
} from 'react-native';
import {
  Play,
  Pause,
  SkipForward,
  X,
  CheckCircle,
  Volume2,
  VolumeX,
  Timer,
  Flame,
  Trophy,
} from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { exercises } from '../data';
import { SessionConfigItem, LogEntry } from '../types';
import { useLogs } from '../store';
import ExerciseGraphic from './ExerciseGraphic';
import {
  speak,
  stopSpeech,
  playSessionStart,
  playTransition,
  playSessionEnd,
} from '../audio';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { theme } from '../theme';

interface ActiveSessionProps {
  config: SessionConfigItem[];
  onComplete: () => void;
  onCancel: () => void;
}

type StepType = 'prepare' | 'hold' | 'rest';

interface SessionStep {
  type: StepType;
  durationMs: number;
  exerciseId: string;
  setNum: number;
  totalSets: number;
  configData: SessionConfigItem;
}

export default function ActiveSession({ config, onComplete, onCancel }: ActiveSessionProps) {
  const { addLog, logs } = useLogs();
  const sessionStartTime = useRef(Date.now());

  // Build the flat sequence of steps
  const sequence = useMemo(() => {
    const steps: SessionStep[] = [];
    config.forEach((cfg, exIdx) => {
      for (let s = 1; s <= cfg.sets; s++) {
        // Prepare phase (5 seconds)
        steps.push({
          type: 'prepare',
          durationMs: 5000,
          exerciseId: cfg.exerciseId,
          setNum: s,
          totalSets: cfg.sets,
          configData: cfg,
        });

        // Hold phase
        steps.push({
          type: 'hold',
          durationMs: cfg.duration * 1000,
          exerciseId: cfg.exerciseId,
          setNum: s,
          totalSets: cfg.sets,
          configData: cfg,
        });

        // Rest phase (except after the very last set of the session)
        if (s < cfg.sets || exIdx < config.length - 1) {
          steps.push({
            type: 'rest',
            durationMs: cfg.rest * 1000,
            exerciseId: cfg.exerciseId,
            setNum: s,
            totalSets: cfg.sets,
            configData: cfg,
          });
        }
      }
    });
    return steps;
  }, [config]);

  const [stepIndex, setStepIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  // Timing state
  const currentStep = sequence[stepIndex];
  const [remainingTime, setRemainingTime] = useState(currentStep?.durationMs || 0);
  const endTimeRef = useRef<number>(Date.now() + (currentStep?.durationMs || 0));
  const remainingTimeRef = useRef<number>(currentStep?.durationMs || 0);
  const spokenStepRef = useRef<number>(-1);

  // Play start sound on mount
  useEffect(() => {
    if (voiceEnabled) {
      playSessionStart();
    }
    return () => {
      stopSpeech();
    };
  }, []);

  // Handle Android back button press
  useEffect(() => {
    const handleBackPress = () => {
      if (isFinished) {
        onComplete();
      } else {
        Alert.alert(
          'End Session',
          'Are you sure you want to end your current workout session?',
          [
            { text: 'Continue Workout', style: 'cancel' },
            { text: 'End Session', style: 'destructive', onPress: onCancel },
          ]
        );
      }
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => subscription.remove();
  }, [isFinished, onComplete, onCancel]);

  // Prevent screen lock while session is active and running
  useEffect(() => {
    if (!isFinished && !isPaused) {
      activateKeepAwakeAsync('active-session');
    } else {
      deactivateKeepAwake('active-session');
    }
    return () => {
      deactivateKeepAwake('active-session');
    };
  }, [isFinished, isPaused]);

  useEffect(() => {
    setShowVideo(false);
  }, [currentStep?.exerciseId]);

  // Voice guide effect
  useEffect(() => {
    if (!voiceEnabled || !currentStep || isFinished) return;
    if (spokenStepRef.current === stepIndex) return;
    spokenStepRef.current = stepIndex;

    const exercise = exercises.find((e) => e.id === currentStep.exerciseId);

    if (currentStep.type === 'prepare') {
      speak(`Get ready for ${exercise?.title}. Set ${currentStep.setNum} of ${currentStep.totalSets}.`);
    } else if (currentStep.type === 'hold') {
      speak(`Hold for ${currentStep.configData.duration} seconds.`);
    } else if (currentStep.type === 'rest') {
      speak(`Rest for ${currentStep.configData.rest} seconds.`);
    }
  }, [stepIndex, currentStep, isFinished, voiceEnabled]);

  // Session complete effect
  useEffect(() => {
    if (isFinished && voiceEnabled) {
      playSessionEnd();
      setTimeout(() => speak('Session complete. Great job!'), 600);
    }
  }, [isFinished, voiceEnabled]);

  // Initialize timing when step changes
  useEffect(() => {
    if (!currentStep) return;
    remainingTimeRef.current = currentStep.durationMs;
    setRemainingTime(currentStep.durationMs);
    endTimeRef.current = Date.now() + currentStep.durationMs;
  }, [stepIndex, currentStep]);

  // Interval loop for the timer
  useEffect(() => {
    if (isPaused || isFinished || !currentStep) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const newRemaining = Math.max(0, endTimeRef.current - now);
      remainingTimeRef.current = newRemaining;
      setRemainingTime(newRemaining);

      if (newRemaining <= 0) {
        clearInterval(interval);
        handleNextStep();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, isFinished, stepIndex, currentStep]);

  const handleNextStep = () => {
    if (!currentStep) return;

    // Log the exercise if we just finished its final HOLD set
    if (currentStep.type === 'hold' && currentStep.setNum === currentStep.totalSets) {
      const newEntry: LogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        exerciseId: currentStep.exerciseId,
        date: new Date().toISOString(),
        sets: currentStep.totalSets,
        durationReps: currentStep.configData.duration,
        weight: 0,
      };
      addLog(newEntry);
    }

    if (stepIndex + 1 < sequence.length) {
      const nextStep = sequence[stepIndex + 1];
      if (voiceEnabled) playTransition(nextStep.type);
      setStepIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleSkip = () => {
    handleNextStep();
  };

  const togglePause = () => {
    if (isPaused) {
      endTimeRef.current = Date.now() + remainingTimeRef.current;
      setIsPaused(false);
    } else {
      remainingTimeRef.current = Math.max(0, endTimeRef.current - Date.now());
      setIsPaused(true);
    }
  };

  if (isFinished) {
    const totalTimeHeld = config.reduce((acc, curr) => acc + curr.sets * curr.duration, 0);
    const totalRestTime = config.reduce((acc, curr) => acc + curr.sets * curr.rest, 0);
    const caloriesBurned = Math.round((totalTimeHeld / 60) * 5 + (totalRestTime / 60) * 1.5);

    // Find personal bests BEFORE this session started
    const bests: Record<string, number> = {};
    const previousLogs = logs.filter(
      (l) => new Date(l.date).getTime() < sessionStartTime.current
    );
    previousLogs.forEach((l) => {
      if (!bests[l.exerciseId] || l.durationReps > bests[l.exerciseId]) {
        bests[l.exerciseId] = l.durationReps;
      }
    });

    const newRecords = config
      .filter((c) => c.duration > (bests[c.exerciseId] || 0))
      .map((c) => ({
        exercise: exercises.find((e) => e.id === c.exerciseId),
        duration: c.duration,
        oldBest: bests[c.exerciseId] || 0,
      }));

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.summaryContainer}
      >
        <View style={styles.celebrationIcon}>
          <CheckCircle size={44} color={theme.colors.success} />
        </View>

        <Text style={styles.summaryTitle}>Session Complete!</Text>
        <Text style={styles.summarySubtitle}>
          Great job! All your isometric holds have been automatically logged.
        </Text>

        {/* Stats Grid */}
        <View style={styles.summaryStatsGrid}>
          <View style={styles.summaryStatCard}>
            <View style={[styles.summaryIconWrapper, { backgroundColor: theme.colors.infoBg }]}>
              <Timer size={22} color={theme.colors.info} />
            </View>
            <View>
              <Text style={styles.summaryStatLabel}>Total Hold Time</Text>
              <Text style={styles.summaryStatValue}>
                {Math.floor(totalTimeHeld / 60)}m {totalTimeHeld % 60}s
              </Text>
            </View>
          </View>

          <View style={styles.summaryStatCard}>
            <View
              style={[styles.summaryIconWrapper, { backgroundColor: theme.colors.warningBg }]}
            >
              <Flame size={22} color={theme.colors.warning} />
            </View>
            <View>
              <Text style={styles.summaryStatLabel}>Est. Calories</Text>
              <Text style={styles.summaryStatValue}>{caloriesBurned} kcal</Text>
            </View>
          </View>
        </View>

        {/* Records Section */}
        {newRecords.length > 0 && (
          <View style={styles.recordsCard}>
            <View style={styles.recordsHeader}>
              <Trophy size={20} color={theme.colors.primary} />
              <Text style={styles.recordsTitle}>New Personal Records!</Text>
            </View>
            {newRecords.map((record) => (
              <View key={record.exercise?.id} style={styles.recordItem}>
                <Text style={styles.recordExercise}>{record.exercise?.title}</Text>
                <View style={styles.recordRight}>
                  <Text style={styles.recordDuration}>{record.duration}s</Text>
                  <Text style={styles.recordOldBest}>(was {record.oldBest}s)</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={onComplete}
          style={styles.returnButton}
          activeOpacity={0.8}
        >
          <Text style={styles.returnButtonText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (!currentStep) return null;

  const exercise = exercises.find((e) => e.id === currentStep.exerciseId);
  const seconds = Math.ceil(remainingTime / 1000);

  // Dynamic phase styling
  let phaseColor = theme.colors.text;
  let phaseBg = theme.colors.cardLight;
  let phaseBorder = theme.colors.cardBorder;
  let phaseLabel = '';

  if (currentStep.type === 'prepare') {
    phaseColor = theme.colors.primary;
    phaseBg = theme.colors.primaryBg;
    phaseBorder = theme.colors.primary;
    phaseLabel = 'Get Ready';
  } else if (currentStep.type === 'hold') {
    phaseColor = theme.colors.success;
    phaseBg = theme.colors.successBg;
    phaseBorder = theme.colors.success;
    phaseLabel = 'Hold!';
  } else if (currentStep.type === 'rest') {
    phaseColor = theme.colors.info;
    phaseBg = theme.colors.infoBg;
    phaseBorder = theme.colors.info;
    phaseLabel = 'Rest';
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header controls */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={onCancel}
          style={styles.endButton}
          activeOpacity={0.7}
        >
          <X size={18} color={theme.colors.textMuted} />
          <Text style={styles.endButtonText}>End Session</Text>
        </TouchableOpacity>

        <View style={styles.topRightControls}>
          <Text style={styles.stepCounter}>
            Step {stepIndex + 1} of {sequence.length}
          </Text>
          <TouchableOpacity
            onPress={() => setVoiceEnabled(!voiceEnabled)}
            style={styles.voiceToggle}
            activeOpacity={0.7}
          >
            {voiceEnabled ? (
              <Volume2 size={20} color={theme.colors.primary} />
            ) : (
              <VolumeX size={20} color={theme.colors.textSubtle} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Visual / Media Container */}
      <View style={styles.mediaContainer}>
        {showVideo ? (
          <View style={styles.videoWrapper}>
            <YoutubePlayer
              height={220}
              play={true}
              videoId={exercise?.videoId || ''}
            />
          </View>
        ) : (
          <View style={styles.graphicWrapper}>
            <ExerciseGraphic
              exerciseId={exercise?.id || ''}
              style={styles.graphicImage}
            />
            {currentStep.type === 'rest' && (
              <View style={styles.restOverlay}>
                <Text style={styles.restOverlayText}>Resting...</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => setShowVideo(true)}
              style={styles.videoPlayButton}
              activeOpacity={0.8}
            >
              <Play size={20} color={theme.colors.primaryText} fill={theme.colors.primaryText} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Exercise Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>{exercise?.title}</Text>
        <View style={styles.badgesRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Set {currentStep.setNum} of {currentStep.totalSets}
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Target: {currentStep.configData.duration}s
            </Text>
          </View>
        </View>
      </View>

      {/* Active Timer Display */}
      <View style={styles.timerSection}>
        <Text style={[styles.phaseTitle, { color: phaseColor }]}>{phaseLabel}</Text>

        <View
          style={[
            styles.timerRing,
            { backgroundColor: phaseBg, borderColor: phaseBorder },
          ]}
        >
          <Text style={[styles.timerCountdown, { color: phaseColor }]}>
            {seconds}
          </Text>
        </View>

        {/* Action Controls */}
        <View style={styles.timerActions}>
          <TouchableOpacity
            onPress={togglePause}
            style={[styles.pauseResumeButton, { backgroundColor: theme.colors.cardLight }]}
            activeOpacity={0.8}
          >
            {isPaused ? (
              <Play size={32} color={theme.colors.text} fill={theme.colors.text} />
            ) : (
              <Pause size={32} color={theme.colors.text} fill={theme.colors.text} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSkip}
            style={styles.skipButton}
            activeOpacity={0.8}
          >
            <SkipForward size={22} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  endButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  endButtonText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepCounter: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textSubtle,
  },
  voiceToggle: {
    padding: 4,
  },
  mediaContainer: {
    height: 220,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.md,
  },
  videoWrapper: {
    flex: 1,
  },
  graphicWrapper: {
    flex: 1,
    position: 'relative',
  },
  graphicImage: {
    width: '100%',
    height: '100%',
  },
  restOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 7, 18, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restOverlayText: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text,
  },
  videoPlayButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: theme.colors.cardLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  timerSection: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseTitle: {
    fontSize: 22,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: theme.spacing.lg,
  },
  timerRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  timerCountdown: {
    fontSize: 72,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  timerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  pauseResumeButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.cardLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    paddingBottom: 40,
  },
  celebrationIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  summaryTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  summaryStatsGrid: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  summaryStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    gap: 10,
  },
  summaryIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryStatLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  summaryStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  recordsCard: {
    width: '100%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primaryBg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  recordsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  recordsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  recordExercise: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  recordRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  recordDuration: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.success,
  },
  recordOldBest: {
    fontSize: 11,
    color: theme.colors.textSubtle,
  },
  returnButton: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  returnButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primaryText,
  },
});
