import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Plus,
  Clock,
  Dumbbell,
  History,
  Target,
  Play,
  Trash2,
} from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Exercise, LogEntry } from '../types';
import { practiceSets } from '../data';
import { useLogs } from '../store';
import ProgressChart from './ProgressChart';
import Stopwatch from './Stopwatch';
import ExerciseGraphic from './ExerciseGraphic';
import { format, parseISO } from 'date-fns';
import { theme } from '../theme';

interface ExerciseDetailProps {
  exercise: Exercise;
  onBack: () => void;
}

export default function ExerciseDetail({ exercise, onBack }: ExerciseDetailProps) {
  const { addLog, getLogsForExercise, deleteLog } = useLogs();
  const exerciseLogs = getLogsForExercise(exercise.id);

  const [sets, setSets] = useState('3');
  const [durationReps, setDurationReps] = useState('30');
  const [weight, setWeight] = useState('0');
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setShowVideo(false);
  }, [exercise.id]);

  const handleLogWorkout = () => {
    const setsNum = parseInt(sets, 10);
    const durationNum = parseInt(durationReps, 10);
    const weightNum = parseFloat(weight) || 0;

    if (!setsNum || setsNum <= 0 || !durationNum || durationNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for sets and duration.');
      return;
    }

    const newLog: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      exerciseId: exercise.id,
      date: new Date().toISOString(),
      sets: setsNum,
      durationReps: durationNum,
      weight: weightNum,
    };

    addLog(newLog);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <ArrowLeft size={18} color={theme.colors.textMuted} />
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>

      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>{exercise.title}</Text>
        <Text style={styles.subtitle}>
          {practiceSets.find((p) => p.id === exercise.practiceSetId)?.title || 'Isometric Hold Protocol'}
        </Text>
      </View>

      {/* Media / Video Card */}
      <View style={styles.mediaContainer}>
        {showVideo ? (
          <View style={styles.videoWrapper}>
            <YoutubePlayer
              height={220}
              play={true}
              videoId={exercise.videoId}
            />
          </View>
        ) : (
          <View style={styles.graphicWrapper}>
            <ExerciseGraphic
              exerciseId={exercise.id}
              style={styles.graphicImage}
            />
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

      {/* Instructions Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Target size={18} color={theme.colors.primary} />
          <Text style={styles.cardTitle}>How to Perform</Text>
        </View>
        <View style={styles.stepsList}>
          {exercise.steps.map((step, idx) => (
            <View key={idx} style={styles.stepItem}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{idx + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Progression Guide Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progression Guide</Text>
        <View style={styles.progressionList}>
          <View style={styles.progressionRow}>
            <Text style={styles.progressionLabel}>Week 1</Text>
            <Text style={styles.progressionValue}>{exercise.progression.week1}</Text>
          </View>
          <View style={styles.progressionRow}>
            <Text style={styles.progressionLabel}>Week 2</Text>
            <Text style={styles.progressionValue}>{exercise.progression.week2}</Text>
          </View>
          <View style={[styles.progressionRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.progressionLabel}>Week 3</Text>
            <Text style={[styles.progressionValue, { color: theme.colors.primary }]}>
              {exercise.progression.week3}
            </Text>
          </View>
        </View>
      </View>

      {/* Hold Stopwatch */}
      <View style={{ marginBottom: theme.spacing.md }}>
        <Stopwatch onUseTime={(sec) => setDurationReps(sec.toString())} />
      </View>

      {/* Manual Workout Logger */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Plus size={18} color={theme.colors.primary} />
          <Text style={styles.cardTitle}>Log Your Session</Text>
        </View>

        <View style={styles.formRow}>
          <View style={styles.formCol}>
            <Text style={styles.formLabel}>Sets</Text>
            <TextInput
              style={styles.input}
              value={sets}
              onChangeText={setSets}
              keyboardType="number-pad"
              placeholderTextColor={theme.colors.textSubtle}
            />
          </View>

          <View style={styles.formCol}>
            <Text style={styles.formLabel}>Duration (sec)</Text>
            <View style={styles.inputWithIcon}>
              <Clock size={16} color={theme.colors.textSubtle} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputPadded]}
                value={durationReps}
                onChangeText={setDurationReps}
                keyboardType="number-pad"
                placeholderTextColor={theme.colors.textSubtle}
              />
            </View>
          </View>
        </View>

        <View style={styles.formFull}>
          <View style={styles.weightHeader}>
            <Text style={styles.formLabel}>Weight (Optional)</Text>
            <Text style={styles.weightHint}>lbs/kg</Text>
          </View>
          <View style={styles.inputWithIcon}>
            <Dumbbell size={16} color={theme.colors.textSubtle} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.inputPadded]}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="0 (Bodyweight)"
              placeholderTextColor={theme.colors.textSubtle}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogWorkout}
          style={styles.saveLogButton}
          activeOpacity={0.8}
        >
          <Text style={styles.saveLogButtonText}>Save Log</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Tracker Chart */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <History size={18} color={theme.colors.primary} />
          <Text style={styles.cardTitle}>Progress Tracker</Text>
        </View>
        <ProgressChart logs={exerciseLogs} />
      </View>

      {/* History Log List */}
      {exerciseLogs.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.historySectionTitle}>History</Text>
          <View style={styles.historyList}>
            {exerciseLogs
              .slice()
              .reverse()
              .map((log) => (
                <View key={log.id} style={styles.historyItem}>
                  <View>
                    <Text style={styles.historyDate}>
                      {format(parseISO(log.date), 'MMM d, yyyy - h:mm a')}
                    </Text>
                    <Text style={styles.historyDetail}>
                      {log.sets} sets × {log.durationReps} sec{' '}
                      {log.weight > 0 ? `+ ${log.weight} wgt` : '(Bodyweight)'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => deleteLog(log.id)}
                    style={styles.deleteButton}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={16} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        </View>
      )}
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
    paddingBottom: 60,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  backButtonText: {
    marginLeft: theme.spacing.xs,
    fontSize: 14,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 2,
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
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  stepsList: {
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textMuted,
  },
  progressionList: {
    marginTop: theme.spacing.sm,
  },
  progressionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  progressionLabel: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  progressionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: theme.spacing.md,
  },
  formCol: {
    flex: 1,
  },
  formFull: {
    marginBottom: theme.spacing.md,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textMuted,
    marginBottom: 6,
  },
  weightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weightHint: {
    fontSize: 11,
    color: theme.colors.textSubtle,
  },
  input: {
    backgroundColor: theme.colors.cardLight,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
    color: theme.colors.text,
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputWithIcon: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  inputPadded: {
    paddingLeft: 38,
  },
  saveLogButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveLogButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primaryText,
  },
  historySectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.cardLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  historyDate: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  historyDetail: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  deleteButton: {
    padding: 6,
  },
});
