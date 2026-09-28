import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import {
  ShieldCheck,
  Lock,
  ExternalLink,
  CheckCircle2,
  Database,
  EyeOff,
} from 'lucide-react-native';
import { theme } from '../theme';

export const PRIVACY_POLICY_URL = 'https://mabdelhay.com/isometric-holds/privacy';

interface PrivacyPolicyModalProps {
  visible: boolean;
  onAccept: () => void;
}

export default function PrivacyPolicyModal({
  visible,
  onAccept,
}: PrivacyPolicyModalProps) {
  const handleOpenPrivacy = async () => {
    try {
      const supported = await Linking.canOpenURL(PRIVACY_POLICY_URL);
      if (supported) {
        await Linking.openURL(PRIVACY_POLICY_URL);
      }
    } catch (e) {
      console.error('Failed to open privacy policy URL', e);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.cardContainer}>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header Icon & Title */}
            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <ShieldCheck size={36} color={theme.colors.primary} />
              </View>
              <Text style={styles.title}>Privacy Policy</Text>
              <Text style={styles.subtitle}>
                Welcome to Isometric Holds. We are committed to protecting your privacy from day one.
              </Text>
            </View>

            {/* Highlights Grid */}
            <View style={styles.highlightsContainer}>
              <View style={styles.highlightItem}>
                <View style={[styles.highlightIconBadge, { backgroundColor: theme.colors.successBg }]}>
                  <Database size={18} color={theme.colors.success} />
                </View>
                <View style={styles.highlightTextWrap}>
                  <Text style={styles.highlightTitle}>100% Offline & Local</Text>
                  <Text style={styles.highlightDesc}>
                    Your workout logs, personal bests, and custom routines are stored exclusively on your device.
                  </Text>
                </View>
              </View>

              <View style={styles.highlightItem}>
                <View style={[styles.highlightIconBadge, { backgroundColor: theme.colors.primaryBg }]}>
                  <EyeOff size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.highlightTextWrap}>
                  <Text style={styles.highlightTitle}>No Tracking & No Ads</Text>
                  <Text style={styles.highlightDesc}>
                    We do not track your behavior, collect personal information, or run third-party advertising.
                  </Text>
                </View>
              </View>

              <View style={styles.highlightItem}>
                <View style={[styles.highlightIconBadge, { backgroundColor: theme.colors.infoBg }]}>
                  <Lock size={18} color={theme.colors.info} />
                </View>
                <View style={styles.highlightTextWrap}>
                  <Text style={styles.highlightTitle}>No Account Required</Text>
                  <Text style={styles.highlightDesc}>
                    No sign-up, email, or credentials needed to access all training protocols and features.
                  </Text>
                </View>
              </View>
            </View>

            {/* Privacy Link Card */}
            <TouchableOpacity
              style={styles.policyLinkCard}
              onPress={handleOpenPrivacy}
              activeOpacity={0.8}
            >
              <View style={styles.policyLinkContent}>
                <View style={styles.policyLinkIconWrap}>
                  <ExternalLink size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.policyLinkTextCol}>
                  <Text style={styles.policyLinkTitle}>Read Full Privacy Policy</Text>
                  <Text style={styles.policyLinkUrl}>mabdelhay.com/isometric-holds/privacy</Text>
                </View>
              </View>
              <View style={styles.openPill}>
                <Text style={styles.openPillText}>Open</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.agreementNotice}>
              By tapping Agree & Continue, you acknowledge that you have reviewed and agree to our Privacy Policy.
            </Text>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={onAccept}
                activeOpacity={0.85}
              >
                <CheckCircle2 size={18} color={theme.colors.primaryText} />
                <Text style={styles.acceptButtonText}>Agree & Continue</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '90%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  scrollContent: {
    padding: theme.spacing.lg,
    gap: 16,
  },
  header: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.3)',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  highlightsContainer: {
    gap: 10,
    marginTop: 4,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.cardLight,
    padding: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorderHighlight,
  },
  highlightIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightTextWrap: {
    flex: 1,
    gap: 2,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  highlightDesc: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 16,
  },
  policyLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(234, 179, 8, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.35)',
    borderRadius: theme.borderRadius.md,
    padding: 12,
    marginTop: 2,
  },
  policyLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  policyLinkIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  policyLinkTextCol: {
    flex: 1,
    gap: 2,
  },
  policyLinkTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  policyLinkUrl: {
    fontSize: 11,
    color: theme.colors.primary,
  },
  openPill: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  openPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primaryText,
  },
  agreementNotice: {
    fontSize: 11,
    color: theme.colors.textSubtle,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 10,
  },
  actions: {
    gap: 10,
    marginTop: 4,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primaryText,
  },
});
