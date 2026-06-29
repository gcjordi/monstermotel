export const $ = (selector) => document.querySelector(selector);

export function getElements() {
  return {
    roomsEl: $('#rooms'),
    queueEl: $('#queue'),
    shopEl: $('#shop'),
    eventsEl: $('#events'),
    dayEl: $('#day'),
    coinsEl: $('#coins'),
    starsEl: $('#stars'),
    chaosEl: $('#chaos'),
    overlay: $('#overlay'),
    modal: $('#modal'),
    nightBtn: $('#nightBtn'),
    resetBtn: $('#resetBtn'),
    helpBtn: $('#helpBtn'),
  };
}

export function createEvent(message) {
  const el = document.createElement('div');
  el.className = 'event';
  el.textContent = message;
  return el;
}

export function toast(msg, audio) {
  if (audio) audio.feedback(msg);
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => {
    if (t.parentNode) t.parentNode.removeChild(t);
  }, 1200);
}

export function showSummary(elements, earned, stars, chaos) {
  elements.overlay.style.display = 'flex';
  elements.modal.innerHTML = `<div class="giant">🌙</div><div class="row"><div class="bubble">🪙${earned >= 0 ? '+' : ''}${earned}</div><div class="bubble">⭐${stars >= 0 ? '+' : ''}${stars}</div><div class="bubble">🌪️${chaos >= 0 ? '+' : ''}${chaos}</div></div><div class="row"><button class="btn" id="okBtn" type="button">☀️</button></div>`;
  $('#okBtn').addEventListener('click', () => {
    elements.overlay.style.display = 'none';
  });
}

export function showGameOver(elements, state, onAgain) {
  setTimeout(() => {
    elements.overlay.style.display = 'flex';
    elements.modal.innerHTML = `<div class="giant">🏨💫</div><div class="row"><div class="bubble">☀️${state.day}</div><div class="bubble">🪙${state.coins}</div><div class="bubble">⭐${state.stars}</div></div><div class="row"><button class="btn" id="againBtn" type="button">🔄</button></div>`;
    $('#againBtn').addEventListener('click', () => {
      elements.overlay.style.display = 'none';
      onAgain();
    });
  }, 250);
}

export function showHelp(elements, features) {
  elements.overlay.style.display = 'flex';
  elements.modal.innerHTML = `<div class="giant">🏨👾</div><div class="help"><div class="helpLine">👾 ➡️ 🛏️</div><div class="helpLine">✅ ${Object.values(features).slice(0, 4).map((f) => f.icon).join(' ')}</div><div class="helpLine">🚫 🪞 🔌 🔥 💡</div><div class="helpLine">🌙 ➡️ 🪙 ⭐</div><div class="helpLine">🌪️ ➡️ 😭</div></div><div class="row"><button class="btn" id="playBtn" type="button">▶️</button></div>`;
  $('#playBtn').addEventListener('click', () => {
    elements.overlay.style.display = 'none';
  });
}
