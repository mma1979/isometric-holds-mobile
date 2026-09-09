import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import {
  ArrowLeft,
  Check,
  Play,
  Plus,
  Minus,
  SlidersHorizontal,
  X,
} from 'lucide-react-native';
import { exercises } from '../data';
import { SessionConfigItem } from '../types';
import { theme } from '../theme';

interface SessionConfiguratorProps {
  onStart: (config: SessionConfigItem[]) => void;
  onCancel: () => void;
}

interface LocalConfig {
  selected: boolean;
  sets: number;
  duration: number;
  rest: number;
}

const PRESETS = [
  { label: 'Beginner', sets: 2, duration: 20, rest: 15 },
  { label: 'Standard', sets: 3, duration: 30, rest: 10 },
  { label: 'Intense', sets: 4, duration: 45, rest: 15 },
  { label: 'Mastery', sets: 5, duration: 60, rest: 20 },
];

export default function SessionConfigurator({ onStart, onCancel }: SessionConfiguratorProps) {
  const [showGlobalModal, setShowGlobalModal] = useState(true);
  const [globalSets, setGlobalSets] = useState(3);
  const [globalDuration, setGlobalDuration] = useState(30);
  const [globalRest, setGlobalRest] = useState(10);

  const [configs, setConfigs] = useState<Record<string, LocalConfig>>(() => {
    const initial: Record<string, LocalConfig> = {};
    exercises.forEach((ex) => {
      initial[ex.id] = { selected: true, sets: 3, duration: 30, rest: 10 };
    });
    return initial;
  });

  const applyGlobalTargets = () => {
    setConfigs((prev) => {
      const updated: Record<string, LocalConfig> = {};
      Object.keys(prev).forEach((id) => {
        updated[id] = {
          ...prev[id],
          sets: globalSets,
          duration: globalDuration,
          rest: globalRest,
        };
      });
      return updated;
    });
    setShowGlobalModal(false);
  };

  const toggleSelect = (id: string) => {
    setConfigs((prev) => ({
      ...prev,
      [id]: { ...prev[id], selected: !prev[id].selected },
    }));
  };

  const updateConfig = (id: string, field: 'sets' | 'duration' | 'rest', value: number) => {
    if (value < 0) return;
    if (field !== 'rest' && value < 1) return;
    setConfigs((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const sessionConfig = exercises
    .filter((ex) => configs[ex.id]?.selected)
    .map((ex) => ({
      exerciseId: ex.id,
      sets: configs[ex.id].sets,
      duration: configs[ex.id].duration,
      rest: configs[ex.id].rest,
    }));

  const totalSelected = sessionConfig.length;

  // Estimate calculations
  const totalHoldTime = sessionConfig.reduce((acc, curr) => acc + curr.sets * curr.duration, 0);
  const totalRestTime = sessionConfig.reduce((acc, curr) => acc + curr.sets * curr.rest, 0);
  const estimatedCalories = Math.round((totalHoldTime / 60) * 5 + (totalRestTime / 60) * 1.5);
  const totalSessionMinutes = Math.ceil((totalHoldTime + totalRestTime) / 60);

  const handleStart = () => {
    if (sessionConfig.length > 0) {
      onStart(sessionConfig);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={onCancel}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={18} color={theme.colors.textMuted} />
          <Text style={styles.backButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Configure Session</Text>
          <Text style={styles.subtitle}>
            Select exercises and customize hold targets for this guided session.
          </Text>
        </View>

        {/* Batch Adjust Banner */}
        <View style={styles.batchBanner}>
          <View style={styles.batchBannerTextContainer}>
            <Text style={styles.batchBannerTitle}>Exercise Defaults</Text>
            <Text style={styles.batchBannerSubtitle}>
              {globalSets} sets · {globalDuration}s hold · {globalRest}s rest
            </Text>
          </View>
          <TouchableOpacity
            style={styles.batchButton}
            onPress={() => setShowGlobalModal(true)}
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={14} color={theme.colors.primaryText} />
            <Text style={styles.batchButtonText}>Set for All</Text>
          </TouchableOpacity>
        </View>

        {/* Exercise Items List */}
        <View style={styles.list}>
          {exercises.map((exercise, idx) => {
            const config = configs[exercise.id];
            const isSelected = config?.selected;

            return (
              <View
                key={exercise.id}
                style={[
                  styles.exerciseCard,
                  isSelected && styles.exerciseCardSelected,
                ]}
              >
                <TouchableOpacity
                  style={styles.cardHeader}
                  onPress={() => toggleSelect(exercise.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && <Check size={14} color={theme.colors.primaryText} />}
                  </View>

                  <Text
                    style={[
                      styles.exerciseTitle,
                      isSelected && styles.exerciseTitleSelected,
                    ]}
                  >
                    <Text style={styles.exerciseIndex}>{idx + 1}. </Text>
                    {exercise.title}
                  </Text>
                </TouchableOpacity>

                {isSelected && (
                  <View style={styles.configControls}>
                    {/* Sets Control */}
                    <View style={styles.controlItem}>
                      <Text style={styles.controlLabel}>Sets</Text>
                      <View style={styles.stepper}>
                        <TouchableOpacity
                          style={styles.stepperButton}
                          onPress={() => updateConfig(exercise.id, 'sets', config.sets - 1)}
                        >
                          <Minus size={14} color={theme.colors.textMuted} />
                        </TouchableOpacity>
                        <Text style={styles.stepperValue}>{config.sets}</Text>
                        <TouchableOpacity
                          style={styles.stepperButton}
                          onPress={() => updateConfig(exercise.id, 'sets', config.sets + 1)}
                        >
                          <Plus size={14} color={theme.colors.textMuted} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Duration Control */}
                    <View style={styles.controlItem}>
                      <Text style={styles.controlLabel}>Hold (sec)</Text>
                      <View style={styles.stepper}>
                        <TouchableOpacity
                          style={styles.stepperButton}
                          onPress={() => updateConfig(exercise.id, 'duration', config.duration - 5)}
                        >
                          <Minus size={14} color={theme.colors.textMuted} />
                        </TouchableOpacity>
                        <Text style={styles.stepperValue}>{config.duration}s</Text>
                        <TouchableOpacity
                          style={styles.stepperButton}
                          onPress={() => updateConfig(exercise.id, 'duration', config.duration + 5)}
                        >
                          <Plus size={14} color={theme.colors.textMuted} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Rest Control */}
                    <View style={styles.controlItem}>
                      <Text style={styles.controlLabel}>Rest (sec)</Text>
                      <View style={styles.stepper}>
                        <TouchableOpacity
                          style={styles.stepperButton}
                          onPress={() => updateConfig(exercise.id, 'rest', config.rest - 5)}
                        >
                          <Minus size={14} color={theme.colors.textMuted} />
                        </TouchableOpacity>
                        <Text style={styles.stepperValue}>{config.rest}s</Text>
                        <TouchableOpacity
                          style={styles.stepperButton}
                          onPress={() => updateConfig(exercise.id, 'rest', config.rest + 5)}
                        >
                          <Plus size={14} color={theme.colors.textMuted} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Card */}
      <View style={styles.footer}>
        <View style={styles.footerMetrics}>
          <Text style={styles.footerTime}>Total Time: ~{totalSessionMinutes} min</Text>
          <Text style={styles.footerCalories}>{estimatedCalories} kcal</Text>
        </View>
        <TouchableOpacity
          onPress={handleStart}
          disabled={totalSelected === 0}
          style={[styles.startButton, totalSelected === 0 && styles.startButtonDisabled]}
          activeOpacity={0.8}
        >
          <Play size={18} color={theme.colors.primaryText} fill={theme.colors.primaryText} />
          <Text style={styles.startButtonText}>
            Start {totalSelected} {totalSelected === 1 ? 'Exercise' : 'Exercises'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Session Setup Modal for All Exercises */}
      <Modal
        visible={showGlobalModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGlobalModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalIconBadge}>
                <SlidersHorizontal size={18} color={theme.colors.primaryText} />
              </View>
              <View style={styles.modalHeaderTextContainer}>
                <Text style={styles.modalTitle}>Set Session Targets</Text>
                <Text style={styles.modalSubtitle}>
                  Configure targets for all exercises before individual adjustments
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowGlobalModal(false)}
                style={styles.modalCloseButton}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.7}
              >
                <X size={18} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Quick Presets */}
            <View style={styles.presetsContainer}>
              <Text style={styles.presetsHeader}>QUICK PRESETS</Text>
              <View style={styles.presetsRow}>
                {PRESETS.map((p) => {
                  const isActive =
                    globalSets === p.sets &&
                    globalDuration === p.duration &&
                    globalRest === p.rest;
                  return (
                    <TouchableOpacity
                      key={p.label}
                      style={[styles.presetChip, isActive && styles.presetChipActive]}
                      onPress={() => {
                        setGlobalSets(p.sets);
                        setGlobalDuration(p.duration);
                        setGlobalRest(p.rest);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.presetChipText,
                          isActive && styles.presetChipTextActive,
                        ]}
                      >
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Stepper Controls */}
            <View style={styles.modalControlsList}>
              {/* Repeats (Sets) */}
              <View style={styles.modalControlRow}>
                <View style={styles.modalControlInfo}>
                  <Text style={styles.modalControlLabel}>Repeats / Sets</Text>
                  <Text style={styles.modalControlHint}>Rounds per exercise</Text>
                </View>
                <View style={styles.modalStepper}>
                  <TouchableOpacity
                    style={styles.modalStepperBtn}
                    onPress={() => setGlobalSets((s) => Math.max(1, s - 1))}
                    activeOpacity={0.7}
                  >
                    <Minus size={16} color={theme.colors.text} />
                  </TouchableOpacity>
                  <Text style={styles.modalStepperValue}>{globalSets}</Text>
                  <TouchableOpacity
                    style={styles.modalStepperBtn}
                    onPress={() => setGlobalSets((s) => Math.min(20, s + 1))}
                    activeOpacity={0.7}
                  >
                    <Plus size={16} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Hold Time */}
              <View style={styles.modalControlRow}>
                <View style={styles.modalControlInfo}>
                  <Text style={styles.modalControlLabel}>Hold Duration</Text>
                  <Text style={styles.modalControlHint}>Isometric contraction</Text>
                </View>
                <View style={styles.modalStepper}>
                  <TouchableOpacity
                    style={styles.modalStepperBtn}
                    onPress={() => setGlobalDuration((d) => Math.max(5, d - 5))}
                    activeOpacity={0.7}
                  >
                    <Minus size={16} color={theme.colors.text} />
                  </TouchableOpacity>
                  <Text style={styles.modalStepperValue}>{globalDuration}s</Text>
                  <TouchableOpacity
                    style={styles.modalStepperBtn}
                    onPress={() => setGlobalDuration((d) => Math.min(300, d + 5))}
                    activeOpacity={0.7}
                  >
                    <Plus size={16} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Rest Time */}
              <View style={styles.modalControlRow}>
                <View style={styles.modalControlInfo}>
                  <Text style={styles.modalControlLabel}>Rest Time</Text>
                  <Text style={styles.modalControlHint}>Breathing between sets</Text>
                </View>
                <View style={styles.modalStepper}>
                  <TouchableOpacity
                    style={styles.modalStepperBtn}
                    onPress={() => setGlobalRest((r) => Math.max(0, r - 5))}
                    activeOpacity={0.7}
                  >
                    <Minus size={16} color={theme.colors.text} />
                  </TouchableOpacity>
                  <Text style={styles.modalStepperValue}>{globalRest}s</Text>
                  <TouchableOpacity
                    style={styles.modalStepperBtn}
                    onPress={() => setGlobalRest((r) => Math.min(180, r + 5))}
                    activeOpacity={0.7}
                  >
                    <Plus size={16} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Summary preview */}
            <View style={styles.modalSummaryBox}>
              <Text style={styles.modalSummaryText}>
                Every exercise will start with{' '}
                <Text style={styles.modalSummaryHighlight}>
                  {globalSets} sets × {globalDuration}s ({globalRest}s rest)
                </Text>
              </Text>
            </View>

            {/* Modal Actions */}
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalApplyButton}
                onPress={applyGlobalTargets}
                activeOpacity={0.8}
              >
                <Check size={18} color={theme.colors.primaryText} />
                <Text style={styles.modalApplyButtonText}>Apply to All Exercises</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSkipButton}
                onPress={() => setShowGlobalModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalSkipButtonText}>Keep Current & Customize Individually</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: 120,
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
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  list: {
    gap: 12,
  },
  exerciseCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    overflow: 'hidden',
  },
  exerciseCardSelected: {
    borderColor: theme.colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.cardBorderHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  exerciseTitleSelected: {
    color: theme.colors.text,
  },
  exerciseIndex: {
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.textSubtle,
  },
  configControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.cardLight,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    gap: 8,
  },
  controlItem: {
    flex: 1,
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginBottom: 6,
    fontWeight: '500',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  stepperButton: {
    padding: 6,
  },
  stepperValue: {
    minWidth: 32,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    paddingBottom: 24,
  },
  footerMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    paddingHorizontal: 4,
  },
  footerTime: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  footerCalories: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 14,
    gap: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonDisabled: {
    opacity: 0.4,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primaryText,
  },
  batchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: theme.spacing.md,
  },
  batchBannerTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  batchBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  batchBannerSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  batchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  batchButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primaryText,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: theme.spacing.md,
  },
  modalIconBadge: {
    width: 38,
    height: 38,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderTextContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  modalSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 3,
    lineHeight: 16,
  },
  modalCloseButton: {
    padding: 4,
  },
  presetsContainer: {
    marginBottom: theme.spacing.md,
  },
  presetsHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSubtle,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetChip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.cardLight,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetChipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryBg,
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  presetChipTextActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  modalControlsList: {
    gap: 10,
    marginBottom: theme.spacing.md,
  },
  modalControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.cardLight,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  modalControlInfo: {
    flex: 1,
  },
  modalControlLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  modalControlHint: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  modalStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  modalStepperBtn: {
    padding: 6,
  },
  modalStepperValue: {
    minWidth: 44,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  modalSummaryBox: {
    backgroundColor: 'rgba(234, 179, 8, 0.08)',
    borderRadius: theme.borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.2)',
  },
  modalSummaryText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalSummaryHighlight: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  modalButtonsContainer: {
    gap: 8,
  },
  modalApplyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 13,
    gap: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  modalApplyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primaryText,
  },
  modalSkipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  modalSkipButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
});
