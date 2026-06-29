(() => {
  const $ = s => document.querySelector(s);
  const roomsEl = $('#rooms'), queueEl = $('#queue'), shopEl = $('#shop'), eventsEl = $('#events');
  const dayEl = $('#day'), coinsEl = $('#coins'), starsEl = $('#stars'), chaosEl = $('#chaos');
  const overlay = $('#overlay'), modal = $('#modal');

  const FEATURES = {
    dark:{icon:'🌑'}, mirror:{icon:'🪞'}, plug:{icon:'🔌'}, fireproof:{icon:'🧯'}, bath:{icon:'🛁'}, quiet:{icon:'🔇'}, cold:{icon:'❄️'}, garden:{icon:'🌿'}
  };
  const MONSTERS = [
    {icon:'🧛', wants:['dark'], hates:['mirror'], pay:34, chaos:1},
    {icon:'👻', wants:['dark','quiet'], hates:['plug'], pay:30, chaos:1},
    {icon:'🐺', wants:['quiet'], hates:['mirror'], pay:32, chaos:2},
    {icon:'🤖', wants:['plug'], hates:['bath'], pay:36, chaos:1},
    {icon:'🐉', wants:['fireproof'], hates:['cold'], pay:45, chaos:3},
    {icon:'🐙', wants:['bath'], hates:['plug'], pay:42, chaos:2},
    {icon:'🧌', wants:['garden'], hates:['quiet'], pay:28, chaos:2},
    {icon:'🦇', wants:['dark'], hates:['mirror'], pay:24, chaos:1},
    {icon:'🧊', wants:['cold'], hates:['fireproof'], pay:38, chaos:1},
    {icon:'🦄', wants:['garden','quiet'], hates:['dark'], pay:44, chaos:0}
  ];
  const SHOP = [
    {feature:'dark', cost:28}, {feature:'plug', cost:30}, {feature:'quiet', cost:34}, {feature:'fireproof', cost:38},
    {feature:'bath', cost:36}, {feature:'cold', cost:32}, {feature:'garden', cost:35}, {feature:'mirror', cost:18}
  ];

  let state, selectedGuest = null, selectedUpgrade = null;
  function fresh(){
    state = {
      day:1, coins:80, stars:3, chaos:0,
      rooms:[
        {id:1, features:['dark'], guest:null}, {id:2, features:['plug'], guest:null}, {id:3, features:['quiet'], guest:null},
        {id:4, features:['mirror'], guest:null}, {id:5, features:['bath'], guest:null}, {id:6, features:['cold'], guest:null}
      ],
      queue:[], log:[]
    }; nextQueue(); save(); render(); showHelp();
  }
  function save(){localStorage.setItem('monster-motel-v1', JSON.stringify(state));}
  function load(){try{state=JSON.parse(localStorage.getItem('monster-motel-v1'));}catch(e){} if(!state) fresh(); else {nextQueue(false); render();}}
  function rnd(arr){return arr[Math.floor(Math.random()*arr.length)]}
  function clone(o){return JSON.parse(JSON.stringify(o))}
  function nextQueue(force=true){
    if(!force && state.queue && state.queue.length) return;
    const n = Math.min(3 + Math.floor(state.day/3), 5);
    state.queue = Array.from({length:n},(_,i)=> ({...clone(rnd(MONSTERS)), uid: Date.now()+i+Math.random()}));
  }
  function scoreFit(monster, room){
    const wants = monster.wants.filter(w=>room.features.includes(w)).length;
    const hates = monster.hates.filter(h=>room.features.includes(h)).length;
    let score = wants*2 - hates*3;
    if(room.guest) score -= 99;
    return score;
  }
  function fitEmoji(score){ return score>=4?'😍':score>=2?'😊':score>=0?'😐':'😭'; }
  function render(){
    dayEl.textContent=state.day; coinsEl.textContent=state.coins; starsEl.textContent=state.stars; chaosEl.textContent=state.chaos;
    roomsEl.innerHTML = '';
    state.rooms.forEach(room=>{
      const el=document.createElement('button'); el.className='room'+(room.guest?' occupied':''); el.setAttribute('aria-label','room '+room.id);
      if(selectedGuest && !room.guest){ const sc=scoreFit(selectedGuest,room); el.classList.add(sc>=0?'compat':'badfit'); }
      el.innerHTML = `<div class="roomNo">${room.id}</div><div class="guest">${room.guest?room.guest.icon:'🛏️'}</div><div class="features">${room.features.map(f=>`<span class="feature">${FEATURES[f].icon}</span>`).join('')}</div><div class="roomScore">${selectedGuest && !room.guest ? fitEmoji(scoreFit(selectedGuest,room)) : ''}</div>`;
      el.onclick=()=>roomClick(room.id); roomsEl.appendChild(el);
    });
    queueEl.innerHTML='';
    state.queue.forEach(g=>{
      const el=document.createElement('button'); el.className='card'+(selectedGuest&&selectedGuest.uid===g.uid?' selected':''); el.setAttribute('aria-label','guest');
      el.innerHTML=`<div class="monster">${g.icon}</div><div class="needs">${g.wants.map(w=>`<span class="need">${FEATURES[w].icon}</span>`).join('')} ${g.hates.map(h=>`<span class="need hate">🚫${FEATURES[h].icon}</span>`).join('')}</div><div class="pay">🪙${g.pay}</div>`;
      el.onclick=()=>{selectedGuest = selectedGuest&&selectedGuest.uid===g.uid ? null : g; selectedUpgrade=null; render();};
      queueEl.appendChild(el);
    });
    shopEl.innerHTML='';
    SHOP.forEach(item=>{
      const el=document.createElement('button'); el.className='shopItem'+(selectedUpgrade===item.feature?' selected':''); el.disabled=state.coins<item.cost;
      el.innerHTML=`<span class="left">${FEATURES[item.feature].icon}</span><span class="cost">🪙${item.cost}</span>`;
      el.onclick=()=>{selectedUpgrade = selectedUpgrade===item.feature ? null : item.feature; selectedGuest=null; render(); toast('🛒➡️🛏️');}; shopEl.appendChild(el);
    });
    $('#nightBtn').disabled = !state.rooms.some(r=>r.guest);
    eventsEl.innerHTML = (state.log||[]).slice(-4).reverse().map(e=>`<div class="event">${e}</div>`).join('') || '<div class="event">👾➡️🛏️</div>';
    save();
  }
  function roomClick(id){
    const room=state.rooms.find(r=>r.id===id);
    if(selectedGuest){
      if(room.guest){toast('🚫'); return;}
      room.guest=selectedGuest; state.queue = state.queue.filter(g=>g.uid!==selectedGuest.uid); selectedGuest=null; toast('👾➡️🛏️'); render(); return;
    }
    if(selectedUpgrade){
      const item=SHOP.find(s=>s.feature===selectedUpgrade);
      if(state.coins<item.cost || room.features.includes(selectedUpgrade)){toast('🚫'); return;}
      state.coins-=item.cost; room.features.push(selectedUpgrade); selectedUpgrade=null; toast('🛠️✨'); render(); return;
    }
    if(room.guest){ state.queue.push(room.guest); room.guest=null; toast('👾↩️'); render(); }
  }
  function passNight(){
    let earned=0, chaosDelta=0, starDelta=0, lines=[];
    state.rooms.forEach(room=>{
      if(!room.guest) return;
      const g=room.guest, sc=scoreFit(g,room);
      if(sc>=4){earned += g.pay + 12; starDelta += 1; lines.push(`${g.icon} ${fitEmoji(sc)} 🪙✨`);} 
      else if(sc>=2){earned += g.pay; lines.push(`${g.icon} ${fitEmoji(sc)} 🪙`);} 
      else if(sc>=0){earned += Math.max(8, Math.floor(g.pay*.55)); chaosDelta += g.chaos; lines.push(`${g.icon} ${fitEmoji(sc)} 🌪️`);} 
      else {earned += Math.max(0, Math.floor(g.pay*.18)); chaosDelta += g.chaos+2; starDelta -= 1; lines.push(`${g.icon} ${fitEmoji(sc)} 💥`);}
      room.guest=null;
    });
    const event = randomEvent();
    earned += event.coins; chaosDelta += event.chaos; starDelta += event.stars; if(event.icon) lines.push(event.icon);
    state.coins = Math.max(0, state.coins + earned - Math.max(0, chaosDelta-3)*3);
    state.chaos = Math.max(0, state.chaos + chaosDelta - 1);
    state.stars = Math.max(0, Math.min(5, state.stars + starDelta));
    state.day++;
    state.log = lines.slice(-5);
    selectedGuest=null; selectedUpgrade=null; nextQueue(true); render(); showSummary(earned, starDelta, chaosDelta, event.icon);
    if(state.chaos>=12 || state.stars<=0) gameOver();
  }
  function randomEvent(){
    const events=[
      {icon:'🍀 🪙+10', coins:10, chaos:0, stars:0}, {icon:'🌈 ⭐+1', coins:0, chaos:0, stars:1},
      {icon:'🧹 🌪️-2', coins:0, chaos:-2, stars:0}, {icon:'🪲 🌪️+2', coins:0, chaos:2, stars:0},
      {icon:'🎁 🪙+18', coins:18, chaos:0, stars:0}, {icon:'🧯 🌪️-1', coins:0, chaos:-1, stars:0},
      {icon:'', coins:0, chaos:0, stars:0}
    ]; return rnd(events);
  }
  function showSummary(earned, stars, chaos, ev){
    overlay.style.display='flex';
    modal.innerHTML=`<div class="giant">🌙</div><div class="row"><div class="bubble">🪙${earned>=0?'+':''}${earned}</div><div class="bubble">⭐${stars>=0?'+':''}${stars}</div><div class="bubble">🌪️${chaos>=0?'+':''}${chaos}</div></div><div class="row"><button class="btn" id="okBtn">☀️</button></div>`;
    $('#okBtn').onclick=()=>{overlay.style.display='none';};
  }
  function gameOver(){
    setTimeout(()=>{
      overlay.style.display='flex';
      modal.innerHTML=`<div class="giant">🏨💫</div><div class="row"><div class="bubble">☀️${state.day}</div><div class="bubble">🪙${state.coins}</div><div class="bubble">⭐${state.stars}</div></div><div class="row"><button class="btn" id="againBtn">🔄</button></div>`;
      $('#againBtn').onclick=()=>{overlay.style.display='none'; fresh();};
    },250);
  }
  function showHelp(){
    overlay.style.display='flex';
    modal.innerHTML=`<div class="giant">🏨👾</div><div class="help"><div class="helpLine">👾 ➡️ 🛏️</div><div class="helpLine">✅ ${Object.values(FEATURES).slice(0,4).map(f=>f.icon).join(' ')}</div><div class="helpLine">🚫 🪞 🔌 🔥 💡</div><div class="helpLine">🌙 ➡️ 🪙 ⭐</div><div class="helpLine">🌪️ ➡️ 😭</div></div><div class="row"><button class="btn" id="playBtn">▶️</button></div>`;
    $('#playBtn').onclick=()=>{overlay.style.display='none';};
  }
  function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1200);}
  $('#nightBtn').onclick=passNight; $('#resetBtn').onclick=()=>fresh(); $('#helpBtn').onclick=showHelp;
  load();
})();