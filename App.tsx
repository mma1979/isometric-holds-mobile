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
import { PlayCircle, Play } from 'lucide-react-native';
import { exercises } from './src/data';
import ExerciseDetail from './src/components/ExerciseDetail';
import DailyAchievement from './src/components/DailyAchievement';
import SessionConfigurator from './src/components/SessionConfigurator';
import ActiveSession from './src/components/ActiveSession';
import ExerciseGraphic from './src/components/ExerciseGraphic';
import { SessionConfigItem } from './src/types';
import { theme } from './src/theme';

export default function App() {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
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
                <Text style={styles.heroTitle}>6 Shaolin Isometric Holds</Text>
                <Text style={styles.heroSubtitle}>
                  No weights. No movement. Just pure strength. Track your progression through
                  the ancient isometric techniques.
                </Text>

                <TouchableOpacity
                  onPress={() => setIsConfiguringSession(true)}
                  style={styles.guidedButton}
                  activeOpacity={0.8}
                >
                  <Play size={20} color={theme.colors.primaryText} fill={theme.colors.primaryText} />
                  <Text style={styles.guidedButtonText}>Start Guided Session</Text>
                </TouchableOpacity>
              </View>

              {/* Daily Achievement Stats */}
              <DailyAchievement />

              {/* Exercises List / Grid */}
              <View style={styles.exercisesGrid}>
                {exercises.map((exercise, idx) => (
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
                          <Text style={styles.cardExerciseTitle}>{exercise.title}</Text>
                        </View>

                        <View style={styles.playIconWrapper}>
                          <PlayCircle size={22} color={theme.colors.text} />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
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
  guidedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
    maxWidth: 320,
  },
  guidedButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primaryText,
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
