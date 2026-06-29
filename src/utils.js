export function rnd(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
