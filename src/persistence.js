export const STORAGE_KEY = 'monster-motel-v1';

export function saveState(state, storage = window.localStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // Some private browsing or embedded-browser modes disable localStorage.
  }
}

export function loadState(storage = window.localStorage) {
  try {
    return JSON.parse(storage.getItem(STORAGE_KEY));
  } catch (error) {
    return null;
  }
}
