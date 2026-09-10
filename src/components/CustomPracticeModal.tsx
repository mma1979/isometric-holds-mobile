import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  X,
  Check,
  Search,
  Sparkles,
  Layers,
  Dumbbell,
  CheckCircle2,
  Trash2,
} from 'lucide-react-native';
import { exercises, practiceSets } from '../data';
import { Exercise, PracticeSet } from '../types';
import ExerciseGraphic from './ExerciseGraphic';
import { theme } from '../theme';

interface CustomPracticeModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (
    practice: {
      title: string;
      subtitle?: string;
      description: string;
      exerciseIds: string[];
    },
    existingId?: string
  ) => void;
  onDelete?: (id: string) => void;
  editingPractice?: PracticeSet | null;
}

export default function CustomPracticeModal({
  visible,
  onClose,
  onSave,
  onDelete,
  editingPractice,
}: CustomPracticeModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Reset or populate form when modal opens or editingPractice changes
  useEffect(() => {
    if (visible) {
      if (editingPractice) {
        setTitle(editingPractice.title);
        setDescription(editingPractice.description || editingPractice.subtitle || '');
        setSelectedIds(editingPractice.exerciseIds || []);
      } else {
        setTitle('');
        setDescription('');
        setSelectedIds([]);
      }
      setSearchQuery('');
      setSelectedCategory('all');
    }
  }, [visible, editingPractice]);

  // Categories list
  const categories = useMemo(() => {
    return [
      { id: 'all', label: 'All Holds' },
      ...practiceSets.map((pSet) => ({
        id: pSet.id,
        label: pSet.title.replace(' Holds', '').replace(' Drills', ''),
      })),
    ];
  }, []);

  // Filtered exercises
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      // Category match
      if (selectedCategory !== 'all') {
        const pSet = practiceSets.find((s) => s.id === selectedCategory);
        if (!pSet || !pSet.exerciseIds.includes(ex.id)) {
          return false;
        }
      }
      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ex.title.toLowerCase().includes(q);
        const matchSubtitle = ex.subtitle ? ex.subtitle.toLowerCase().includes(q) : false;
        return matchTitle || matchSubtitle;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const toggleExercise = (exerciseId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(exerciseId)) {
        return prev.filter((id) => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };

  const handleSelectAllVisible = () => {
    const visibleIds = filteredExercises.map((e) => e.id);
    const allAlreadySelected = visibleIds.every((id) => selectedIds.includes(id));

    if (allAlreadySelected) {
      // Unselect only these visible ones
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      // Add any not already selected
      const toAdd = visibleIds.filter((id) => !selectedIds.includes(id));
      setSelectedIds((prev) => [...prev, ...toAdd]);
    }
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert('Routine Name Required', 'Please enter a name for your custom practice routine.');
      return;
    }
    if (selectedIds.length === 0) {
      Alert.alert('Exercises Required', 'Please select at least 1 exercise hold for your routine.');
      return;
    }

    onSave(
      {
        title: trimmedTitle,
        subtitle: `${selectedIds.length} Custom Holds`,
        description:
          description.trim() ||
          `Custom isometric routine consisting of ${selectedIds.length} targeted holds.`,
        exerciseIds: selectedIds,
      },
      editingPractice ? editingPractice.id : undefined
    );
    onClose();
  };

  const handleDelete = () => {
    if (!editingPractice || !onDelete) return;
    Alert.alert(
      'Delete Routine',
      `Are you sure you want to delete "${editingPractice.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(editingPractice.id);
            onClose();
          },
        },
      ]
    );
  };

  const isValid = title.trim().length > 0 && selectedIds.length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBadge}>
              <Sparkles size={18} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={styles.headerTitle}>
                {editingPractice ? 'Edit Practice Routine' : 'Create Custom Practice'}
              </Text>
              <Text style={styles.headerSubtitle}>
                Select your favorite isometric holds into a tailored workout
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            activeOpacity={0.7}
          >
            <X size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Routine Info Form */}
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Routine Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Morning Core & Tendon Alignment"
                placeholderTextColor={theme.colors.textSubtle}
                value={title}
                onChangeText={setTitle}
                maxLength={45}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Focus / Description (Optional)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="e.g. 5-minute morning routine to awaken deep stabilizers"
                placeholderTextColor={theme.colors.textSubtle}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={2}
                maxLength={120}
              />
            </View>
          </View>

          {/* Exercise Selection Section */}
          <View style={styles.selectionSection}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleRow}>
                <Layers size={18} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Select Exercises</Text>
                <View
                  style={[
                    styles.countBadge,
                    selectedIds.length > 0 && styles.countBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.countBadgeText,
                      selectedIds.length > 0 && styles.countBadgeTextActive,
                    ]}
                  >
                    {selectedIds.length} Selected
                  </Text>
                </View>
              </View>

              <View style={styles.quickActionRow}>
                <TouchableOpacity
                  onPress={handleSelectAllVisible}
                  style={styles.quickActionBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickActionText}>
                    {filteredExercises.every((e) => selectedIds.includes(e.id))
                      ? 'Deselect Tab'
                      : 'Select Tab'}
                  </Text>
                </TouchableOpacity>

                {selectedIds.length > 0 && (
                  <TouchableOpacity
                    onPress={handleClearAll}
                    style={styles.quickActionBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.quickActionText, styles.quickActionDanger]}>
                      Clear
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBar}>
              <Search size={16} color={theme.colors.textSubtle} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search holds by name..."
                placeholderTextColor={theme.colors.textSubtle}
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
                  <X size={16} color={theme.colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Categories Horizontal Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            >
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    style={[
                      styles.categoryChip,
                      isActive && styles.categoryChipActive,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        isActive && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Exercises List */}
            <View style={styles.exercisesList}>
              {filteredExercises.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No holds found matching your search.</Text>
                </View>
              ) : (
                filteredExercises.map((exercise) => {
                  const isSelected = selectedIds.includes(exercise.id);
                  const selectedIndex = selectedIds.indexOf(exercise.id);

                  return (
                    <TouchableOpacity
                      key={exercise.id}
                      onPress={() => toggleExercise(exercise.id)}
                      style={[
                        styles.exerciseItem,
                        isSelected && styles.exerciseItemSelected,
                      ]}
                      activeOpacity={0.8}
                    >
                      {/* Thumbnail */}
                      <View style={styles.exerciseGraphicWrapper}>
                        <ExerciseGraphic
                          exerciseId={exercise.id}
                          style={styles.exerciseGraphic}
                        />
                      </View>

                      {/* Info */}
                      <View style={styles.exerciseInfo}>
                        <Text
                          style={[
                            styles.exerciseTitle,
                            isSelected && styles.exerciseTitleSelected,
                          ]}
                          numberOfLines={1}
                        >
                          {exercise.title}
                        </Text>
                        <Text
                          style={styles.exerciseSubtitle}
                          numberOfLines={1}
                        >
                          {exercise.subtitle || exercise.progression.week1}
                        </Text>
                      </View>

                      {/* Checkbox / Order Indicator */}
                      <View
                        style={[
                          styles.checkbox,
                          isSelected && styles.checkboxSelected,
                        ]}
                      >
                        {isSelected ? (
                          <Text style={styles.orderNumberText}>{selectedIndex + 1}</Text>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </View>
        </ScrollView>

        {/* Sticky Bottom Actions */}
        <View style={styles.footer}>
          <View style={styles.footerInfoRow}>
            <Text style={styles.footerCountText}>
              <Text style={styles.footerCountHighlight}>{selectedIds.length}</Text>{' '}
              {selectedIds.length === 1 ? 'hold' : 'holds'} selected
            </Text>
            {editingPractice && onDelete && (
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.deleteBtn}
                activeOpacity={0.7}
              >
                <Trash2 size={16} color={theme.colors.error} />
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footerActions}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.cancelBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              disabled={!isValid}
              style={[styles.saveBtn, !isValid && styles.saveBtnDisabled]}
              activeOpacity={0.85}
            >
              <CheckCircle2
                size={18}
                color={isValid ? theme.colors.primaryText : theme.colors.textSubtle}
              />
              <Text
                style={[
                  styles.saveBtnText,
                  !isValid && styles.saveBtnTextDisabled,
                ]}
              >
                {editingPractice ? 'Update Routine' : 'Save Custom Routine'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
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
    paddingTop: Platform.OS === 'ios' ? 48 : 20,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    gap: 16,
    paddingBottom: 24,
  },
  formCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  textInput: {
    backgroundColor: theme.colors.cardLight,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.text,
  },
  textArea: {
    minHeight: 56,
    textAlignVertical: 'top',
  },
  selectionSection: {
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.text,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.cardLight,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
  },
  countBadgeActive: {
    backgroundColor: theme.colors.primaryBg,
    borderColor: theme.colors.primary,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  countBadgeTextActive: {
    color: theme.colors.primary,
  },
  quickActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickActionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  quickActionDanger: {
    color: theme.colors.error,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.text,
    padding: 0,
  },
  categoriesScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primaryBg,
    borderColor: theme.colors.primary,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  categoryChipTextActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  exercisesList: {
    gap: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: 10,
    gap: 12,
  },
  exerciseItemSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(234, 179, 8, 0.04)',
  },
  exerciseGraphicWrapper: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: theme.colors.cardLight,
  },
  exerciseGraphic: {
    width: '100%',
    height: '100%',
  },
  exerciseInfo: {
    flex: 1,
    gap: 3,
  },
  exerciseTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  exerciseTitleSelected: {
    color: theme.colors.text,
  },
  exerciseSubtitle: {
    fontSize: 11,
    color: theme.colors.textSubtle,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: theme.colors.cardBorderHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cardLight,
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  orderNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.primaryText,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
  },
  emptyText: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  footer: {
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    gap: 10,
  },
  footerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerCountText: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  footerCountHighlight: {
    fontWeight: '800',
    color: theme.colors.text,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.error,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
    gap: 8,
  },
  saveBtnDisabled: {
    backgroundColor: theme.colors.cardLight,
    opacity: 0.5,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primaryText,
  },
  saveBtnTextDisabled: {
    color: theme.colors.textSubtle,
  },
});
