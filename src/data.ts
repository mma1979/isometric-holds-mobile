import { Exercise } from './types';

export const exercises: Exercise[] = [
  {
    id: 'iron-bridge',
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
    title: 'Hollow Body Hold',
    steps: [
      'Lie on back, press lower back into floor.',
      'Knees bent to 90 degrees above hips.',
      'Arms extended overhead.',
      'Hold and breathe.',
      'DO NOT KNEES MENT, KNEES BENT ONLY.'
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
