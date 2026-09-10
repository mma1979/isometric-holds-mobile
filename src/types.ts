export interface Progression {
  week1: string;
  week2: string;
  week3: string;
}

export interface PracticeSet {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  exerciseIds: string[];
  isCustom?: boolean;
  createdAt?: string;
}

export interface Exercise {
  id: string;
  title: string;
  subtitle?: string;
  practiceSetId?: string;
  steps: string[];
  progression: Progression;
  videoId: string;
  imageFallback?: string;
}

export interface SessionConfigItem {
  exerciseId: string;
  sets: number;
  duration: number; // in seconds
  rest: number; // in seconds
}

export interface LogEntry {
  id: string;
  exerciseId: string;
  date: string; // ISO string
  sets: number;
  durationReps: number; // Duration in seconds or Reps
  weight: number; // In lbs or kg
}
