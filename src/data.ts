import { Exercise, PracticeSet } from './types';

export const exerciseImages: Record<string, any> = {
  'iron-bridge': require('../assets/images/1-iron-bridge.webp'),
  'wall-sit': require('../assets/images/2-wall-set.webp'),
  'bear-crawl-hold': require('../assets/images/3-bear-crawl.webp'),
  'horse-stance': require('../assets/images/4-horse-stance.webp'),
  'hollow-body-hold': require('../assets/images/5-hollow-body.webp'),
  'bottom-push-up-hold': require('../assets/images/6-bottom-push-up.webp'),
};

export const practiceSets: PracticeSet[] = [
  {
    id: 'shaolin-holds',
    title: 'Shaolin Holds',
    subtitle: 'Ancient Isometric Mastery',
    description:
      'The foundational 6 isometric postures designed to build immense tendon strength, core stability, and mental stillness.',
    exerciseIds: [
      'iron-bridge',
      'wall-sit',
      'bear-crawl-hold',
      'horse-stance',
      'hollow-body-hold',
      'bottom-push-up-hold',
    ],
  },
];

export const exercises: Exercise[] = [
  {
    id: 'iron-bridge',
    practiceSetId: 'shaolin-holds',
    title: 'Iron Bridge',
    steps: [
      'Lie flat on back.',
      'Hands by sides, palms down.',
      'Lift hips up to form a straight line from shoulders to feet.',
      'Engage glutes.',
      'Hold and breathe.'
    ],
    progression: {
      week1: '15-20 sec, 3 sets',
      week2: '30-45 sec, 3 sets',
      week3: '60-90 sec, 3 sets'
    },
    videoId: '8bbE64NuDtU', // Placeholder: Glute bridge
  },
  {
    id: 'wall-sit',
    practiceSetId: 'shaolin-holds',
    title: 'Wall Sit',
    steps: [
      'Back flat against wall.',
      'Slide down until knees are at a 90° angle.',
      'Press back into wall.',
      'Breathe evenly.',
      'Hold and breathe.'
    ],
    progression: {
      week1: '20 sec (Quarter depth)',
      week2: '30 sec (Half depth)',
      week3: '60 sec (Thighs parallel to floor)'
    },
    videoId: 'y-wV4Venusw', // Placeholder: Wall sit
  },
  {
    id: 'bear-crawl-hold',
    practiceSetId: 'shaolin-holds',
    title: 'Bear Crawl Hold',
    steps: [
      'Hands under shoulders, knees under hips.',
      'Knees hover 1 inch off the ground.',
      'Back flat.',
      'Core tight.',
      'Hold and breathe.'
    ],
    progression: {
      week1: '15-20 sec, 3 sets',
      week2: '20-30 sec, 3 sets',
      week3: '45-60 sec, 3 sets'
    },
    videoId: '2U1F9MIFtE4', // Placeholder: Bear crawl hold
  },
  {
    id: 'horse-stance',
    practiceSetId: 'shaolin-holds',
    title: 'Horse Stance',
    steps: [
      'Feet twice shoulder-width apart.',
      'Toes slightly out.',
      'Sink hips down.',
      'Chest up.',
      'Hold and breathe.'
    ],
    progression: {
      week1: '20 sec, 3 sets (Quarter depth)',
      week2: '30 sec, 3 sets (Half depth)',
      week3: '60 sec, 3 sets (Thighs parallel to floor)'
    },
    videoId: 'QjD38Q08i2U', // Placeholder: Horse stance
  },
  {
    id: 'hollow-body-hold',
    practiceSetId: 'shaolin-holds',
    title: 'Hollow Body Hold',
    steps: [
      'Lie on back, press lower back into floor.',
      'Knees bent to 90 degrees above hips.',
      'Arms extended overhead.',
      'Hold and breathe.',
      'DO NOT ARCH BACK, KNEES BENT ONLY.'
    ],
    progression: {
      week1: '15 sec, 3 sets (Knees bent)',
      week2: '20 sec, 3 sets (One leg extended)',
      week3: 'Progress carefully (Consult for advanced levels)'
    },
    videoId: 'LlDNef_Ztsc', // Placeholder: Hollow body hold
  },
  {
    id: 'bottom-push-up-hold',
    practiceSetId: 'shaolin-holds',
    title: 'Bottom Push-Up Hold',
    steps: [
      'Get into push-up position.',
      'Lower down, chest just above floor.',
      'Elbows at 45°.',
      'Body straight, core tight.',
      'Hold and breathe.'
    ],
    progression: {
      week1: '10-15 sec, 3 sets',
      week2: '20-30 sec, 3 sets',
      week3: '45-60 sec, 3 sets'
    },
    videoId: '2yBvA-fV_Jk', // Placeholder: Push up hold
  }
];

export const getExercisesForSet = (setId: string): Exercise[] => {
  const set = practiceSets.find((s) => s.id === setId);
  if (!set) return [];
  return exercises.filter((ex) => set.exerciseIds.includes(ex.id));
};
