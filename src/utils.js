const UINT32_MAX_PLUS_ONE = 0x100000000;
let fallbackState = 0;

function getCrypto() {
  return globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function'
    ? globalThis.crypto
    : null;
}

function fallbackUint32() {
  if (!fallbackState) {
    const time = Date.now() >>> 0;
    const perf = typeof performance !== 'undefined' && Number.isFinite(performance.now())
      ? Math.floor(performance.now() * 1000) >>> 0
      : 0;
    fallbackState = (time ^ perf ^ 0x9e3779b9) >>> 0;
  }

  fallbackState ^= fallbackState << 13;
  fallbackState ^= fallbackState >>> 17;
  fallbackState ^= fallbackState << 5;
  return fallbackState >>> 0;
}

export function randomUint32() {
  const crypto = getCrypto();
  if (!crypto) return fallbackUint32();

  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return value[0];
}

export function randomInt(maxExclusive) {
  if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0 || maxExclusive > UINT32_MAX_PLUS_ONE) {
    throw new RangeError('randomInt requires a positive safe integer up to 2^32');
  }

  const limit = UINT32_MAX_PLUS_ONE - (UINT32_MAX_PLUS_ONE % maxExclusive);
  let value;
  do {
    value = randomUint32();
  } while (value >= limit);

  return value % maxExclusive;
}

export function rnd(arr) {
  return arr[randomInt(arr.length)];
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
