import { createAudio } from './audio.js';
import { FEATURES, SHOP } from './data.js';
import { bindControls } from './input.js';
import { defaultState, fillQueue, fitEmoji, isValidState, randomEvent, scoreFit } from './game-state.js';
import { loadState, saveState } from './persistence.js';
import { render } from './rendering.js';
import { getElements, showGameOver, showHelp, showSummary, toast } from './ui.js';

const elements = getElements();
const audio = createAudio();
const selection = {
  selectedGuest: null,
  selectedUpgrade: null,
};

let state;

function fresh() {
  state = defaultState();
  fillQueue(state);
  saveState(state);
  renderAll();
  showHelp(elements, FEATURES);
}

function load() {
  state = loadState();

  if (!isValidState(state)) {
    fresh();
    return;
  }

  fillQueue(state, false);
  renderAll();
}

function renderAll() {
  render(elements, state, selection, {
    onRoomClick: roomClick,
    onGuestClick: guestClick,
    onShopClick: shopClick,
  });
  saveState(state);
}

function guestClick(guest) {
  selection.selectedGuest = selection.selectedGuest && selection.selectedGuest.uid === guest.uid ? null : guest;
  selection.selectedUpgrade = null;
  renderAll();
}

function shopClick(feature) {
  selection.selectedUpgrade = selection.selectedUpgrade === feature ? null : feature;
  selection.selectedGuest = null;
  renderAll();
  toast('🛒➡️🛏️', audio);
}

function roomClick(id) {
  const room = state.rooms.find((r) => r.id === id);
  if (!room) return;

  if (selection.selectedGuest) {
    if (room.guest) {
      toast('🚫', audio);
      return;
    }
    room.guest = selection.selectedGuest;
    state.queue = state.queue.filter((g) => g.uid !== selection.selectedGuest.uid);
    selection.selectedGuest = null;
    toast('👾➡️🛏️', audio);
    renderAll();
    return;
  }

  if (selection.selectedUpgrade) {
    const item = SHOP.find((s) => s.feature === selection.selectedUpgrade);
    if (!item || state.coins < item.cost || room.features.includes(selection.selectedUpgrade)) {
      toast('🚫', audio);
      return;
    }
    state.coins -= item.cost;
    room.features.push(selection.selectedUpgrade);
    selection.selectedUpgrade = null;
    toast('🛠️✨', audio);
    renderAll();
    return;
  }

  if (room.guest) {
    state.queue.push(room.guest);
    room.guest = null;
    toast('👾↩️', audio);
    renderAll();
  }
}

function passNight() {
  let earned = 0;
  let chaosDelta = 0;
  let starDelta = 0;
  const lines = [];

  state.rooms.forEach((room) => {
    if (!room.guest) return;

    const guest = room.guest;
    const sc = scoreFit(guest, room);
    if (sc >= 4) {
      earned += guest.pay + 12;
      starDelta += 1;
      lines.push(`${guest.icon} ${fitEmoji(sc)} 🪙✨`);
    } else if (sc >= 2) {
      earned += guest.pay;
      lines.push(`${guest.icon} ${fitEmoji(sc)} 🪙`);
    } else if (sc >= 0) {
      earned += Math.max(8, Math.floor(guest.pay * 0.55));
      chaosDelta += guest.chaos;
      lines.push(`${guest.icon} ${fitEmoji(sc)} 🌪️`);
    } else {
      earned += Math.max(0, Math.floor(guest.pay * 0.18));
      chaosDelta += guest.chaos + 2;
      starDelta -= 1;
      lines.push(`${guest.icon} ${fitEmoji(sc)} 💥`);
    }
    room.guest = null;
  });

  const event = randomEvent();
  earned += event.coins;
  chaosDelta += event.chaos;
  starDelta += event.stars;
  if (event.icon) lines.push(event.icon);

  state.coins = Math.max(0, state.coins + earned - Math.max(0, chaosDelta - 3) * 3);
  state.chaos = Math.max(0, state.chaos + chaosDelta - 1);
  state.stars = Math.max(0, Math.min(5, state.stars + starDelta));
  state.day += 1;
  state.log = lines.slice(-5);
  selection.selectedGuest = null;
  selection.selectedUpgrade = null;
  fillQueue(state, true);
  renderAll();
  showSummary(elements, earned, starDelta, chaosDelta);
  if (state.chaos >= 12 || state.stars <= 0) showGameOver(elements, state, fresh);
}

bindControls(elements, {
  onNight: passNight,
  onReset: fresh,
  onHelp: () => showHelp(elements, FEATURES),
});

load();
