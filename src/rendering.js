import { FEATURES, MAX_LOG_LINES, SHOP } from './data.js';
import { createEvent } from './ui.js';
import { fitEmoji, scoreFit } from './game-state.js';

export function render(elements, state, selection, handlers) {
  elements.dayEl.textContent = state.day;
  elements.coinsEl.textContent = state.coins;
  elements.starsEl.textContent = state.stars;
  elements.chaosEl.textContent = state.chaos;

  renderRooms(elements.roomsEl, state, selection, handlers);
  renderQueue(elements.queueEl, state, selection, handlers);
  renderShop(elements.shopEl, state, selection, handlers);
  renderEvents(elements.eventsEl, state);

  elements.nightBtn.disabled = !state.rooms.some((r) => r.guest);
}

function renderRooms(roomsEl, state, selection, handlers) {
  roomsEl.textContent = '';
  state.rooms.forEach((room) => {
    const el = document.createElement('button');
    el.className = `room${room.guest ? ' occupied' : ''}`;
    el.type = 'button';
    el.setAttribute('aria-label', `room ${room.id}`);

    if (selection.selectedGuest && !room.guest) {
      const sc = scoreFit(selection.selectedGuest, room);
      el.classList.add(sc >= 0 ? 'compat' : 'badfit');
    }

    el.innerHTML = `<div class="roomNo">${room.id}</div><div class="guest">${room.guest ? room.guest.icon : '🛏️'}</div><div class="features">${room.features.map((f) => `<span class="feature">${FEATURES[f].icon}</span>`).join('')}</div><div class="roomScore">${selection.selectedGuest && !room.guest ? fitEmoji(scoreFit(selection.selectedGuest, room)) : ''}</div>`;
    el.addEventListener('click', () => handlers.onRoomClick(room.id));
    roomsEl.appendChild(el);
  });
}

function renderQueue(queueEl, state, selection, handlers) {
  queueEl.textContent = '';
  state.queue.forEach((g) => {
    const el = document.createElement('button');
    el.className = `card${selection.selectedGuest && selection.selectedGuest.uid === g.uid ? ' selected' : ''}`;
    el.type = 'button';
    el.setAttribute('aria-label', 'guest');
    el.innerHTML = `<div class="monster">${g.icon}</div><div class="needs">${g.wants.map((w) => `<span class="need">${FEATURES[w].icon}</span>`).join('')} ${g.hates.map((h) => `<span class="need hate">🚫${FEATURES[h].icon}</span>`).join('')}</div><div class="pay">🪙${g.pay}</div>`;
    el.addEventListener('click', () => handlers.onGuestClick(g));
    queueEl.appendChild(el);
  });
}

function renderShop(shopEl, state, selection, handlers) {
  shopEl.textContent = '';
  SHOP.forEach((item) => {
    const el = document.createElement('button');
    el.className = `shopItem${selection.selectedUpgrade === item.feature ? ' selected' : ''}`;
    el.type = 'button';
    el.disabled = state.coins < item.cost;
    el.innerHTML = `<span class="left">${FEATURES[item.feature].icon}</span><span class="cost">🪙${item.cost}</span>`;
    el.addEventListener('click', () => handlers.onShopClick(item.feature));
    shopEl.appendChild(el);
  });
}

function renderEvents(eventsEl, state) {
  const log = (state.log || []).slice(-MAX_LOG_LINES).reverse();
  eventsEl.textContent = '';

  if (!log.length) {
    eventsEl.appendChild(createEvent('👾➡️🛏️'));
    return;
  }

  log.forEach((event) => eventsEl.appendChild(createEvent(event)));
}
