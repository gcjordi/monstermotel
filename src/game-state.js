import { FEATURES, MONSTERS, RANDOM_EVENTS } from './data.js';
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
  if (!value || typeof value !== 'object') return false;
  if (!isSafeInteger(value.day, 1, 9999)) return false;
  if (!isSafeInteger(value.coins, 0, 999999)) return false;
  if (!isSafeInteger(value.stars, 0, 5)) return false;
  if (!isSafeInteger(value.chaos, 0, 9999)) return false;
  if (!Array.isArray(value.rooms) || value.rooms.length !== defaultState().rooms.length) return false;
  if (!Array.isArray(value.queue) || value.queue.length > 12) return false;
  if (!Array.isArray(value.log) || value.log.length > 20) return false;

  const roomIds = new Set();
  if (!value.rooms.every((room) => isValidRoom(room, roomIds))) return false;
  if (!value.queue.every(isValidGuest)) return false;
  if (!value.log.every((line) => typeof line === 'string' && line.length <= 32)) return false;

  return true;
}

function isSafeInteger(value, min, max) {
  return Number.isSafeInteger(value) && value >= min && value <= max;
}

function isValidFeature(feature) {
  return Object.prototype.hasOwnProperty.call(FEATURES, feature);
}

function isValidGuest(guest) {
  if (!guest || typeof guest !== 'object') return false;
  if (typeof guest.uid !== 'string' || guest.uid.length > 80) return false;

  return MONSTERS.some((monster) => (
    guest.icon === monster.icon
      && guest.pay === monster.pay
      && guest.chaos === monster.chaos
      && sameFeatures(guest.wants, monster.wants)
      && sameFeatures(guest.hates, monster.hates)
  ));
}

function isValidRoom(room, roomIds) {
  if (!room || typeof room !== 'object') return false;
  if (!isSafeInteger(room.id, 1, 99) || roomIds.has(room.id)) return false;
  roomIds.add(room.id);
  return Boolean(
    Array.isArray(room.features)
      && room.features.length <= Object.keys(FEATURES).length
      && new Set(room.features).size === room.features.length
      && room.features.every(isValidFeature)
      && (room.guest === null || isValidGuest(room.guest)),
  );
}

function sameFeatures(value, expected) {
  return Array.isArray(value)
    && value.length === expected.length
    && value.every((feature, index) => feature === expected[index]);
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
