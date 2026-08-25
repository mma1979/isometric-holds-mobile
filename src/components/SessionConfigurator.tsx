import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { ArrowLeft, Check, Play, Plus, Minus } from 'lucide-react-native';
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

export default function SessionConfigurator({ onStart, onCancel }: SessionConfiguratorProps) {
  const [configs, setConfigs] = useState<Record<string, LocalConfig>>(() => {
    const initial: Record<string, LocalConfig> = {};
    exercises.forEach((ex) => {
      initial[ex.id] = { selected: true, sets: 3, duration: 30, rest: 10 };
    });
    return initial;
  });

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
});
