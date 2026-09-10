import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
  BackHandler,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  PlayCircle,
  Play,
  Timer,
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { exercises, practiceSets, getExercisesForSet } from './src/data';
import ExerciseDetail from './src/components/ExerciseDetail';
import AboutScreen from './src/components/AboutScreen';
import DailyAchievement from './src/components/DailyAchievement';
import SessionConfigurator from './src/components/SessionConfigurator';
import ActiveSession from './src/components/ActiveSession';
import PracticeMode from './src/components/PracticeMode';
import ExerciseGraphic from './src/components/ExerciseGraphic';
import CustomPracticeModal from './src/components/CustomPracticeModal';
import { SessionConfigItem, PracticeSet } from './src/types';
import { useCustomPractices } from './src/store';
import { theme } from './src/theme';

export default function App() {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [activePracticeSetId, setActivePracticeSetId] = useState<string | null>(null);
  const [isConfiguringSession, setIsConfiguringSession] = useState(false);
  const [activeSessionConfig, setActiveSessionConfig] = useState<SessionConfigItem[] | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [editingPractice, setEditingPractice] = useState<PracticeSet | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    if (practiceSets.length > 0) {
      return { [practiceSets[0].id]: true };
    }
    return {};
  });

  const toggleGroup = (groupId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const {
    customPractices,
    addCustomPractice,
    updateCustomPractice,
    deleteCustomPractice,
  } = useCustomPractices();

  const selectedExercise = selectedExerciseId
    ? exercises.find((e) => e.id === selectedExerciseId)
    : null;

  useEffect(() => {
    const handleBackPress = () => {
      if (showCustomModal) {
        setShowCustomModal(false);
        setEditingPractice(null);
        return true;
      }
      if (showAbout) {
        setShowAbout(false);
        return true;
      }
      if (activeSessionConfig) {
        setActiveSessionConfig(null);
        return true;
      }
      if (isConfiguringSession) {
        setIsConfiguringSession(false);
        return true;
      }
      if (activePracticeSetId) {
        setActivePracticeSetId(null);
        return true;
      }
      if (selectedExerciseId) {
        setSelectedExerciseId(null);
        return true;
      }
      return false;
    };

    const backHandlerSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => backHandlerSubscription.remove();
  }, [
    showCustomModal,
    showAbout,
    activeSessionConfig,
    isConfiguringSession,
    activePracticeSetId,
    selectedExerciseId,
  ]);

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
              setShowAbout(false);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>IH</Text>
            </View>
            <Text style={styles.brandTitle}>Isometric Holds</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.aboutHeaderBtn, showAbout && styles.aboutHeaderBtnActive]}
            onPress={() => {
              if (showAbout) {
                setShowAbout(false);
              } else {
                setSelectedExerciseId(null);
                setActivePracticeSetId(null);
                setIsConfiguringSession(false);
                setActiveSessionConfig(null);
                setShowAbout(true);
              }
            }}
            activeOpacity={0.7}
          >
            <Info size={16} color={showAbout ? theme.colors.primary : theme.colors.textMuted} />
            <Text style={[styles.aboutHeaderBtnText, showAbout && styles.aboutHeaderBtnTextActive]}>
              About
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Content Router */}
        <View style={styles.content}>
          {showAbout ? (
            <AboutScreen onBack={() => setShowAbout(false)} />
          ) : activeSessionConfig ? (
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
                <Text style={styles.heroTitle}>Isometric Holds & Protocols</Text>
                <Text style={styles.heroSubtitle}>
                  No weights. No movement. Just pure strength and alignment. Track your
                  progression across {practiceSets.length} specialized isometric protocols.
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

                  <TouchableOpacity
                    onPress={() => {
                      setEditingPractice(null);
                      setShowCustomModal(true);
                    }}
                    style={styles.customHeroButton}
                    activeOpacity={0.8}
                  >
                    <Sparkles size={18} color={theme.colors.primary} />
                    <Text style={styles.customHeroButtonText}>Create Custom Practice</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Daily Achievement Stats */}
              <DailyAchievement />

              {/* My Custom Practices Section */}
              <View style={styles.customSection}>
                <View style={styles.setSectionHeader}>
                  <View style={styles.setInfo}>
                    <View style={styles.setTitleRow}>
                      <Text style={styles.setSectionTitle}>My Custom Practices</Text>
                      {customPractices.length > 0 && (
                        <View style={styles.customCountBadge}>
                          <Text style={styles.customCountBadgeText}>
                            {customPractices.length} {customPractices.length === 1 ? 'Routine' : 'Routines'}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.setSectionSubtitle}>
                      Personalized isometric workouts created with your selected holds
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      setEditingPractice(null);
                      setShowCustomModal(true);
                    }}
                    style={styles.createCustomPill}
                    activeOpacity={0.8}
                  >
                    <Plus size={14} color={theme.colors.primary} />
                    <Text style={styles.createCustomPillText}>New Routine</Text>
                  </TouchableOpacity>
                </View>

                {customPractices.length === 0 ? (
                  <View style={styles.emptyCustomCard}>
                    <View style={styles.emptyCustomIcon}>
                      <Sparkles size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.emptyCustomTitle}>Build Your Own Routine</Text>
                    <Text style={styles.emptyCustomSubtitle}>
                      Select any combination of holds across Shaolin, Core, and Samurai protocols to form a personalized practice session.
                    </Text>
                    <TouchableOpacity
                      style={styles.emptyCustomBtn}
                      onPress={() => {
                        setEditingPractice(null);
                        setShowCustomModal(true);
                      }}
                      activeOpacity={0.8}
                    >
                      <Plus size={16} color={theme.colors.primaryText} />
                      <Text style={styles.emptyCustomBtnText}>Create Custom Practice</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.customCardsList}>
                    {customPractices.map((cSet) => {
                      const setExercises = getExercisesForSet(cSet.id, customPractices);
                      return (
                        <View key={cSet.id} style={styles.customCard}>
                          <View style={styles.customCardHeader}>
                            <View style={styles.customCardInfo}>
                              <View style={styles.customCardTitleRow}>
                                <Text style={styles.customCardTitle}>{cSet.title}</Text>
                                <View style={styles.customBadge}>
                                  <Sparkles size={10} color={theme.colors.primary} />
                                  <Text style={styles.customBadgeText}>Custom</Text>
                                </View>
                              </View>
                              <Text style={styles.customCardDescription} numberOfLines={2}>
                                {cSet.description || `${setExercises.length} targeted holds`}
                              </Text>
                            </View>

                            <View style={styles.customCardActions}>
                              <TouchableOpacity
                                onPress={() => {
                                  setEditingPractice(cSet);
                                  setShowCustomModal(true);
                                }}
                                style={styles.customActionIconBtn}
                                activeOpacity={0.7}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                              >
                                <Edit3 size={16} color={theme.colors.textMuted} />
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  Alert.alert(
                                    'Delete Routine',
                                    `Are you sure you want to delete "${cSet.title}"?`,
                                    [
                                      { text: 'Cancel', style: 'cancel' },
                                      {
                                        text: 'Delete',
                                        style: 'destructive',
                                        onPress: () => deleteCustomPractice(cSet.id),
                                      },
                                    ]
                                  );
                                }}
                                style={styles.customActionIconBtn}
                                activeOpacity={0.7}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                              >
                                <Trash2 size={16} color={theme.colors.error} />
                              </TouchableOpacity>
                            </View>
                          </View>

                          {/* Exercise preview thumbnails */}
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.customThumbnailsScroll}
                          >
                            {setExercises.map((ex, idx) => (
                              <TouchableOpacity
                                key={ex.id}
                                onPress={() => setSelectedExerciseId(ex.id)}
                                style={styles.customThumbItem}
                                activeOpacity={0.8}
                              >
                                <View style={styles.customThumbGraphicWrapper}>
                                  <ExerciseGraphic exerciseId={ex.id} style={styles.customThumbGraphic} />
                                  <View style={styles.thumbIndexBadge}>
                                    <Text style={styles.thumbIndexText}>{idx + 1}</Text>
                                  </View>
                                </View>
                                <Text style={styles.customThumbTitle} numberOfLines={1}>
                                  {ex.title}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>

                          {/* Footer with Practice Button */}
                          <View style={styles.customCardFooter}>
                            <View style={styles.customCardHoldsCount}>
                              <Text style={styles.customCardHoldsCountText}>
                                {setExercises.length} {setExercises.length === 1 ? 'Hold' : 'Holds'}
                              </Text>
                            </View>

                            <TouchableOpacity
                              onPress={() => setActivePracticeSetId(cSet.id)}
                              style={styles.customPracticeBtn}
                              activeOpacity={0.85}
                            >
                              <Timer size={15} color={theme.colors.primaryText} />
                              <Text style={styles.customPracticeBtnText}>Start Practice</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>

              {/* Grouped Practice Sets */}
              <View style={styles.practiceSetsContainer}>
                {practiceSets.map((pSet) => {
                  const setExercises = exercises.filter((ex) =>
                    pSet.exerciseIds.includes(ex.id)
                  );
                  const isExpanded = !!expandedGroups[pSet.id];

                  return (
                    <View key={pSet.id} style={styles.setSection}>
                      {/* Set Header */}
                      <View style={styles.setSectionHeader}>
                        <TouchableOpacity
                          style={styles.setInfoTouchable}
                          onPress={() => toggleGroup(pSet.id)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.setInfo}>
                            <View style={styles.setTitleRow}>
                              <Text style={styles.setSectionTitle}>{pSet.title}</Text>
                              <View style={styles.setHoldBadge}>
                                <Text style={styles.setHoldBadgeText}>
                                  {setExercises.length} Holds
                                </Text>
                              </View>
                            </View>
                            <Text
                              style={styles.setSectionSubtitle}
                              numberOfLines={isExpanded ? undefined : 1}
                            >
                              {pSet.subtitle || pSet.description}
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <View style={styles.setHeaderRight}>
                          <TouchableOpacity
                            onPress={() => setActivePracticeSetId(pSet.id)}
                            style={styles.setPracticePill}
                            activeOpacity={0.7}
                          >
                            <Timer size={14} color={theme.colors.primary} />
                            <Text style={styles.setPracticePillText}>Practice</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => toggleGroup(pSet.id)}
                            style={styles.collapseChevronBtn}
                            activeOpacity={0.7}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            {isExpanded ? (
                              <ChevronUp size={18} color={theme.colors.textMuted} />
                            ) : (
                              <ChevronDown size={18} color={theme.colors.textMuted} />
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Exercises Grid for this Set */}
                      {isExpanded && (
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
                      )}
                    </View>
                  );
                })}
              </View>

              {/* About Banner Card */}
              <TouchableOpacity
                style={styles.aboutBannerCard}
                onPress={() => setShowAbout(true)}
                activeOpacity={0.8}
              >
                <View style={styles.aboutBannerTop}>
                  <View style={styles.aboutBannerIcon}>
                    <Info size={22} color={theme.colors.primary} />
                  </View>
                  <View style={styles.aboutBannerText}>
                    <Text style={styles.aboutBannerTitle}>About Isometric Holds</Text>
                    <Text style={styles.aboutBannerSubtitle}>
                      Learn the science, benefits & explore all {practiceSets.length} training protocols
                    </Text>
                  </View>
                </View>
                <View style={styles.aboutBannerPill}>
                  <Text style={styles.aboutBannerPillText}>Explore Protocols & Science →</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>

        {/* Custom Practice Routine Modal */}
        <CustomPracticeModal
          visible={showCustomModal}
          onClose={() => {
            setShowCustomModal(false);
            setEditingPractice(null);
          }}
          onSave={(data, existingId) => {
            if (existingId) {
              updateCustomPractice(existingId, data);
            } else {
              addCustomPractice(data);
            }
          }}
          onDelete={(id) => {
            deleteCustomPractice(id);
          }}
          editingPractice={editingPractice}
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
  aboutHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.cardLight,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
  },
  aboutHeaderBtnActive: {
    backgroundColor: theme.colors.primaryBg,
    borderColor: theme.colors.primary,
  },
  aboutHeaderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  aboutHeaderBtnTextActive: {
    color: theme.colors.primary,
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
  setInfoTouchable: {
    flex: 1,
    paddingRight: 8,
  },
  setHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  collapseChevronBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.cardLight,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
    alignItems: 'center',
    justifyContent: 'center',
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
  customHeroButton: {
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
  customHeroButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  customSection: {
    gap: 14,
    marginTop: 10,
    marginBottom: 4,
  },
  customCountBadge: {
    backgroundColor: theme.colors.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  customCountBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  createCustomPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primaryBg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.borderRadius.full,
  },
  createCustomPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  emptyCustomCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
    borderStyle: 'dashed',
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyCustomIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyCustomTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text,
  },
  emptyCustomSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 320,
    marginBottom: 6,
  },
  emptyCustomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 6,
  },
  emptyCustomBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.primaryText,
  },
  customCardsList: {
    gap: 14,
  },
  customCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    gap: 12,
  },
  customCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  customCardInfo: {
    flex: 1,
    gap: 4,
    paddingRight: 8,
  },
  customCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.text,
  },
  customBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primaryBg,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  customBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  customCardDescription: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 16,
  },
  customCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  customActionIconBtn: {
    padding: 8,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.cardLight,
  },
  customThumbnailsScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  customThumbItem: {
    width: 80,
    alignItems: 'center',
    gap: 4,
  },
  customThumbGraphicWrapper: {
    width: 80,
    height: 54,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: theme.colors.cardLight,
    position: 'relative',
  },
  customThumbGraphic: {
    width: '100%',
    height: '100%',
  },
  thumbIndexBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbIndexText: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.primaryText,
  },
  customThumbTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  customCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  customCardHoldsCount: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.cardLight,
  },
  customCardHoldsCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  customPracticeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
  },
  customPracticeBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.primaryText,
  },
  aboutBannerCard: {
    marginTop: 28,
    marginBottom: 10,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    gap: 14,
  },
  aboutBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aboutBannerIcon: {
    width: 42,
    height: 42,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutBannerText: {
    flex: 1,
    gap: 3,
  },
  aboutBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text,
  },
  aboutBannerSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 18,
  },
  aboutBannerPill: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.cardLight,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
  },
  aboutBannerPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
});
