import { Exercise, PracticeSet } from './types';

export const exerciseImages: Record<string, any> = {
  // Shaolin Holds
  'iron-bridge': require('../assets/images/shaolen/1-iron-bridge.webp'),
  'wall-sit': require('../assets/images/shaolen/2-wall-set.webp'),
  'bear-crawl-hold': require('../assets/images/shaolen/3-bear-crawl.webp'),
  'horse-stance': require('../assets/images/shaolen/4-horse-stance.webp'),
  'hollow-body-hold': require('../assets/images/shaolen/5-hollow-body.webp'),
  'bottom-push-up-hold': require('../assets/images/shaolen/6-bottom-push-up.webp'),

  // Core Holds
  'core-forearm-plank': require('../assets/images/core/core-01.webp'),
  'core-side-plank': require('../assets/images/core/core-02.webp'),
  'core-hollow-body-hold': require('../assets/images/core/core-03.webp'),
  'core-bird-dog-hold': require('../assets/images/core/core-4.webp'),
  'core-bear-plank-hold': require('../assets/images/core/core-05.webp'),
  'core-dead-bug-hold': require('../assets/images/core/core-06.webp'),
  'core-single-leg-lift-hold': require('../assets/images/core/core-07.webp'),
  'core-chaturanga-hold': require('../assets/images/core/core-08.webp'),
  'core-superman-hold': require('../assets/images/core/core-09.webp'),
  'core-glute-bridge-hold': require('../assets/images/core/core-10.webp'),
  'core-l-sit-hold': require('../assets/images/core/core-11.webp'),

  // Posture Alignment Drills
  'drill-pelvic-tilt': require('../assets/images/drills/drills-01.webp'),
  'drill-wall-stacking': require('../assets/images/drills/drills-02.webp'),

  // Fundamental Holds
  'hold-wall-sit': require('../assets/images/holds/holds-02.webp'),
  'hold-isometric-lunge': require('../assets/images/holds/holds-03.webp'),
  'hold-heel-raise-hang': require('../assets/images/holds/holds-04.webp'),
  'hold-hip-thrust-floor': require('../assets/images/holds/holds-05.webp'),
  'hold-hip-thrust-bench': require('../assets/images/holds/holds-01.webp'),
  'hold-chin-up': require('../assets/images/holds/holds-06.webp'),

  // Samurai Conditioning Holds
  'samurai-horse-stance': require('../assets/images/samurai/samurai-02.webp'),
  'samurai-deep-squat': require('../assets/images/samurai/samurai-03.webp'),
  'samurai-wall-sit': require('../assets/images/samurai/samurai-04.webp'),
  'samurai-high-plank': require('../assets/images/samurai/samurai-05.webp'),
  'samurai-warrior-lunge': require('../assets/images/samurai/samurai--6.webp'),
  'samurai-hollow-body': require('../assets/images/samurai/samurai-07.webp'),
  'samurai-glute-bridge': require('../assets/images/samurai/samurai-01.webp'),
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
  {
    id: 'core-holds',
    title: 'Core Holds',
    subtitle: 'Deep Abdominal & Spine Stability',
    description:
      '11 targeted isometric core holds to activate deep abdominal stabilizers, improve pelvic alignment, and build unbreakable endurance.',
    exerciseIds: [
      'core-forearm-plank',
      'core-side-plank',
      'core-hollow-body-hold',
      'core-bird-dog-hold',
      'core-bear-plank-hold',
      'core-dead-bug-hold',
      'core-single-leg-lift-hold',
      'core-chaturanga-hold',
      'core-superman-hold',
      'core-glute-bridge-hold',
      'core-l-sit-hold',
    ],
  },
  {
    id: 'posture-drills',
    title: 'Posture Alignment Drills',
    subtitle: 'Neuromuscular Re-Education',
    description:
      'Gentle corrective alignment drills to shift your center of gravity, release tight psoas tension, and restore natural posture.',
    exerciseIds: [
      'drill-pelvic-tilt',
      'drill-wall-stacking',
    ],
  },
  {
    id: 'fundamental-holds',
    title: 'Fundamental Holds',
    subtitle: 'Tendon Loading & Joint Resilience',
    description:
      'Essential isometric holds engineered to strengthen patellar and Achilles tendons, decompress the spine, and build joint strength.',
    exerciseIds: [
      'hold-wall-sit',
      'hold-isometric-lunge',
      'hold-heel-raise-hang',
      'hold-hip-thrust-floor',
      'hold-hip-thrust-bench',
      'hold-chin-up',
    ],
  },
  {
    id: 'samurai-holds',
    title: 'Samurai Holds',
    subtitle: 'Sustained Tension Protocol',
    description:
      'Traditional martial conditioning postures focusing on sustained muscular tension, hormonal optimization, and joint resilience.',
    exerciseIds: [
      'samurai-horse-stance',
      'samurai-deep-squat',
      'samurai-wall-sit',
      'samurai-high-plank',
      'samurai-warrior-lunge',
      'samurai-hollow-body',
      'samurai-glute-bridge',
    ],
  },
];

export const exercises: Exercise[] = [
  // ==========================================
  // SHAOLIN HOLDS
  // ==========================================
  {
    id: 'iron-bridge',
    practiceSetId: 'shaolin-holds',
    title: 'Iron Bridge',
    subtitle: 'Glute & Posterior Chain Hold',
    steps: [
      'Lie flat on back with knees bent.',
      'Hands by sides, palms down.',
      'Lift hips up to form a straight line from shoulders to feet.',
      'Engage glutes and brace core.',
      'Hold and breathe steadily.',
    ],
    progression: {
      week1: '15-20 sec, 3 sets',
      week2: '30-45 sec, 3 sets',
      week3: '60-90 sec, 3 sets',
    },
    videoId: '8bbE64NuDtU',
  },
  {
    id: 'wall-sit',
    practiceSetId: 'shaolin-holds',
    title: 'Wall Sit',
    subtitle: 'Quadriceps Isometric Contraction',
    steps: [
      'Back flat against wall.',
      'Slide down until knees are at a 90° angle.',
      'Press back firmly into wall.',
      'Breathe evenly through nasal breathing.',
      'Hold position with thighs parallel to floor.',
    ],
    progression: {
      week1: '20 sec (Quarter depth)',
      week2: '30 sec (Half depth)',
      week3: '60 sec (Thighs parallel to floor)',
    },
    videoId: 'y-wV4Venusw',
  },
  {
    id: 'bear-crawl-hold',
    practiceSetId: 'shaolin-holds',
    title: 'Bear Crawl Hold',
    subtitle: 'Full-Body Core Stability',
    steps: [
      'Hands under shoulders, knees directly under hips.',
      'Tuck toes and hover knees 1 inch off the ground.',
      'Keep back flat like a tabletop.',
      'Maintain tight core and steady breath.',
      'Hold without letting hips sag or rotate.',
    ],
    progression: {
      week1: '15-20 sec, 3 sets',
      week2: '20-30 sec, 3 sets',
      week3: '45-60 sec, 3 sets',
    },
    videoId: '2U1F9MIFtE4',
  },
  {
    id: 'horse-stance',
    practiceSetId: 'shaolin-holds',
    title: 'Horse Stance',
    subtitle: 'Ancient Stance of Power',
    steps: [
      'Step feet twice shoulder-width apart.',
      'Turn toes slightly outwards.',
      'Sink hips down as if sitting on a horse.',
      'Keep chest tall and spine upright.',
      'Hold and breathe deeply into lower abdomen.',
    ],
    progression: {
      week1: '20 sec, 3 sets (Quarter depth)',
      week2: '30 sec, 3 sets (Half depth)',
      week3: '60 sec, 3 sets (Thighs parallel)',
    },
    videoId: 'QjD38Q08i2U',
  },
  {
    id: 'hollow-body-hold',
    practiceSetId: 'shaolin-holds',
    title: 'Hollow Body Hold',
    subtitle: 'Transverse Abdominis Shield',
    steps: [
      'Lie on back, press lower back firmly into floor.',
      'Knees bent to 90 degrees above hips (or legs extended).',
      'Arms extended overhead in line with ears.',
      'Do not arch back; keep abdominal wall glued down.',
      'Hold shape with calm breathing.',
    ],
    progression: {
      week1: '15 sec, 3 sets (Knees bent)',
      week2: '20 sec, 3 sets (One leg extended)',
      week3: 'Progress carefully (Full hollow hold)',
    },
    videoId: 'LlDNef_Ztsc',
  },
  {
    id: 'bottom-push-up-hold',
    practiceSetId: 'shaolin-holds',
    title: 'Bottom Push-Up Hold',
    subtitle: 'Pectoral & Triceps Static Load',
    steps: [
      'Get into a standard push-up position.',
      'Lower down until chest hovers 1-2 inches above floor.',
      'Elbows tucked at 45° angle.',
      'Body rigidly straight from head to heels.',
      'Hold hovering position and breathe steadily.',
    ],
    progression: {
      week1: '10-15 sec, 3 sets',
      week2: '20-30 sec, 3 sets',
      week3: '45-60 sec, 3 sets',
    },
    videoId: '2yBvA-fV_Jk',
  },

  // ==========================================
  // CORE HOLDS
  // ==========================================
  {
    id: 'core-forearm-plank',
    practiceSetId: 'core-holds',
    title: 'Forearm Plank',
    subtitle: 'Build Global Stability',
    steps: [
      'Place elbows directly under shoulders, forearms parallel.',
      'Step feet back to form a rigid straight line from head to heels.',
      'Engage core, squeeze glutes, and push heels back.',
      'Press floor away through forearms to avoid sagging shoulders.',
      'Breathe steadily through nose.',
    ],
    progression: {
      week1: '15-20 sec, 3 sets',
      week2: '30-45 sec, 3 sets',
      week3: '60-90 sec, 3 sets',
    },
    videoId: 'pSHjTRCQxIw',
  },
  {
    id: 'core-side-plank',
    practiceSetId: 'core-holds',
    title: 'Side Plank',
    subtitle: 'Strengthen Obliques & Hip Abductors',
    steps: [
      'Lie on your side with supporting elbow directly below shoulder.',
      'Stack or stagger feet and lift hips off the floor.',
      'Maintain a straight diagonal line from ankles to neck.',
      'Contract bottom oblique and reach top arm upward or rest on hip.',
      'Repeat on both sides.',
    ],
    progression: {
      week1: '15-20 sec (each side), 3 sets',
      week2: '25-30 sec (each side), 3 sets',
      week3: '30-45 sec (each side), 3 sets',
    },
    videoId: 'K2VljzCC16g',
  },
  {
    id: 'core-hollow-body-hold',
    practiceSetId: 'core-holds',
    title: 'Hollow Body Hold',
    subtitle: 'Engage Deep Core & Improve Posture',
    steps: [
      'Lie flat on your back and press lumbar spine firmly into floor.',
      'Lift shoulders and head slightly off ground.',
      'Extend arms forward or overhead and elevate legs slightly.',
      'Maintain shallow banana contour with lower back sealed to mat.',
      'Hold steady tension without breath holding.',
    ],
    progression: {
      week1: '15-20 sec, 3 sets',
      week2: '25-30 sec, 3 sets',
      week3: '30-45 sec, 3 sets',
    },
    videoId: 'LlDNef_Ztsc',
  },
  {
    id: 'core-bird-dog-hold',
    practiceSetId: 'core-holds',
    title: 'Bird Dog Hold',
    subtitle: 'Improve Balance, Coordination & Back Health',
    steps: [
      'Start on all fours with hands under shoulders and knees under hips.',
      'Reach one arm straight forward and opposite leg straight back.',
      'Keep hips level to the floor without tilting.',
      'Tighten abdominals and extend through fingertips and heel.',
      'Switch sides evenly.',
    ],
    progression: {
      week1: '15-20 sec (each side), 3 sets',
      week2: '25-30 sec (each side), 3 sets',
      week3: '30-45 sec (each side), 3 sets',
    },
    videoId: 'wiFNA3sqjCA',
  },
  {
    id: 'core-bear-plank-hold',
    practiceSetId: 'core-holds',
    title: 'Bear Plank Hold',
    subtitle: 'Stabilize Core, Pelvis & Deep Spine Muscles',
    steps: [
      'Assume tabletop position on hands and toes.',
      'Elevate knees 1-2 inches above ground.',
      'Keep neck neutral and spine flat.',
      'Focus tension in deep transverse abdominals and pelvic floor.',
      'Hold statically while breathing smoothly.',
    ],
    progression: {
      week1: '15-20 sec, 3 sets',
      week2: '25-30 sec, 3 sets',
      week3: '30-45 sec, 3 sets',
    },
    videoId: '2U1F9MIFtE4',
  },
  {
    id: 'core-dead-bug-hold',
    practiceSetId: 'core-holds',
    title: 'Dead Bug Hold',
    subtitle: 'Engage Deep Core & Improve Coordination',
    steps: [
      'Lie on back with arms pointing up and hips/knees bent at 90°.',
      'Flatten lower back into the mat with no space underneath.',
      'Extend one arm overhead and opposite leg toward floor.',
      'Hover limbs 1-2 inches above ground without arching lower back.',
      'Hold position and switch sides.',
    ],
    progression: {
      week1: '15-20 sec (each side), 3 sets',
      week2: '25-30 sec (each side), 3 sets',
      week3: '30-45 sec (each side), 3 sets',
    },
    videoId: 'g_BYB0R-4Ws',
  },
  {
    id: 'core-single-leg-lift-hold',
    practiceSetId: 'core-holds',
    title: 'Single-Leg Lift Hold',
    subtitle: 'Isolate Lower Abs & Build Strength',
    steps: [
      'Lie flat on back with arms down by sides.',
      'Raise one leg vertically to 90 degrees with straight knee.',
      'Hover the opposite leg a few inches off the floor.',
      'Pin lower back into the mat using lower abdominal force.',
      'Hold position and switch legs.',
    ],
    progression: {
      week1: '15-20 sec (each side), 3 sets',
      week2: '25-30 sec (each side), 3 sets',
      week3: '30-45 sec (each side), 3 sets',
    },
    videoId: 'l4kQd9eWcl8',
  },
  {
    id: 'core-chaturanga-hold',
    practiceSetId: 'core-holds',
    title: 'Chaturanga Hold',
    subtitle: 'Develop Upper Body & Core Strength',
    steps: [
      'Start in full plank and shift shoulders forward slightly.',
      'Lower body until elbows bend to exactly 90 degrees.',
      'Keep elbows hugging tightly against ribs.',
      'Engage chest, triceps, anterior deltoids, and core.',
      'Hold hover without letting hips sag.',
    ],
    progression: {
      week1: '10-15 sec, 3 sets',
      week2: '15-20 sec, 3 sets',
      week3: '30-45 sec, 3 sets',
    },
    videoId: 'S32Wp2qP_7A',
  },
  {
    id: 'core-superman-hold',
    practiceSetId: 'core-holds',
    title: 'Superman Hold',
    subtitle: 'Develop Posterior Chain & Core Strength',
    steps: [
      'Lie prone on stomach with arms extended straight overhead.',
      'Simultaneously raise arms, chest, and legs toward ceiling.',
      'Squeeze lower back, erector spinae, and glutes firmly.',
      'Keep head neutral and avoid straining cervical spine.',
      'Hold elevation and breathe evenly.',
    ],
    progression: {
      week1: '15-20 sec, 3 sets',
      week2: '25-30 sec, 3 sets',
      week3: '30-45 sec, 3 sets',
    },
    videoId: 'z6PJMT2y8GQ',
  },
  {
    id: 'core-glute-bridge-hold',
    practiceSetId: 'core-holds',
    title: 'Glute Bridge Hold',
    subtitle: 'Develop Posterior Chain & Hip Strength',
    steps: [
      'Lie on back with knees bent and feet flat hip-width apart.',
      'Drive through heels and lift pelvis toward the ceiling.',
      'Create a straight line from knees down to shoulders.',
      'Squeeze glutes maximally and contract hamstrings.',
      'Hold peak bridge height without hyper-arching lower back.',
    ],
    progression: {
      week1: '15-20 sec, 3 sets',
      week2: '25-30 sec, 3 sets',
      week3: '30-45 sec, 3 sets',
    },
    videoId: '8bbE64NuDtU',
  },
  {
    id: 'core-l-sit-hold',
    practiceSetId: 'core-holds',
    title: 'L-Sit Hold',
    subtitle: 'Build Superior Core Strength & Control',
    steps: [
      'Sit on floor with legs straight out in front.',
      'Place palms flat next to hips, fingers pointing forward.',
      'Press through shoulders to lift hips and legs off the mat.',
      'Keep legs locked straight and parallel to floor (or tuck knees if beginner).',
      'Hold L-shape with maximum abdominal and tricep tension.',
    ],
    progression: {
      week1: '10-15 sec (tuck/assisted), 3 sets',
      week2: '15-20 sec, 3 sets',
      week3: '30-45 sec, 3 sets',
    },
    videoId: 'IUZJoSP66HI',
  },

  // ==========================================
  // POSTURE ALIGNMENT DRILLS
  // ==========================================
  {
    id: 'drill-pelvic-tilt',
    practiceSetId: 'posture-drills',
    title: 'Posterior Pelvic Tilt Drill',
    subtitle: 'Shifting Center of Gravity: Correction #1',
    steps: [
      'Lie on back with feet placed on a chair (knees & hips at 90°).',
      'Place a compressible object (such as a yoga block or ball) between thighs.',
      'Gently dig heels downward into chair and slightly lift tailbone.',
      'Perform with minimal effort and full relaxation—goal is re-education, not strain.',
      'Focus on relaxed, calm nasal breathing without psoas tension.',
    ],
    progression: {
      week1: '1-2 minutes, 2 sets',
      week2: '2-3 minutes, 2 sets',
      week3: '3-4 minutes, 2 sets',
    },
    videoId: 'xP2qZ6r4Yv8',
  },
  {
    id: 'drill-wall-stacking',
    practiceSetId: 'posture-drills',
    title: 'Wall Stacking Drill',
    subtitle: 'Shifting Center of Gravity: Correction #2',
    steps: [
      'Stand with feet hip-width apart with back close to wall.',
      'Place a small ball between thighs to promote subtle internal rotation.',
      'Unlock knees and allow pelvis to touch the wall gently.',
      'Slightly protract shoulders forward (away from spine).',
      'Stack head, rib cage, and pelvis into effortless vertical balance.',
      'Breathe calmly for 10 deep, relaxed diaphragmatic breaths.',
    ],
    progression: {
      week1: '2 sets of 10 breaths',
      week2: '3 sets of 10 breaths',
      week3: '3 sets of 15 breaths',
    },
    videoId: 'y-wV4Venusw',
  },

  // ==========================================
  // FUNDAMENTAL ISOMETRIC HOLDS
  // ==========================================
  {
    id: 'hold-wall-sit',
    practiceSetId: 'fundamental-holds',
    title: 'Wall Sit (Patellar Tendon)',
    subtitle: 'Targets Patellar Tendon (Knee)',
    steps: [
      'Stand against wall and slide down into 90° seated posture.',
      'Keep ankles stacked directly under knees.',
      'Press entire back into the wall with stable spinal alignment.',
      'Feel constant, controlled isometric tension in quadriceps and patellar tendon.',
      'Breathe evenly and maintain position.',
    ],
    progression: {
      week1: '20-30 sec, 3 sets',
      week2: '30-45 sec, 3 sets',
      week3: '45-60 sec, 3 sets',
    },
    videoId: 'y-wV4Venusw',
  },
  {
    id: 'hold-isometric-lunge',
    practiceSetId: 'fundamental-holds',
    title: 'Isometric Lunge Hold',
    subtitle: 'Loads Achilles & Patellar Tendons',
    steps: [
      'Step forward into a deep lunge position with front knee at 90°.',
      'Hover back knee 1-2 inches above the ground.',
      'Drive weight evenly through front foot.',
      'Maintain upright torso and square hips.',
      'Hold statically and repeat on opposite leg.',
    ],
    progression: {
      week1: '10-20 sec (each side), 3 sets',
      week2: '20-30 sec (each side), 3 sets',
      week3: '30-45 sec (each side), 3 sets',
    },
    videoId: '0_P6l02t9e4',
  },
  {
    id: 'hold-heel-raise-hang',
    practiceSetId: 'fundamental-holds',
    title: 'Decompression Dead Hang',
    subtitle: 'Decompresses Shoulders, Elbows & Wrists',
    steps: [
      'Grasp pull-up bar with overhand grip shoulder-width apart.',
      'Hang with arms fully extended and body relaxed.',
      'Allow gravity to gently lengthen spinal vertebrae and decompress shoulders.',
      'Keep feet together or slightly elevated.',
      'Focus on long, rhythmic breathing throughout the hang.',
    ],
    progression: {
      week1: '20-30 sec, 3 sets',
      week2: '30-45 sec, 3 sets',
      week3: '45-65 sec, 3 sets',
    },
    videoId: 'i_y5_tWp_Rk',
  },
  {
    id: 'hold-hip-thrust-floor',
    practiceSetId: 'fundamental-holds',
    title: 'Floor Hip Thrust Hold',
    subtitle: 'Engages Glutes & Protects Lower Back',
    steps: [
      'Lie flat on back with knees bent and heels planted.',
      'Drive hips up until thighs and abdomen form an unbroken line.',
      'Hard squeeze in glutes at top of extension.',
      'Keep ribs pulled down to avoid arching lumbar spine.',
      'Hold static extension with diaphragmatic breathing.',
    ],
    progression: {
      week1: '20-30 sec, 3 sets',
      week2: '30-45 sec, 3 sets',
      week3: '45-60 sec, 3 sets',
    },
    videoId: '8bbE64NuDtU',
  },
  {
    id: 'hold-hip-thrust-bench',
    practiceSetId: 'fundamental-holds',
    title: 'Bench Hip Thrust Hold',
    subtitle: 'Deep Glute Activation & Hip Extension',
    steps: [
      'Set upper back across sturdy bench, feet flat on floor.',
      'Push through heels to drive hips to horizontal alignment.',
      'Maintain 90-degree bend at knees.',
      'Squeeze glutes with maximum voluntary contraction.',
      'Hold peak isometric hold steady.',
    ],
    progression: {
      week1: '20-30 sec, 3 sets',
      week2: '30-45 sec, 3 sets',
      week3: '45-60 sec, 3 sets',
    },
    videoId: 'LM8XHLYJoYs',
  },
  {
    id: 'hold-chin-up',
    practiceSetId: 'fundamental-holds',
    title: 'Chin-Up Isometric Hold',
    subtitle: 'Loads Biceps, Lats & Shoulders',
    steps: [
      'Use supinated (underhand) grip on pull-up bar.',
      'Pull chest up until chin clears the bar.',
      'Retract scapulae down and back, holding chest close to bar.',
      'Squeeze lats, biceps, and upper back firmly.',
      'Maintain top contraction with braced core (use assistance band if needed).',
    ],
    progression: {
      week1: '10-15 sec, 3 sets',
      week2: '15-20 sec, 3 sets',
      week3: '20-30 sec, 3 sets',
    },
    videoId: 'brhRXlOhsAM',
  },

  // ==========================================
  // SAMURAI CONDITIONING HOLDS
  // ==========================================
  {
    id: 'samurai-horse-stance',
    practiceSetId: 'samurai-holds',
    title: 'Horse Stance (Kiba-Dachi)',
    subtitle: 'Rooted Lower Body Tension',
    steps: [
      'Take wide stance (twice shoulder width), feet parallel.',
      'Sink hips low into a deep rooted base.',
      'Extend arms outward to generate horizontal tension.',
      'Keep chest elevated, spine vertical, and gaze forward.',
      'Breathe calmly through warrior stance.',
    ],
    progression: {
      week1: '20-30 sec, 3 sets',
      week2: '30-45 sec, 3 sets',
      week3: '45-60 sec, 3 sets',
    },
    videoId: 'QjD38Q08i2U',
  },
  {
    id: 'samurai-deep-squat',
    practiceSetId: 'samurai-holds',
    title: 'Deep Squat Hold (Kokutsu-Dachi)',
    subtitle: 'Hip Mobility & Pelvic Floor Engagement',
    steps: [
      'Lower into maximum hip depth with heels rooted.',
      'Maintain vertical upright torso.',
      'Open knees outwards in line with toes.',
      'Engage pelvic floor and lower core stabilizers.',
      'Hold deep stillness and breathe steadily.',
    ],
    progression: {
      week1: '20-30 sec, 3 sets',
      week2: '30-45 sec, 3 sets',
      week3: '45-60 sec, 3 sets',
    },
    videoId: '7XwKnk16Zbs',
  },
  {
    id: 'samurai-wall-sit',
    practiceSetId: 'samurai-holds',
    title: 'Samurai Wall Sit',
    subtitle: 'Quad Tension & Hormonal Rebound',
    steps: [
      'Place back flush against wall, sinking into 90° knee angle.',
      'Keep knees tracked over mid-foot.',
      'Relax shoulders and hands while maintaining fierce quad tension.',
      'Breathe through nasal diaphragm to cultivate mental composure.',
      'Hold until time elapsed.',
    ],
    progression: {
      week1: '25-35 sec, 3 sets',
      week2: '35-50 sec, 3 sets',
      week3: '50-70 sec, 3 sets',
    },
    videoId: 'y-wV4Venusw',
  },
  {
    id: 'samurai-high-plank',
    practiceSetId: 'samurai-holds',
    title: 'Samurai High Plank',
    subtitle: 'Core Stability & Cortisol Regulation',
    steps: [
      'Place hands firmly under shoulders with fingers spread.',
      'Form an unyielding straight line from crown of head to heels.',
      'Push floor away to fully engage serratus anterior.',
      'Slow your breath rate to down-regulate stress while holding high tension.',
      'Hold with total body rigidity.',
    ],
    progression: {
      week1: '25-35 sec, 3 sets',
      week2: '35-50 sec, 3 sets',
      week3: '50-75 sec, 3 sets',
    },
    videoId: 'pSHjTRCQxIw',
  },
  {
    id: 'samurai-warrior-lunge',
    practiceSetId: 'samurai-holds',
    title: 'Warrior Lunge Hold',
    subtitle: 'Releases Hip Flexors & Corrects Pelvic Tilt',
    steps: [
      'Step into an elongated warrior lunge.',
      'Front knee bent to 90 degrees, back leg fully straight and active.',
      'Maintain neutral pelvis to open posterior hip flexor.',
      'Keep torso upright and chest open.',
      'Hold deep isometric stretch and switch sides.',
    ],
    progression: {
      week1: '15-20 sec (each side), 3 sets',
      week2: '25-30 sec (each side), 3 sets',
      week3: '35-45 sec (each side), 3 sets',
    },
    videoId: '0_P6l02t9e4',
  },
  {
    id: 'samurai-hollow-body',
    practiceSetId: 'samurai-holds',
    title: 'Samurai Hollow Body Hold',
    subtitle: 'Transverse Abdominis & Spinal Decompression',
    steps: [
      'Lie on back and stretch arms overhead in streamlined alignment.',
      'Glue lower back completely flat against the mat.',
      'Raise legs and upper back into shallow curved hollow position.',
      'Maintain absolute stillness and lock abdominal cylinder.',
      'Hold with steady, controlled breaths.',
    ],
    progression: {
      week1: '20-30 sec, 3 sets',
      week2: '30-45 sec, 3 sets',
      week3: '45-60 sec, 3 sets',
    },
    videoId: 'LlDNef_Ztsc',
  },
  {
    id: 'samurai-glute-bridge',
    practiceSetId: 'samurai-holds',
    title: 'Samurai Glute Bridge Hold',
    subtitle: 'Lumbar Decompression & Pelvic Alignment',
    steps: [
      'Lie flat on back with knees bent and feet planted.',
      'Elevate hips to establish a clean spinal decompression line.',
      'Lock tension at pelvic decompression point by squeezing glutes.',
      'Support neutral lumbar alignment without excessive arching.',
      'Hold and breathe calmly.',
    ],
    progression: {
      week1: '25-35 sec, 3 sets',
      week2: '35-50 sec, 3 sets',
      week3: '50-70 sec, 3 sets',
    },
    videoId: '8bbE64NuDtU',
  },
];

export const getExercisesForSet = (
  setId: string,
  customSets: PracticeSet[] = []
): Exercise[] => {
  const allSets = [...practiceSets, ...customSets];
  const set = allSets.find((s) => s.id === setId);
  if (!set) return [];
  const exerciseMap = new Map(exercises.map((ex) => [ex.id, ex]));
  return set.exerciseIds
    .map((id) => exerciseMap.get(id))
    .filter((ex): ex is Exercise => Boolean(ex));
};

