import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';

// Configure audio session mode
try {
  Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  }).catch(() => {});
} catch {
  // Audio mode setup may be unavailable in some environments
}

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

export const triggerHaptic = async (
  type: 'prepare' | 'hold' | 'rest' | 'complete' | 'countdown' | 'tick'
) => {
  if (Platform.OS === 'web') return;
  try {
    switch (type) {
      case 'countdown':
      case 'tick':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
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
  } catch {
    // Haptics might not be supported on all devices
  }
};

// Sound Asset Map for Native
const SOUND_FILES = {
  countdown_beep: require('../assets/sounds/countdown_beep.wav'),
  countdown_go: require('../assets/sounds/countdown_go.wav'),
  hold_start: require('../assets/sounds/hold_start.wav'),
  rest_start: require('../assets/sounds/rest_start.wav'),
  prepare_start: require('../assets/sounds/prepare_start.wav'),
  focus_pulse: require('../assets/sounds/focus_pulse.wav'),
  halfway_cue: require('../assets/sounds/halfway_cue.wav'),
  session_complete: require('../assets/sounds/session_complete.wav'),
};

export type SoundKey = keyof typeof SOUND_FILES;

// Web Audio API Synthesis fallback for instant zero-latency playback in browsers
let webAudioCtx: any = null;
const getWebAudioContext = () => {
  if (typeof window === 'undefined') return null;
  const AudioContextClass =
    window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!webAudioCtx) {
    webAudioCtx = new AudioContextClass();
  }
  if (webAudioCtx.state === 'suspended') {
    webAudioCtx.resume().catch(() => {});
  }
  return webAudioCtx;
};

const playWebSound = (key: SoundKey) => {
  try {
    const ctx = getWebAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (key === 'countdown_beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, now);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (key === 'countdown_go') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987, now);
      osc.frequency.setValueAtTime(1318, now + 0.1);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (key === 'hold_start') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(783.99, now + 0.12);
      gain.gain.setValueAtTime(0.75, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } else if (key === 'rest_start') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(659.25, now + 0.12);
      osc.frequency.setValueAtTime(523.25, now + 0.24);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    } else if (key === 'prepare_start') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(739.99, now + 0.1);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } else if (key === 'focus_pulse') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (key === 'halfway_cue') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.setValueAtTime(880, now + 0.14);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } else if (key === 'session_complete') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      });
    }
  } catch (err) {
    console.warn('Web audio playback error:', err);
  }
};

// Preload and cache sound instances for native devices
const preloadedSounds: Partial<Record<SoundKey, Audio.Sound>> = {};

const getOrPreloadSound = async (key: SoundKey): Promise<Audio.Sound | null> => {
  if (preloadedSounds[key]) {
    return preloadedSounds[key]!;
  }
  try {
    const { sound } = await Audio.Sound.createAsync(SOUND_FILES[key], {
      volume: 1.0,
      shouldPlay: false,
    });
    preloadedSounds[key] = sound;
    return sound;
  } catch {
    return null;
  }
};

export const preloadSounds = async () => {
  if (Platform.OS === 'web') return;
  const keys = Object.keys(SOUND_FILES) as SoundKey[];
  for (const key of keys) {
    try {
      await getOrPreloadSound(key);
    } catch {
      // Continue preloading others
    }
  }
};

export const playSound = async (key: SoundKey) => {
  if (Platform.OS === 'web') {
    playWebSound(key);
    return;
  }

  try {
    const sound = await getOrPreloadSound(key);
    if (sound) {
      await sound.replayAsync();
      return;
    }
  } catch {
    // If replayAsync fails (e.g. unloaded), fall back to createAsync
  }

  try {
    const { sound: freshSound } = await Audio.Sound.createAsync(
      SOUND_FILES[key],
      { shouldPlay: true, volume: 1.0 }
    );
    preloadedSounds[key] = freshSound;
  } catch (e) {
    console.warn(`Failed to play sound: ${key}`, e);
  }
};

// High-level Sound Actions

/**
 * Sound played for countdown ticks in the last 3 seconds (3, 2, 1)
 */
export const playCountdown = async (second: number) => {
  triggerHaptic('countdown');
  await playSound('countdown_beep');
};

/**
 * Sound played when countdown hits 0 / GO / Transition
 */
export const playCountdownGo = async () => {
  triggerHaptic('hold');
  await playSound('countdown_go');
};

/**
 * Sound played when transitioning into a new interval phase
 */
export const playTransition = async (
  type: 'prepare' | 'hold' | 'rest' = 'rest'
) => {
  triggerHaptic(type);
  if (type === 'hold') {
    await playSound('hold_start');
  } else if (type === 'rest') {
    await playSound('rest_start');
  } else if (type === 'prepare') {
    await playSound('prepare_start');
  }
};

/**
 * Sound played at session start
 */
export const playSessionStart = async () => {
  triggerHaptic('prepare');
  await playSound('prepare_start');
};

/**
 * Sound played at workout session completion
 */
export const playSessionEnd = async () => {
  triggerHaptic('complete');
  await playSound('session_complete');
};

/**
 * Subtle interval cadence tick during holds
 */
export const playFocusPulse = async () => {
  triggerHaptic('tick');
  await playSound('focus_pulse');
};

/**
 * Midpoint chime during hold
 */
export const playHalfwayCue = async () => {
  triggerHaptic('hold');
  await playSound('halfway_cue');
};

/**
 * Unload all loaded audio instances
 */
export const stopAllAudio = async () => {
  stopSpeech();
  for (const key of Object.keys(preloadedSounds) as SoundKey[]) {
    try {
      await preloadedSounds[key]?.stopAsync();
    } catch {}
  }
};

