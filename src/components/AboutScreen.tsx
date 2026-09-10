import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import {
  ArrowLeft,
  Activity,
  ShieldCheck,
  Timer,
  Sparkles,
  Flame,
  Award,
  Zap,
  Play,
  Heart,
  BookOpen,
  Layers,
  CheckCircle2,
  Lock,
  Mail,
  User,
  ExternalLink,
  Linkedin,
} from 'lucide-react-native';
import { theme } from '../theme';
import { practiceSets } from '../data';

interface AboutScreenProps {
  onBack: () => void;
}

export default function AboutScreen({ onBack }: AboutScreenProps) {
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

      {/* Hero Branding */}
      <View style={styles.heroCard}>
        <View style={styles.badgeRow}>
          <View style={styles.heroLogoBadge}>
            <Text style={styles.heroLogoText}>IH</Text>
          </View>
          <View style={styles.versionPill}>
            <Text style={styles.versionText}>v2.0.1 • Production</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Isometric Holds</Text>
        <Text style={styles.heroTagline}>
          Master static muscular tension, tendon resilience, and mental stillness with zero equipment.
        </Text>
      </View>

      {/* Science & What are Isometrics */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Activity size={20} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>The Science of Isometrics</Text>
        </View>
        <Text style={styles.bodyText}>
          Isometric holds involve contracting muscles at a fixed joint angle without movement.
          By eliminating the eccentric (lengthening) and concentric (shortening) phases, you can
          recruit deep stabilizing motor units while putting virtually zero wear and tear on your joints.
        </Text>

        <View style={styles.pillarsGrid}>
          <View style={styles.pillarCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(234, 179, 8, 0.15)' }]}>
              <Zap size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.pillarTitle}>Max Motor Recruitment</Text>
            <Text style={styles.pillarDesc}>
              Recruits up to 5% more motor units than dynamic lifting, activating dormant muscle fibers.
            </Text>
          </View>

          <View style={styles.pillarCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
              <ShieldCheck size={20} color={theme.colors.success} />
            </View>
            <Text style={styles.pillarTitle}>Tendon & Joint Armor</Text>
            <Text style={styles.pillarDesc}>
              Stimulates collagen synthesis and tendon stiffness without damaging impact or friction.
            </Text>
          </View>

          <View style={styles.pillarCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Heart size={20} color={theme.colors.info} />
            </View>
            <Text style={styles.pillarTitle}>Vascular & Heart Health</Text>
            <Text style={styles.pillarDesc}>
              Clinical trials show static holds trigger blood vessel dilation and help reduce resting blood pressure.
            </Text>
          </View>

          <View style={styles.pillarCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(249, 115, 22, 0.15)' }]}>
              <Flame size={20} color={theme.colors.warning} />
            </View>
            <Text style={styles.pillarTitle}>Mental Fortitude</Text>
            <Text style={styles.pillarDesc}>
              Trains parasympathetic breathing and unwavering composure under intense physical burn.
            </Text>
          </View>
        </View>
      </View>

      {/* Protocols Breakdown */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Layers size={20} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Training Protocols</Text>
        </View>
        <Text style={styles.bodyText}>
          The app includes {practiceSets.length} pre-configured isometric protocols, spanning ancient
          martial traditions to modern physical therapy:
        </Text>

        <View style={styles.protocolList}>
          {practiceSets.map((pSet, idx) => (
            <View key={pSet.id} style={styles.protocolCard}>
              <View style={styles.protocolHeader}>
                <View style={styles.protocolNumberBadge}>
                  <Text style={styles.protocolNumberText}>{idx + 1}</Text>
                </View>
                <View style={styles.protocolTitleCol}>
                  <Text style={styles.protocolTitle}>{pSet.title}</Text>
                  <Text style={styles.protocolSubtitle}>{pSet.subtitle}</Text>
                </View>
                <View style={styles.holdsBadge}>
                  <Text style={styles.holdsBadgeText}>{pSet.exerciseIds.length} Holds</Text>
                </View>
              </View>
              <Text style={styles.protocolDesc}>{pSet.description}</Text>
            </View>
          ))}

          {/* Custom builder card */}
          <View style={[styles.protocolCard, styles.customProtocolCard]}>
            <View style={styles.protocolHeader}>
              <View style={[styles.protocolNumberBadge, { backgroundColor: theme.colors.primaryBg }]}>
                <Sparkles size={14} color={theme.colors.primary} />
              </View>
              <View style={styles.protocolTitleCol}>
                <Text style={styles.protocolTitle}>Custom Practice Builder</Text>
                <Text style={styles.protocolSubtitle}>Personalized Routines</Text>
              </View>
            </View>
            <Text style={styles.protocolDesc}>
              Mix and match holds from any protocol to design custom training sessions tailored to your specific goals.
            </Text>
          </View>
        </View>
      </View>

      {/* App Features */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Award size={20} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Key Features</Text>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIconWrap}>
            <Play size={18} color={theme.colors.primary} fill={theme.colors.primary} />
          </View>
          <View style={styles.featureTextWrap}>
            <Text style={styles.featureTitle}>Guided Workout Runner</Text>
            <Text style={styles.featureDesc}>
              Customizable hold and rest intervals with synthesized voice cues and haptic alerts.
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIconWrap}>
            <Timer size={18} color={theme.colors.primary} />
          </View>
          <View style={styles.featureTextWrap}>
            <Text style={styles.featureTitle}>Precision Hold Stopwatch</Text>
            <Text style={styles.featureDesc}>
              Dedicated practice mode timer with instant one-tap workout logging.
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIconWrap}>
            <BookOpen size={18} color={theme.colors.primary} />
          </View>
          <View style={styles.featureTextWrap}>
            <Text style={styles.featureTitle}>Video Demonstrations & Posture Cues</Text>
            <Text style={styles.featureDesc}>
              Detailed step-by-step instructions, targeted muscle groups, and embedded video guides.
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIconWrap}>
            <Activity size={18} color={theme.colors.primary} />
          </View>
          <View style={styles.featureTextWrap}>
            <Text style={styles.featureTitle}>Daily Streaks & History</Text>
            <Text style={styles.featureDesc}>
              Log sets, durations, personal bests, and visualize your daily consistency calendar.
            </Text>
          </View>
        </View>
      </View>

      {/* Rules of Effective Practice */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <CheckCircle2 size={20} color={theme.colors.success} />
          <Text style={styles.sectionTitle}>Rules of Effective Practice</Text>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>1. Never Hold Your Breath</Text>
          <Text style={styles.tipBody}>
            Breathe steadily through your nose down into your lower belly. Holding your breath triggers excessive blood pressure spikes.
          </Text>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>2. Form Over Duration</Text>
          <Text style={styles.tipBody}>
            Quality of muscular contraction always beats duration. As soon as your alignment breaks down, terminate the hold and rest.
          </Text>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>3. Gradual Progressive Overload</Text>
          <Text style={styles.tipBody}>
            Increase your hold time by 5–10 seconds per week or progress toward lower, more mechanically challenging angles.
          </Text>
        </View>
      </View>

      {/* Developer & Contact Card */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <User size={20} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Developer & Contact</Text>
        </View>

        <View style={styles.contactCard}>
          <View style={styles.contactAvatar}>
            <Text style={styles.contactAvatarText}>MA</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>Mohammed Abdelhay</Text>
            <Text style={styles.contactRole}>Creator & Developer</Text>
          </View>
        </View>

        <View style={styles.contactLinksCol}>
          <TouchableOpacity
            style={styles.contactLinkItem}
            onPress={() => Linking.openURL('mailto:mamado2000@gmail.com')}
            activeOpacity={0.75}
          >
            <View style={styles.contactIconWrap}>
              <Mail size={16} color={theme.colors.primary} />
            </View>
            <View style={styles.contactLinkContent}>
              <Text style={styles.contactLinkLabel}>Email</Text>
              <Text style={styles.contactLinkValue}>mamado2000@gmail.com</Text>
            </View>
            <ExternalLink size={16} color={theme.colors.textSubtle} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactLinkItem}
            onPress={() => Linking.openURL('https://www.linkedin.com/in/mohammed-abdelhay')}
            activeOpacity={0.75}
          >
            <View style={[styles.contactIconWrap, { backgroundColor: 'rgba(10, 102, 194, 0.15)' }]}>
              <Linkedin size={16} color="#0a66c2" />
            </View>
            <View style={styles.contactLinkContent}>
              <Text style={styles.contactLinkLabel}>LinkedIn</Text>
              <Text style={styles.contactLinkValue}>mohammed-abdelhay</Text>
            </View>
            <ExternalLink size={16} color={theme.colors.textSubtle} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Privacy Card */}
      <View style={styles.privacyCard}>
        <Lock size={18} color={theme.colors.textMuted} />
        <View style={styles.privacyTextCol}>
          <Text style={styles.privacyTitle}>100% Offline & Private</Text>
          <Text style={styles.privacyDesc}>
            All your training logs, custom routines, and streaks stay exclusively on your device. No cloud sync, no tracking, and no account required.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Isometric Holds • Built for Strength & Resilience</Text>
        <TouchableOpacity
          onPress={onBack}
          style={styles.footerBackButton}
          activeOpacity={0.8}
        >
          <Text style={styles.footerBackButtonText}>Return to Workouts</Text>
        </TouchableOpacity>
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
    paddingBottom: 60,
    gap: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  heroCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLogoBadge: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLogoText: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.primaryText,
    letterSpacing: -0.5,
  },
  versionPill: {
    backgroundColor: theme.colors.cardLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
  },
  versionText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  heroTagline: {
    fontSize: 15,
    color: theme.colors.textMuted,
    lineHeight: 22,
  },
  section: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    gap: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  bodyText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    lineHeight: 22,
  },
  pillarsGrid: {
    gap: 12,
    marginTop: 4,
  },
  pillarCard: {
    backgroundColor: theme.colors.cardLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: 6,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  pillarTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  pillarDesc: {
    fontSize: 13,
    color: theme.colors.textMuted,
    lineHeight: 18,
  },
  protocolList: {
    gap: 10,
    marginTop: 4,
  },
  protocolCard: {
    backgroundColor: theme.colors.cardLight,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
  },
  customProtocolCard: {
    borderStyle: 'dashed',
    borderColor: theme.colors.primary,
  },
  protocolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  protocolNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.cardBorderHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  protocolNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.text,
  },
  protocolTitleCol: {
    flex: 1,
  },
  protocolTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  protocolSubtitle: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  holdsBadge: {
    backgroundColor: theme.colors.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.full,
  },
  holdsBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  protocolDesc: {
    fontSize: 13,
    color: theme.colors.textMuted,
    lineHeight: 18,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.cardLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
  },
  featureTextWrap: {
    flex: 1,
    gap: 3,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  featureDesc: {
    fontSize: 13,
    color: theme.colors.textMuted,
    lineHeight: 18,
  },
  tipCard: {
    backgroundColor: theme.colors.cardLight,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    gap: 4,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.success,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  tipBody: {
    fontSize: 13,
    color: theme.colors.textMuted,
    lineHeight: 18,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.colors.cardLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
  },
  contactAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactAvatarText: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.primaryText,
  },
  contactInfo: {
    flex: 1,
    gap: 3,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text,
  },
  contactRole: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  contactLinksCol: {
    gap: 10,
  },
  contactLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.cardLight,
    padding: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
  },
  contactIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactLinkContent: {
    flex: 1,
    gap: 2,
  },
  contactLinkLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactLinkValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  privacyTextCol: {
    flex: 1,
    gap: 2,
  },
  privacyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  privacyDesc: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 16,
  },
  footer: {
    alignItems: 'center',
    gap: 14,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.textSubtle,
    fontWeight: '500',
  },
  footerBackButton: {
    backgroundColor: theme.colors.cardLight,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
  },
  footerBackButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
});
