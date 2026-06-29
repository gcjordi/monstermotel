export const $ = (selector) => document.querySelector(selector);

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

let lastFocusedElement = null;
let activeCloseHandler = null;

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

export function createElement(tagName, className, text) {
  const el = document.createElement(tagName);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
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
  openModal(elements, [
    createElement('div', 'giant', '🌙'),
    createRow(
      createElement('div', 'bubble', `🪙${signed(earned)}`),
      createElement('div', 'bubble', `⭐${signed(stars)}`),
      createElement('div', 'bubble', `🌪️${signed(chaos)}`),
    ),
    createRow(createButton('☀️', () => closeModal(elements))),
  ]);
}

export function showGameOver(elements, state, onAgain) {
  setTimeout(() => {
    openModal(elements, [
      createElement('div', 'giant', '🏨💫'),
      createRow(
        createElement('div', 'bubble', `☀️${state.day}`),
        createElement('div', 'bubble', `🪙${state.coins}`),
        createElement('div', 'bubble', `⭐${state.stars}`),
      ),
      createRow(createButton('🔄', () => {
        closeModal(elements);
        onAgain();
      })),
    ], { closeOnEscape: false });
  }, 250);
}

export function showHelp(elements, features) {
  const help = createElement('div', 'help');
  [
    '👾 ➡️ 🛏️',
    `✅ ${Object.values(features).slice(0, 4).map((f) => f.icon).join(' ')}`,
    '🚫 🪞 🔌 🔥 💡',
    '🌙 ➡️ 🪙 ⭐',
    '🌪️ ➡️ 😭',
  ].forEach((line) => help.appendChild(createElement('div', 'helpLine', line)));

  openModal(elements, [
    createElement('div', 'giant', '🏨👾'),
    help,
    createRow(createButton('▶️', () => closeModal(elements))),
  ]);
}

function signed(value) {
  return `${value >= 0 ? '+' : ''}${value}`;
}

function createRow(...children) {
  const row = createElement('div', 'row');
  children.forEach((child) => row.appendChild(child));
  return row;
}

function createButton(text, onClick) {
  const button = createElement('button', 'btn', text);
  button.type = 'button';
  button.addEventListener('click', onClick);
  return button;
}

function openModal(elements, children, options = {}) {
  closeModal(elements, { restoreFocus: false });
  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  elements.modal.textContent = '';
  children.forEach((child) => elements.modal.appendChild(child));
  elements.overlay.hidden = false;
  elements.overlay.style.display = 'flex';

  const closeOnEscape = options.closeOnEscape !== false;
  activeCloseHandler = (event) => {
    if (event.key === 'Escape' && closeOnEscape) {
      event.preventDefault();
      closeModal(elements);
      return;
    }
    if (event.key === 'Tab') trapFocus(event, elements.modal);
  };
  document.addEventListener('keydown', activeCloseHandler);

  const firstFocusable = elements.modal.querySelector(FOCUSABLE_SELECTOR);
  (firstFocusable || elements.modal).focus();
}

function closeModal(elements, options = {}) {
  if (activeCloseHandler) {
    document.removeEventListener('keydown', activeCloseHandler);
    activeCloseHandler = null;
  }
  elements.overlay.hidden = true;
  elements.overlay.style.display = 'none';
  if (options.restoreFocus === false) return;
  if (lastFocusedElement && document.contains(lastFocusedElement)) lastFocusedElement.focus();
  lastFocusedElement = null;
}

function trapFocus(event, modal) {
  const focusable = Array.from(modal.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => !el.disabled);
  if (!focusable.length) {
    event.preventDefault();
    modal.focus();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
