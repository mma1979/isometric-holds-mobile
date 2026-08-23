const createAudioContext = () => {
  if (typeof window !== 'undefined') {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return null;
};

let audioCtx: AudioContext | null = null;

const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.5) => {
  if (!audioCtx) audioCtx = createAudioContext();
  if (!audioCtx) return;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);
};

export const playSessionStart = () => {
  // Deep resonant bowl sound
  playTone(216, 3, 'sine', 0.6); // Base (A3-ish / A432 scale)
  playTone(432, 2.5, 'sine', 0.3); // Octave
  playTone(648, 2, 'sine', 0.1); // Harmonic
};

export const playTransition = () => {
  // Soft, brief double chime (like a meditation bell)
  playTone(540, 1.5, 'sine', 0.4);
  setTimeout(() => {
    playTone(810, 2, 'sine', 0.3);
  }, 200);
};

export const playSessionEnd = () => {
  // Triumphant/closing deep resonant chord
  playTone(216, 4, 'sine', 0.5);
  playTone(270, 3.5, 'sine', 0.4); // Major third
  playTone(324, 3, 'sine', 0.3); // Perfect fifth
  playTone(432, 4, 'sine', 0.2); // Octave
};
