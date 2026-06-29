export const STORAGE_KEY = 'monster-motel-v1';

function getDefaultStorage() {
  try {
    return window.localStorage;
  } catch (error) {
    return null;
  }
}

export function saveState(state, storage = getDefaultStorage()) {
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // Some private browsing or embedded-browser modes disable localStorage.
  }
}

export function loadState(storage = getDefaultStorage()) {
  if (!storage) return null;

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch (removeError) {
      // Ignore cleanup failures in restricted embedded browsers.
    }
    return null;
  }
}
