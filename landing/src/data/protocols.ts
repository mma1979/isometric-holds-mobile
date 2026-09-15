export interface ProtocolExercise {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  defaultDuration: number; // seconds
  targetMuscles: string[];
  image: string;
  description: string;
  cue: string;
}

export interface TrainingProtocol {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  color: string;
  gradient: string;
  description: string;
  exerciseCount: number;
  exercises: ProtocolExercise[];
}

export const PROTOCOLS: TrainingProtocol[] = [
  {
    id: 'shaolin-holds',
    title: 'Shaolin Holds',
    subtitle: 'Ancient Isometric Mastery',
    tag: 'Tendon Strength & Mental Focus',
    color: '#eab308',
    gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    description:
      'The foundational 6 isometric postures designed to forge immense tendon stiffness, unwavering core stability, and meditative mental stillness under physical burn.',
    exerciseCount: 6,
    exercises: [
      {
        id: 'iron-bridge',
        name: 'Iron Bridge',
        category: 'Shaolin Holds',
        subtitle: 'Glute & Posterior Chain Lock',
        defaultDuration: 45,
        targetMuscles: ['Glutes', 'Hamstrings', 'Lower Back', 'Core'],
        image: './images/shaolen/1-iron-bridge.webp',
        description: 'Lie on your back, lift your pelvis until hips and thighs align, driving hard through the heels.',
        cue: 'Squeeze glutes maximally at apex; maintain a neutral cervical spine.',
      },
      {
        id: 'wall-sit',
        name: 'Iron Wall Sit',
        category: 'Shaolin Holds',
        subtitle: 'Quadriceps & Patellar Tendon Armor',
        defaultDuration: 60,
        targetMuscles: ['Quadriceps', 'Glutes', 'Calves', 'Core'],
        image: './images/shaolen/2-wall-set.webp',
        description: 'Back flush against the wall, slide down until thighs are parallel to the floor at 90 degrees.',
        cue: 'Press heels firmly into the floor; resist the temptation to rest hands on thighs.',
      },
      {
        id: 'bear-crawl-hold',
        name: 'Bear Crawl Hold',
        category: 'Shaolin Holds',
        subtitle: 'Quadruped Core Tension',
        defaultDuration: 40,
        targetMuscles: ['Deep Core', 'Shoulders', 'Quads', 'Serratus'],
        image: './images/shaolen/3-bear-crawl.webp',
        description: 'Hands and knees on floor, elevate knees just 1–2 inches off the ground, forming a flat table top.',
        cue: 'Push floor away actively to flare your shoulder blades; do not allow knees to flare.',
      },
      {
        id: 'horse-stance',
        name: 'Horse Stance (Ma Bu)',
        category: 'Shaolin Holds',
        subtitle: 'Ancient Martial Rooting',
        defaultDuration: 60,
        targetMuscles: ['Adductors', 'Quads', 'Glutes', 'Pelvic Floor'],
        image: './images/shaolen/4-horse-stance.webp',
        description: 'Wide stance, feet parallel, sink deep into hips keeping upright spine and calm diaphragmatic breathing.',
        cue: 'Sink the pelvis; breathe deeply into the lower dantian (lower belly).',
      },
      {
        id: 'hollow-body-hold',
        name: 'Hollow Body Hold',
        category: 'Shaolin Holds',
        subtitle: 'Gymnastic Midline Compression',
        defaultDuration: 45,
        targetMuscles: ['Rectus Abdominis', 'Transverse Abdominis', 'Hip Flexors'],
        image: './images/shaolen/5-hollow-body.webp',
        description: 'Lie supine, press lower spine firmly into ground, lift shoulder blades and pointed feet simultaneously.',
        cue: 'Absolute zero gap between your lower back and the ground.',
      },
      {
        id: 'bottom-push-up-hold',
        name: 'Bottom Push-Up Hold',
        category: 'Shaolin Holds',
        subtitle: 'Pectoral & Tricep Static Tension',
        defaultDuration: 30,
        targetMuscles: ['Pectorals', 'Triceps', 'Anterior Delts', 'Core'],
        image: './images/shaolen/6-bottom-push-up.webp',
        description: 'Lower to bottom position of push-up (chest 2 inches above ground) and freeze motionless.',
        cue: 'Keep elbows tucked at 45 degrees; maintain rigid straight plank from head to heels.',
      },
    ],
  },
  {
    id: 'core-holds',
    title: 'Core Holds',
    subtitle: 'Deep Abdominal & Spine Stability',
    tag: 'Anti-Rotational Armor',
    color: '#3b82f6',
    gradient: 'from-blue-500/20 via-sky-500/10 to-transparent',
    description:
      '11 targeted isometric core postures designed to activate the deep transverse abdominis, decompress the lumbar spine, and correct pelvic alignment.',
    exerciseCount: 11,
    exercises: [
      {
        id: 'core-forearm-plank',
        name: 'RKC Forearm Plank',
        category: 'Core Holds',
        subtitle: 'Full-Body Tension Generator',
        defaultDuration: 60,
        targetMuscles: ['Transverse Abdominis', 'Shoulders', 'Glutes'],
        image: './images/core/core-01.webp',
        description: 'Forearms on floor, pull elbows toward toes without moving to generate intense isometric contraction.',
        cue: 'Active tension over passive hanging; clamp glutes and core like steel.',
      },
      {
        id: 'core-side-plank',
        name: 'Side Plank Lock',
        category: 'Core Holds',
        subtitle: 'Oblique & Quadratus Lumborum Armor',
        defaultDuration: 45,
        targetMuscles: ['Internal/External Obliques', 'QL', 'Glute Medius'],
        image: './images/core/core-02.webp',
        description: 'Stack feet, rest on single elbow directly beneath shoulder, lift hip to straight diagonal line.',
        cue: 'Elevate bottom hip high away from floor; gaze forward.',
      },
      {
        id: 'core-bird-dog-hold',
        name: 'Bird-Dog Static Hold',
        category: 'Core Holds',
        subtitle: 'Diagonal Posterior Cross-Stabilization',
        defaultDuration: 40,
        targetMuscles: ['Multifidus', 'Erector Spinae', 'Glute Max', 'Shoulders'],
        image: './images/core/core-4.webp',
        description: 'Quadruped position, extend opposite arm forward and opposite leg backward parallel to floor.',
        cue: 'Do not allow pelvis to rotate; imagine balancing a glass of water on your sacrum.',
      },
      {
        id: 'core-dead-bug-hold',
        name: 'Dead Bug Static Hold',
        category: 'Core Holds',
        subtitle: 'Pelvic Neutralizer & Ribcage Clamp',
        defaultDuration: 45,
        targetMuscles: ['Transverse Abdominis', 'Diaphragm', 'Hip Flexors'],
        image: './images/core/core-06.webp',
        description: 'Supine, arms straight up, knees bent at 90 degrees, hold isometric abdominal bracing.',
        cue: 'Breathe into sides and belly while maintaining tight ribcage clamp.',
      },
      {
        id: 'core-superman-hold',
        name: 'Superman Arch Hold',
        category: 'Core Holds',
        subtitle: 'Posterior Extensor Endurance',
        defaultDuration: 35,
        targetMuscles: ['Erector Spinae', 'Upper Back', 'Glutes'],
        image: './images/core/core-09.webp',
        description: 'Lie prone, extend arms and legs, lift chest and thighs simultaneously off floor.',
        cue: 'Think of length rather than excessive height; squeeze shoulder blades.',
      },
      {
        id: 'core-l-sit-hold',
        name: 'L-Sit Hold',
        category: 'Core Holds',
        subtitle: 'Elite Compression & Tricep Depressor',
        defaultDuration: 20,
        targetMuscles: ['Hip Flexors', 'Abdominals', 'Triceps', 'Lats'],
        image: './images/core/core-11.webp',
        description: 'Support hands on floor or parallettes, press shoulders down, lift body and straight legs into an L-shape.',
        cue: 'Depress scapula with maximal force; point toes forward.',
      },
    ],
  },
  {
    id: 'posture-drills',
    title: 'Posture Alignment Drills',
    subtitle: 'Neuromuscular Re-Education',
    tag: 'Corrective & Restorative',
    color: '#22c55e',
    gradient: 'from-emerald-500/20 via-green-500/10 to-transparent',
    description:
      'Targeted neuromuscular corrective holds designed to counteract chronic sitting, release anterior pelvic tilt, and reset natural spinal curvature.',
    exerciseCount: 2,
    exercises: [
      {
        id: 'drill-pelvic-tilt',
        name: 'Pelvic Tilt Floor Hold',
        category: 'Posture Drills',
        subtitle: 'Anterior Tilt Neutralizer',
        defaultDuration: 45,
        targetMuscles: ['Lower Abdominals', 'Glutes', 'Hamstrings'],
        image: './images/drills/drills-01.webp',
        description: 'Supine with knees bent, gently rotate pelvis backward to flatten the lumbar spine completely against floor.',
        cue: 'Maintain smooth nasal breathing; avoid clenching jaw or neck.',
      },
      {
        id: 'drill-wall-stacking',
        name: 'Wall Stacking Alignment',
        category: 'Posture Drills',
        subtitle: 'Axial Spine Elongation',
        defaultDuration: 60,
        targetMuscles: ['Deep Neck Flexors', 'Rhomboids', 'Mid Traps', 'Calves'],
        image: './images/drills/drills-02.webp',
        description: 'Stand with heels, glutes, upper back, and occiput touching wall; chin slightly tucked.',
        cue: 'Tuck chin slightly like making a double chin; breathe down into abdomen.',
      },
    ],
  },
  {
    id: 'fundamental-holds',
    title: 'Fundamental Holds',
    subtitle: 'Tendon Loading & Joint Resilience',
    tag: 'Physical Therapy & Athleticism',
    color: '#f97316',
    gradient: 'from-orange-500/20 via-amber-500/10 to-transparent',
    description:
      'Essential isometric protocols engineered to strengthen patellar and Achilles tendons, stimulate collagen cross-linking, and eliminate knee and hip aches.',
    exerciseCount: 6,
    exercises: [
      {
        id: 'hold-isometric-lunge',
        name: 'Split Squat Isometric Hold',
        category: 'Fundamental Holds',
        subtitle: 'Patellar Tendon & Knee Joint Shield',
        defaultDuration: 45,
        targetMuscles: ['Quads', 'Glutes', 'Hip Flexors', 'Patellar Tendon'],
        image: './images/holds/holds-03.webp',
        description: 'Split stance, lower rear knee 2 inches above ground, front shin vertical at 90 degrees.',
        cue: 'Keep chest high and load evenly through front mid-foot and heel.',
      },
      {
        id: 'hold-heel-raise-hang',
        name: 'Isometric Calf & Heel Raise',
        category: 'Fundamental Holds',
        subtitle: 'Achilles Tendon Stiffness',
        defaultDuration: 45,
        targetMuscles: ['Gastrocnemius', 'Soleus', 'Achilles Tendon', 'Foot Arches'],
        image: './images/holds/holds-04.webp',
        description: 'Elevate onto balls of feet on edge of step or floor, hold high peak contraction.',
        cue: 'Lock ankle angle firmly; push through first and second metatarsals.',
      },
      {
        id: 'hold-chin-up',
        name: 'Chin-Up Top Flex Hold',
        category: 'Fundamental Holds',
        subtitle: 'Upper Body Pulling & Bicep Lock',
        defaultDuration: 25,
        targetMuscles: ['Latissimus Dorsi', 'Biceps', 'Forearms', 'Posterior Delts'],
        image: './images/holds/holds-06.webp',
        description: 'Grip pull-up bar, hold chin securely over bar with chest proud and shoulder blades retracted.',
        cue: 'Drive elbows down and back into back pockets; maintain tight hollow core.',
      },
      {
        id: 'hold-hip-thrust-floor',
        name: 'Single Leg Glute Bridge Hold',
        category: 'Fundamental Holds',
        subtitle: 'Unilateral Hip Extension & Knee Stability',
        defaultDuration: 35,
        targetMuscles: ['Gluteus Maximus', 'Hamstrings', 'Pelvic Stabilizers'],
        image: './images/holds/holds-05.webp',
        description: 'Drive single heel into floor, extend opposite leg, lock hips level in peak bridge.',
        cue: 'Do not hyperextend lumbar spine; generate 100% of force through the working glute.',
      },
    ],
  },
  {
    id: 'samurai-holds',
    title: 'Samurai Holds',
    subtitle: 'Sustained Tension Protocol',
    tag: 'Martial Conditioning & Grit',
    color: '#ec4899',
    gradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
    description:
      'Traditional martial endurance stances focusing on sustained deep muscular tension, hormonal optimization, and psychological mastery over the urge to quit.',
    exerciseCount: 7,
    exercises: [
      {
        id: 'samurai-horse-stance',
        name: 'Kiba Dachi (Samurai Stance)',
        category: 'Samurai Holds',
        subtitle: 'Deep Horse Stance with Postural Tension',
        defaultDuration: 60,
        targetMuscles: ['Quads', 'Inner Thighs', 'Spinal Erectors'],
        image: './images/samurai/samurai-02.webp',
        description: 'Deep wide squat stance, knees forced outwards, fists clenched at ribs, gaze focused forward.',
        cue: 'Embrace the burn; keep breath slow, quiet, and deliberate through the nose.',
      },
      {
        id: 'samurai-deep-squat',
        name: 'Deep Squat Rest Hold',
        category: 'Samurai Holds',
        subtitle: 'Ankle & Hip Mobility Anchor',
        defaultDuration: 60,
        targetMuscles: ['Hip Capsules', 'Ankles', 'Groin', 'Lower Back'],
        image: './images/samurai/samurai-03.webp',
        description: 'Full deep squat, chest upright, elbows lightly pressing inside knees to open hips.',
        cue: 'Keep heels flat on ground; let spine decompress naturally.',
      },
      {
        id: 'samurai-warrior-lunge',
        name: 'Warrior Low Lunge Lock',
        category: 'Samurai Holds',
        subtitle: 'Psoas & Quad Stretch-Under-Load',
        defaultDuration: 45,
        targetMuscles: ['Psoas', 'Rectus Femoris', 'Adductors', 'Glute Max'],
        image: './images/samurai/samurai--6.webp',
        description: 'Deep elongated lunge, sink hips low toward floor while maintaining upright sternum.',
        cue: 'Squeeze back glute to deepen the reciprocal relaxation of the front hip flexor.',
      },
    ],
  },
];

export const SCIENCE_PILLARS = [
  {
    id: 'recruitment',
    title: 'Max Motor Unit Recruitment',
    stat: '+5% Higher',
    statLabel: 'than dynamic lifts',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    description:
      'EMG studies prove that maximal voluntary isometric contractions recruit up to 5% more high-threshold motor units than concentric or eccentric lifting, awakening stubborn deep muscle fibers.',
  },
  {
    id: 'tendons',
    title: 'Tendon & Joint Shield',
    stat: 'Zero Wear',
    statLabel: 'on cartilage & joints',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    description:
      'Static tension loads collagen fibers without grinding articulating surfaces. This triggers tenocyte cellular signaling, thickening tendons and alleviating chronic patellar and elbow tendonitis.',
  },
  {
    id: 'vascular',
    title: 'Blood Pressure Reduction',
    stat: '-8 to -12 mmHg',
    statLabel: 'resting BP clinical drop',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    description:
      'Isometric training triggers reactive hyperemia. When muscles unclamp, nitric oxide surges through vessels, relaxing arterial walls. Peer-reviewed meta-analyses rank isometrics as the #1 non-pharmacological blood pressure intervention.',
  },
  {
    id: 'mental',
    title: 'Parasympathetic Discipline',
    stat: 'Vagus Nerve',
    statLabel: 'neuro-calm activation',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    description:
      'Holding static postures forces you to maintain rhythmic diaphragmatic breathing in the middle of metabolic lactate buildup, training your nervous system to stay cool and unshakeable under stress.',
  },
];

export const APP_FEATURES = [
  {
    title: 'Guided Workout Runner',
    description: 'Hands-free sessions with configurable hold and rest durations, sound beeps, and vibration alerts.',
    icon: 'Play',
  },
  {
    title: 'Precision Stopwatch',
    description: 'One-tap custom practice mode with instantaneous set logging, rep markers, and personal best flags.',
    icon: 'Timer',
  },
  {
    title: 'Synthesized Voice Coaching',
    description: 'Crisp audio cues calling out transitions, countdowns, and encouragement so you never look at your screen.',
    icon: 'Volume2',
  },
  {
    title: 'Form Cues & Visual Guides',
    description: 'Step-by-step posture breakdowns, biomechanical tips, and target muscle highlights for every exercise.',
    icon: 'BookOpen',
  },
  {
    title: 'Custom Routine Builder',
    description: 'Compose your own protocols. Mix Shaolin holds, core drills, and PT stretches into personalized sets.',
    icon: 'Layers',
  },
  {
    title: '100% Offline & Zero Tracking',
    description: 'No account needed, no ads, no telemetry, no cloud sync. All your workout records stay strictly on your device.',
    icon: 'ShieldCheck',
  },
];

export const APK_RELEASES = [
  {
    type: 'ARM64 (Recommended)',
    subtitle: 'Optimized for modern Android phones (Android 9+)',
    filename: 'isometric-holds-v2.3.0-arm64.apk',
    path: './downloads/isometric-holds-v2.3.0-arm64.apk',
    size: '14.5 MB',
    badge: 'Fast & Lightweight',
    recommended: true,
  },
  {
    type: 'Universal APK',
    subtitle: 'Compatible with all Android chipsets (ARMv7, ARM64, x86)',
    filename: 'isometric-holds-v2.3.0-universal.apk',
    path: './downloads/isometric-holds-v2.3.0-universal.apk',
    size: '27.3 MB',
    badge: 'Universal Compatibility',
    recommended: false,
  },
];
