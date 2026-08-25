import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const speak = (text: string) => {
  try {
    Speech.stop();
    Speech.speak(text, {
      rate: Platform.OS === 'ios' ? 0.95 : 1.0,
      pitch: 1.0,
      language: 'en-US',
    });
  } catch (e) {
    console.warn('Speech error:', e);
  }
};

export const stopSpeech = () => {
  try {
    Speech.stop();
  } catch (e) {
    console.warn('Stop speech error:', e);
  }
};

export const triggerHaptic = async (type: 'prepare' | 'hold' | 'rest' | 'complete') => {
  if (Platform.OS === 'web') return;
  try {
    switch (type) {
      case 'prepare':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'hold':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'rest':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'complete':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
    }
  } catch (e) {
    // Haptics might not be supported on all devices
  }
};

export const playSessionStart = () => {
  triggerHaptic('prepare');
};

export const playTransition = (type: 'prepare' | 'hold' | 'rest' = 'rest') => {
  triggerHaptic(type);
};

export const playSessionEnd = () => {
  triggerHaptic('complete');
};
