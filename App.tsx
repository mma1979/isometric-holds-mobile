import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { PlayCircle, Play, Timer, Sparkles } from 'lucide-react-native';
import { exercises, practiceSets } from './src/data';
import ExerciseDetail from './src/components/ExerciseDetail';
import DailyAchievement from './src/components/DailyAchievement';
import SessionConfigurator from './src/components/SessionConfigurator';
import ActiveSession from './src/components/ActiveSession';
import PracticeMode from './src/components/PracticeMode';
import ExerciseGraphic from './src/components/ExerciseGraphic';
import { SessionConfigItem } from './src/types';
import { theme } from './src/theme';

export default function App() {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [activePracticeSetId, setActivePracticeSetId] = useState<string | null>(null);
  const [isConfiguringSession, setIsConfiguringSession] = useState(false);
  const [activeSessionConfig, setActiveSessionConfig] = useState<SessionConfigItem[] | null>(null);

  const selectedExercise = selectedExerciseId
    ? exercises.find((e) => e.id === selectedExerciseId)
    : null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="light" backgroundColor={theme.colors.background} />

        {/* Top App Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.brand}
            onPress={() => {
              setSelectedExerciseId(null);
              setActivePracticeSetId(null);
              setIsConfiguringSession(false);
              setActiveSessionConfig(null);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>SH</Text>
            </View>
            <Text style={styles.brandTitle}>Shaolin Isometric Holds</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content Router */}
        <View style={styles.content}>
          {activeSessionConfig ? (
            <ActiveSession
              config={activeSessionConfig}
              onComplete={() => setActiveSessionConfig(null)}
              onCancel={() => setActiveSessionConfig(null)}
            />
          ) : isConfiguringSession ? (
            <SessionConfigurator
              onStart={(cfg) => {
                setActiveSessionConfig(cfg);
                setIsConfiguringSession(false);
              }}
              onCancel={() => setIsConfiguringSession(false)}
            />
          ) : activePracticeSetId ? (
            <PracticeMode
              practiceSetId={activePracticeSetId}
              onBack={() => setActivePracticeSetId(null)}
              onOpenExerciseDetail={(exId) => {
                setActivePracticeSetId(null);
                setSelectedExerciseId(exId);
              }}
            />
          ) : selectedExercise ? (
            <ExerciseDetail
              exercise={selectedExercise}
              onBack={() => setSelectedExerciseId(null)}
            />
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Hero Banner */}
              <View style={styles.hero}>
                <Text style={styles.heroTitle}>Shaolin Isometric Holds</Text>
                <Text style={styles.heroSubtitle}>
                  No weights. No movement. Just pure strength. Track your progression through
                  ancient isometric hold techniques.
                </Text>

                <View style={styles.heroActionsRow}>
                  <TouchableOpacity
                    onPress={() => setIsConfiguringSession(true)}
                    style={styles.guidedButton}
                    activeOpacity={0.8}
                  >
                    <Play size={18} color={theme.colors.primaryText} fill={theme.colors.primaryText} />
                    <Text style={styles.guidedButtonText}>Start Guided Session</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setActivePracticeSetId('shaolin-holds')}
                    style={styles.practiceModeButton}
                    activeOpacity={0.8}
                  >
                    <Timer size={18} color={theme.colors.primary} />
                    <Text style={styles.practiceModeButtonText}>Practice Mode</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Daily Achievement Stats */}
              <DailyAchievement />

              {/* Grouped Practice Sets */}
              <View style={styles.practiceSetsContainer}>
                {practiceSets.map((pSet) => {
                  const setExercises = exercises.filter((ex) =>
                    pSet.exerciseIds.includes(ex.id)
                  );

                  return (
                    <View key={pSet.id} style={styles.setSection}>
                      {/* Set Header */}
                      <View style={styles.setSectionHeader}>
                        <View style={styles.setInfo}>
                          <View style={styles.setTitleRow}>
                            <Text style={styles.setSectionTitle}>{pSet.title}</Text>
                            <View style={styles.setHoldBadge}>
                              <Text style={styles.setHoldBadgeText}>
                                {setExercises.length} Holds
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.setSectionSubtitle}>
                            {pSet.subtitle || pSet.description}
                          </Text>
                        </View>

                        <TouchableOpacity
                          onPress={() => setActivePracticeSetId(pSet.id)}
                          style={styles.setPracticePill}
                          activeOpacity={0.7}
                        >
                          <Timer size={14} color={theme.colors.primary} />
                          <Text style={styles.setPracticePillText}>Practice</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Exercises Grid for this Set */}
                      <View style={styles.exercisesGrid}>
                        {setExercises.map((exercise, idx) => (
                          <TouchableOpacity
                            key={exercise.id}
                            onPress={() => setSelectedExerciseId(exercise.id)}
                            style={styles.exerciseCard}
                            activeOpacity={0.85}
                          >
                            <View style={styles.imageContainer}>
                              <ExerciseGraphic
                                exerciseId={exercise.id}
                                style={styles.cardGraphic}
                              />
                              <View style={styles.imageOverlay} />

                              <View style={styles.cardBottomRow}>
                                <View style={styles.titleInfo}>
                                  <View style={styles.numberBadge}>
                                    <Text style={styles.numberText}>{idx + 1}</Text>
                                  </View>
                                  <Text style={styles.cardExerciseTitle}>
                                    {exercise.title}
                                  </Text>
                                </View>

                                <View style={styles.playIconWrapper}>
                                  <PlayCircle size={22} color={theme.colors.text} />
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primaryText,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xs,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 340,
    marginBottom: theme.spacing.lg,
  },
  heroActionsRow: {
    width: '100%',
    maxWidth: 340,
    gap: 10,
    alignItems: 'stretch',
  },
  guidedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
  },
  guidedButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primaryText,
  },
  practiceModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cardLight,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: 13,
    paddingHorizontal: 20,
    gap: 8,
    width: '100%',
  },
  practiceModeButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.text,
  },
  practiceSetsContainer: {
    gap: 28,
    marginTop: 8,
  },
  setSection: {
    gap: 14,
  },
  setSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  setInfo: {
    flex: 1,
    gap: 3,
    paddingRight: 10,
  },
  setTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  setSectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  setHoldBadge: {
    backgroundColor: theme.colors.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  setHoldBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  setSectionSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  setPracticePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.cardLight,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.borderRadius.full,
  },
  setPracticePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
  },
  exercisesGrid: {
    gap: 16,
  },
  exerciseCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 180,
    position: 'relative',
  },
  cardGraphic: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 7, 18, 0.45)',
  },
  cardBottomRow: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  titleInfo: {
    flex: 1,
    gap: 4,
  },
  numberBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.primaryText,
  },
  cardExerciseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  playIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
