import { MONSTERS, RANDOM_EVENTS } from './data.js';
import { clone, rnd, randomUint32 } from './utils.js';

export function defaultState() {
  return {
    day: 1,
    coins: 80,
    stars: 3,
    chaos: 0,
    rooms: [
      { id: 1, features: ['dark'], guest: null },
      { id: 2, features: ['plug'], guest: null },
      { id: 3, features: ['quiet'], guest: null },
      { id: 4, features: ['mirror'], guest: null },
      { id: 5, features: ['bath'], guest: null },
      { id: 6, features: ['cold'], guest: null },
    ],
    queue: [],
    log: [],
  };
}

export function isValidState(value) {
  return Boolean(
    value
      && Number.isFinite(value.day)
      && Number.isFinite(value.coins)
      && Number.isFinite(value.stars)
      && Number.isFinite(value.chaos)
      && Array.isArray(value.rooms)
      && Array.isArray(value.queue)
      && Array.isArray(value.log),
  );
}

export function fillQueue(state, force = true) {
  if (!force && state.queue && state.queue.length) return;

  const n = Math.min(3 + Math.floor(state.day / 3), 5);
  state.queue = Array.from({ length: n }, (_, i) => ({
    ...clone(rnd(MONSTERS)),
    uid: `${Date.now()}-${i}-${randomUint32()}`,
  }));
}

export function scoreFit(monster, room) {
  const wants = monster.wants.filter((w) => room.features.includes(w)).length;
  const hates = monster.hates.filter((h) => room.features.includes(h)).length;
  let score = wants * 2 - hates * 3;
  if (room.guest) score -= 99;
  return score;
}

export function fitEmoji(score) {
  return score >= 4 ? '😍' : score >= 2 ? '😊' : score >= 0 ? '😐' : '😭';
}

export function randomEvent() {
  return rnd(RANDOM_EVENTS);
}
