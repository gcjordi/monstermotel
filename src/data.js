export const MAX_LOG_LINES = 4;

export const FEATURES = {
  dark: { icon: '🌑' },
  mirror: { icon: '🪞' },
  plug: { icon: '🔌' },
  fireproof: { icon: '🧯' },
  bath: { icon: '🛁' },
  quiet: { icon: '🔇' },
  cold: { icon: '❄️' },
  garden: { icon: '🌿' },
};

export const MONSTERS = [
  { icon: '🧛', wants: ['dark'], hates: ['mirror'], pay: 34, chaos: 1 },
  { icon: '👻', wants: ['dark', 'quiet'], hates: ['plug'], pay: 30, chaos: 1 },
  { icon: '🐺', wants: ['quiet'], hates: ['mirror'], pay: 32, chaos: 2 },
  { icon: '🤖', wants: ['plug'], hates: ['bath'], pay: 36, chaos: 1 },
  { icon: '🐉', wants: ['fireproof'], hates: ['cold'], pay: 45, chaos: 3 },
  { icon: '🐙', wants: ['bath'], hates: ['plug'], pay: 42, chaos: 2 },
  { icon: '🧌', wants: ['garden'], hates: ['quiet'], pay: 28, chaos: 2 },
  { icon: '🦇', wants: ['dark'], hates: ['mirror'], pay: 24, chaos: 1 },
  { icon: '🧊', wants: ['cold'], hates: ['fireproof'], pay: 38, chaos: 1 },
  { icon: '🦄', wants: ['garden', 'quiet'], hates: ['dark'], pay: 44, chaos: 0 },
];

export const SHOP = [
  { feature: 'dark', cost: 28 },
  { feature: 'plug', cost: 30 },
  { feature: 'quiet', cost: 34 },
  { feature: 'fireproof', cost: 38 },
  { feature: 'bath', cost: 36 },
  { feature: 'cold', cost: 32 },
  { feature: 'garden', cost: 35 },
  { feature: 'mirror', cost: 18 },
];

export const RANDOM_EVENTS = [
  { icon: '🍀 🪙+10', coins: 10, chaos: 0, stars: 0 },
  { icon: '🌈 ⭐+1', coins: 0, chaos: 0, stars: 1 },
  { icon: '🧹 🌪️-2', coins: 0, chaos: -2, stars: 0 },
  { icon: '🪲 🌪️+2', coins: 0, chaos: 2, stars: 0 },
  { icon: '🎁 🪙+18', coins: 18, chaos: 0, stars: 0 },
  { icon: '🧯 🌪️-1', coins: 0, chaos: -1, stars: 0 },
  { icon: '', coins: 0, chaos: 0, stars: 0 },
];
