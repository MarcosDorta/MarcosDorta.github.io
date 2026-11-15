(function(){
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const clamp = (v, a=0, b=1) => Math.min(b, Math.max(a, v));
  const PHONE = '5515997275246';
  const wa = t => 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(t);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = () => matchMedia('(max-width:899px)').matches;
  const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- Links, formulário, copiar ---------- */
  const hello = wa('Olá, Marcos! Vi seu portfólio e quero conversar.');
  ['#wa-dock', '#wa-hero', '#wa-card'].forEach(s => { const a = $(s); if (a) a.href = hello; });
  $$('[data-wa]').forEach(a => a.href = wa('Olá, Marcos! Quero um orçamento de: ' + a.dataset.wa + '.'));
  $('#yr').textContent = new Date().getFullYear();

  const clean = (s, max) => Array.from(String(s || '').replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '').trim()).slice(0, max).join('');
  $('#form').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const nome = clean(f.get('nome'), 80), msg = clean(f.get('text'), 800);
    if (!nome){ e.target.nome.focus(); return; }
    const a = el('a');
    a.href = wa('Olá, Marcos! Sou ' + nome + '. Quero: ' + clean(f.get('tipo'), 40) + '.' + (msg ? '\n' + msg : ''));
    a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
  });
  const copyBtn = $('#copy');
  copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('+55 15 99727-5246'); copyBtn.textContent = 'Copiado'; }
    catch { copyBtn.textContent = 'Selecione e copie'; }
    setTimeout(() => copyBtn.textContent = 'Copiar número', 1800);
  });
  $('#totop').addEventListener('click', () => scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'}));

  /* ---------- Relógio ---------- */
  const clock = $('#clock');
  const fmt = new Intl.DateTimeFormat('pt-BR', {hour:'2-digit', minute:'2-digit', timeZone:'America/Sao_Paulo'});
  const tickClock = () => { clock.textContent = fmt.format(new Date()); };
  tickClock(); setInterval(tickClock, 20000);

  /* ---------- Nome do hero em letras ---------- */
  let li = 0;
  $$('#nm .ln').forEach(line => {
    const txt = line.textContent; line.textContent = '';
    Array.from(txt).forEach(c => {
      const s = el('span', 'lt', c);
      s.style.setProperty('--i', li);
      s.style.setProperty('--o', ((li * 37) % 11 - 5) * 14);
      line.append(s); li++;
    });
  });

  /* ---------- Notebook 3D: teclado e telas dos sites ---------- */
  const keys = $('#keys');
  const rep = (n, v) => Array(n).fill(v);
  [rep(15, 2), [3, ...rep(12, 2), 3], [3, ...rep(11, 2), 5], [4, ...rep(10, 2), 6], [3, 3, 3, 12, 3, 3, 3]].forEach(r => r.forEach(sp => {
    const k = document.createElement('i'); k.style.gridColumn = 'span ' + sp; keys.append(k);
  }));
  const card = `<div class="cardm"><i class="im"></i><i class="p"></i><i class="p" style="width:60%"></i></div>`;
  const prod = `<div class="cardm"><i class="im"></i><i class="p" style="width:70%"></i><i class="pr"></i></div>`;
  const nav = `<div class="nav"><i class="lgo"></i><i class="nl"></i><i class="nl"></i><i class="nl sp"></i></div>`;
  const hero = `<div class="hero2"><i class="p" style="width:22%;background:#2b2160"></i><i class="h1" style="width:80%"></i><i class="h1" style="width:58%"></i><i class="p" style="width:72%"></i><i class="p" style="width:50%"></i><i class="cta"></i></div>`;
  const split = `<div class="split"><div><i class="h1" style="width:90%"></i><i class="h1" style="width:60%"></i><i class="p"></i><i class="p" style="width:70%"></i><i class="cta"></i></div><i class="big"></i></div>`;
  const bars = [46, 70, 38, 82, 58, 92, 64, 76].map(v => `<i style="--h:${v}%"></i>`).join('');
  const row = `<div class="tr"><i></i><i></i><i></i></div>`;
  const node = `<div class="nd"><i></i></div>`, link = `<i class="ln3"></i>`;
  const MOCK = {
    lp:   `<div class="pg-in">${nav}${hero}<div class="grid3">${card}${card}${card}</div><div class="hero2"><i class="h1" style="width:46%"></i><i class="p" style="width:70%"></i></div></div>`,
    site: `<div class="pg-in">${nav}${split}<div class="grid3">${card}${card}${card}</div>${split}</div>`,
    loja: `<div class="pg-in">${nav}<div class="hero2"><i class="big" style="aspect-ratio:3.2"></i></div><div class="grid3">${prod}${prod}${prod}</div><div class="grid3">${prod}${prod}${prod}</div></div>`,
    sys:  `<div class="dash"><div class="side"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="main"><div class="kpis"><div class="kpi"><i></i><b></b></div><div class="kpi"><i></i><b></b></div><div class="kpi"><i></i><b></b></div></div><div class="bars">${bars}</div>${row}${row}${row}${row}</div></div>`,
    bot:  `<div class="pg-in"><div class="flow">${node}${link}${node}${link}${node}</div><div class="chat"><div class="bub"></div><div class="bub r"></div><div class="bub"></div><div class="bub r"></div><div class="bub" style="width:40%"></div></div></div>`
  };
  const pagesEl = $('#pages'), lap = $('#lap'), urlEl = $('#url'), lcap = $('#lcap'), lprice = $('#lprice');
  const cards = $$('.pc');
  if (!reduce && 'IntersectionObserver' in window){
    const brl = n => 'R$ ' + n.toLocaleString('pt-BR');
    const cio = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; cio.unobserve(e.target);
      const node = $('.price', e.target).firstChild, target = parseInt(e.target.dataset.price.replace(/\D/g, ''), 10), t0 = performance.now();
      (function step(now){ const k = clamp((now - t0) / 900); node.nodeValue = brl(Math.round(target * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(step); })(t0);
    }), {threshold:.6});
    cards.forEach(c => cio.observe(c));
  }
  const pgs = cards.map(c => { const p = el('div', 'pg'); p.innerHTML = MOCK[c.dataset.v]; pagesEl.append(p); return p; });   // conteúdo fixo do próprio código
  const YAW = [-14, 12, -10, 14, -12];
  let curCard = -1;
  function setCard(i){
    if (i === curCard) return; curCard = i;
    pgs.forEach((p, k) => p.classList.toggle('on', k === i));
    cards.forEach((c, k) => c.classList.toggle('act', k === i));
    const c = cards[i];
    urlEl.textContent = c.dataset.url; lcap.textContent = c.dataset.name; lprice.textContent = c.dataset.price;
    lap.style.setProperty('--ry', YAW[i] + 'deg');
  }
  setCard(0);
  if (!reduce){
    const pl = $('#pjlap'), fine = matchMedia('(pointer:fine)').matches;
    let drag = null, dpx = 0;
    pl.addEventListener('pointerdown', e => { drag = {x: e.clientX, b: dpx}; lap.classList.add('dragging'); });
    pl.addEventListener('pointermove', e => {
      if (drag){ dpx = clamp(drag.b + (e.clientX - drag.x) * .4, -50, 50); lap.style.setProperty('--px', dpx.toFixed(1) + 'deg'); }
      else if (fine){ const r = pl.getBoundingClientRect(); lap.style.setProperty('--px', (((e.clientX - r.left) / r.width - .5) * 16).toFixed(1) + 'deg'); }
    });
    const end = () => { if (drag){ drag = null; dpx = 0; lap.classList.remove('dragging'); lap.style.setProperty('--px', '0deg'); } };
    pl.addEventListener('pointerup', end); pl.addEventListener('pointercancel', end);
    pl.addEventListener('pointerleave', () => { end(); if (fine) lap.style.setProperty('--px', '0deg'); });
  }

  /* ---------- Medidas em cache ---------- */
  const heroEl = $('#inicio'), procEl = $('#processo'), prog = $('#prog'), pct = $('#pct'), secName = $('#secname');
  const ghosts = $$('[data-ghost]'), tilts = $$('[data-tilt]'), mqs = $$('.mq-row');
  const photo = $('#photo'), code = $('#code'), pjlap = $('#pjlap');
  const navIds = ['inicio', 'projetos', 'tecnologias', 'processo', 'contato'];
  const navNames = {inicio:'Início', projetos:'Projetos', tecnologias:'Tecnologias', processo:'Processo', contato:'Contato'};
  const slots = $$('.slot[data-sec]');
  let vh = innerHeight, docH = 0, M = {};
  const abs = e => e.getBoundingClientRect().top + scrollY;
  function measure(){
    vh = innerHeight; docH = document.documentElement.scrollHeight;
    M.hero = {t: abs(heroEl), h: heroEl.offsetHeight};
    M.proc = {t: abs(procEl), h: procEl.offsetHeight};
    M.proj = abs($('#projetos'));
    M.nav = navIds.map(id => abs($('#' + id)));
    M.ghost = ghosts.map(e => ({e, c: abs(e) + e.offsetHeight / 2}));
    M.mq = mqs.map(r => ({r, w: r.scrollWidth / 2}));
    M.tech = {t: abs($('#tecnologias')), h: $('#tecnologias').offsetHeight};
  }

  /* ---------- Revelar ao entrar na tela ---------- */
  if (!reduce && 'IntersectionObserver' in window){
    // Também revela o que ficou acima da tela (quem pulou pelo dock não encontra título escondido ao voltar)
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting || e.boundingClientRect.bottom < 0){ (e.target._t || e.target).classList.add('v'); io.unobserve(e.target); } }), {rootMargin:'0px 0px -8% 0px', threshold:.1});
    $$('.rv').forEach((n, i) => {
      n.style.transitionDelay = ((i % 3) * 70) + 'ms';
      if (n.matches('h2')){                                  // títulos recortados por clip-path: observa um marcador de 1px acima deles
        const sen = document.createElement('i'); sen.style.cssText = 'display:block;height:1px;margin-bottom:-1px;pointer-events:none'; sen._t = n;
        n.before(sen); io.observe(sen);
      } else io.observe(n);
    });
    const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('v'); io2.unobserve(e.target); } }), {threshold:.4});
    io2.observe(code);
  } else { code.classList.add('v'); $$('.rv').forEach(n => n.classList.add('v')); }

  /* ---------- Scroll ---------- */
  const steps = $$('.st', $('#steps')), segs = $$('.sg i', $('#steps')), caps = $$('.cap'), big = $('#big');
  let lastIdx = -1, lastSec = -1, lastPct = -1, ticking = false, techVis = false;
  const mqWrap = $('.mqs');
  const tiltVis = new Set();
  const tio = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? tiltVis.add(e.target) : tiltVis.delete(e.target)), {rootMargin:'100px'}) : null;
  tilts.forEach(t => tio && tio.observe(t));
  const ease = v => 1 - Math.pow(1 - v, 3);

  function update(){
    ticking = false;
    const y = scrollY, max = Math.max(1, docH - vh);
    prog.style.transform = 'scaleX(' + (y / max).toFixed(4) + ')';
    const p3 = Math.round(clamp(y / max) * 100);
    if (p3 !== lastPct){ lastPct = p3; pct.textContent = String(p3).padStart(3, '0'); }

    heroEl.style.setProperty('--p', clamp((y - M.hero.t) / Math.max(1, M.hero.h - vh)).toFixed(4));
    M.ghost.forEach(g => { g.e.style.setProperty('--gx', ((g.c - (y + vh / 2)) * .16).toFixed(1)); });

    if (photo){ const r = photo.getBoundingClientRect(); photo.style.setProperty('--py', ((r.top + r.height / 2 - vh / 2) * -.06).toFixed(1)); }

    // Notebook: abre conforme a seção entra; o site mostrado acompanha o cartão em foco
    const op = reduce ? 1 : clamp((y + vh * .9 - (M.proj + 240)) / (vh * .55));
    lap.style.setProperty('--lean', (-88 + 95 * ease(op)).toFixed(1) + 'deg');
    lap.style.setProperty('--open', op.toFixed(2));
    const line = small() ? pjlap.getBoundingClientRect().bottom + 40 : vh * .5;
    let ai = 0; cards.forEach((c, k) => { if (c.getBoundingClientRect().top <= line) ai = k; });
    setCard(ai);

    tiltVis.forEach(t => { const r = t.getBoundingClientRect(); t.style.setProperty('--ty', (((r.top + r.height / 2) - vh / 2) / vh * -7).toFixed(2)); });

    techVis = y + vh > M.tech.t && y < M.tech.t + M.tech.h;
    if (techVis){
      M.mq.forEach(m => {
        const dir = +m.r.dataset.mq, off = ((y - M.tech.t) * .5) % m.w;
        m.r.style.setProperty('--mx', (dir < 0 ? -off : off - m.w).toFixed(1));
      });
    }

    const pp = clamp((y - M.proc.t) / Math.max(1, M.proc.h - vh));
    const idx = Math.min(3, Math.floor(pp * 4));
    segs.forEach((s, k) => s.style.setProperty('--f', clamp(pp * 4 - k).toFixed(3)));
    if (idx !== lastIdx){
      lastIdx = idx;
      steps.forEach((s, k) => { s.classList.toggle('act', k === idx); s.classList.toggle('done', k < idx); });
      caps.forEach((c, k) => c.classList.toggle('act', k === idx));
      big.textContent = '0' + (idx + 1);
      big.classList.remove('flip'); void big.offsetWidth; big.classList.add('flip');
    }

    const lim = y + vh * .5; let cur = 0;
    M.nav.forEach((t, k) => { if (lim >= t) cur = k; });
    if (cur !== lastSec){
      lastSec = cur;
      secName.textContent = navNames[navIds[cur]];
      slots.forEach(s => s.classList.toggle('act', s.dataset.sec === navIds[cur]));
    }
  }
  const onScroll = () => { if (!ticking){ ticking = true; requestAnimationFrame(update); } };

  /* ---------- Dock com ampliação (mola) ---------- */
  const dock = $('#dock'), dockBg = $('#dockbg'), dSlots = $$('.slot', dock);
  let base = 42, maxS = 1.4, dist = 96, gap = 8, lc = [], px = Infinity, W = 0, dockRun = false, hotI = -1, waving = false, userDock = false;
  const sc = dSlots.map(() => 1), vs = dSlots.map(() => 0);
  function dockMetrics(){
    const s = small();
    base = s ? 42 : 50; maxS = s ? 1.38 : 1.7; dist = s ? 96 : 150; gap = s ? 8 : 12;
    dock.style.setProperty('--b', base + 'px'); dock.style.setProperty('--dg', gap + 'px'); dock.style.setProperty('--dh', (base + 18) + 'px');
    const left = dock.getBoundingClientRect().left;
    lc = dSlots.map(sl => left + sl.offsetLeft + base / 2);
    W = dock.offsetWidth;
  }
  function dockStep(){
    const dt = 1 / 60;
    let moving = false, extra = 0, best = -1, bd = 1e9;
    dSlots.forEach((sl, i) => {
      const d = Math.abs(px - lc[i]);
      const tg = isFinite(px) ? 1 + (maxS - 1) * clamp(1 - d / dist) : 1;
      if (d < bd){ bd = d; best = i; }
      for (let k = 0; k < 2; k++){
        const a = ((tg - sc[i]) * 150 - vs[i] * 12) / .1;
        vs[i] += a * (dt / 2); sc[i] += vs[i] * (dt / 2);
      }
      if (Math.abs(tg - sc[i]) > .002 || Math.abs(vs[i]) > .002) moving = true;
      extra += (sc[i] - 1) * base;
    });
    let acc = 0;
    dSlots.forEach((sl, i) => {
      const grow = (sc[i] - 1) * base;
      sl.style.transform = 'translate3d(' + (acc + grow / 2 - extra / 2).toFixed(2) + 'px,0,0)';
      $('.di', sl).style.transform = 'scale(' + sc[i].toFixed(3) + ')';
      sl.style.setProperty('--up', grow.toFixed(1));
      acc += grow;
    });
    dockBg.style.setProperty('--sx', ((W + extra) / W).toFixed(4));
    const hot = isFinite(px) && !waving && bd < dist * .55 ? best : -1;
    if (hot !== hotI){ hotI = hot; dSlots.forEach((sl, i) => sl.classList.toggle('hot', i === hot)); }
    if (moving || isFinite(px)) requestAnimationFrame(dockStep); else dockRun = false;
  }
  const dockGo = () => { if (!dockRun){ dockRun = true; requestAnimationFrame(dockStep); } };
  if (!reduce){
    dock.addEventListener('pointermove', e => { px = e.clientX; dockGo(); });
    dock.addEventListener('pointerdown', e => { px = e.clientX; dockGo(); });
    ['pointerleave', 'pointercancel', 'pointerup'].forEach(ev => dock.addEventListener(ev, e => { if (ev !== 'pointerup' || e.pointerType !== 'mouse'){ px = Infinity; dockGo(); } }));
    dock.addEventListener('focusin', e => { const i = dSlots.indexOf(e.target.closest('.slot')); if (i > -1){ px = lc[i]; dockGo(); } });
    dock.addEventListener('focusout', () => { px = Infinity; dockGo(); });
  }

  if (!reduce){
    ['pointerenter', 'pointerdown'].forEach(ev => dock.addEventListener(ev, () => { userDock = true; }));
    ['pointerleave', 'pointercancel', 'pointerup'].forEach(ev => dock.addEventListener(ev, () => { userDock = false; }));
    setInterval(() => {                                                // uma onda passa pelo dock de tempos em tempos
      if (waving || userDock || document.hidden || !lc.length) return;
      waving = true; const t0 = performance.now(), a = lc[0] - 70, b = lc[lc.length - 1] + 70;
      (function step(now){
        const k = clamp((now - t0) / 1300);
        if (userDock){ waving = false; return; }
        px = a + (b - a) * k; dockGo();
        if (k < 1) requestAnimationFrame(step); else { px = Infinity; dockGo(); waving = false; }
      })(t0);
    }, 7000);
  }

  /* ---------- Polvo em pixel art (clicável: dá uma volta na tela deixando um rastro binário) ---------- */
  const COL = {X:'#7A4DFF', H:'#A98BFF', E:'#050505', M:'#050505', B:'#C6F432'};
  const HEAD = ['....XXXXXXXX....', '..XXHHXXXXXXXX..', '.XXXXXXXXXXXXXX.', '.XXXXXXXXXXXXXX.', 'XXXXEEXXXXEEXXXX', 'XXXXEEXXXXEEXXXX', 'XXBXXXXXXXXXXBXX', '.XXXXXXMMXXXXXX.', '.XXXXXXXXXXXXXX.', '..XXXXXXXXXXXX..'];
  const TA = ['.XX..XX..XX..XX.', '.XX..XX..XX..XX.', 'XX..XX..XX..XX..', 'XX..XX..XX..XX..'];
  const TB = ['.XX..XX..XX..XX.', '.XX..XX..XX..XX.', '..XX..XX..XX..XX', '..XX..XX..XX..XX'];
  const osvg = $('#osvg'), octo = $('#octo');
  function sprite(rows, y0, parent){
    const g = document.createElementNS(NS, 'g');
    rows.forEach((r, y) => Array.from(r).forEach((ch, x) => {
      if (ch === '.') return;
      const rc = document.createElementNS(NS, 'rect');
      rc.setAttribute('x', x); rc.setAttribute('y', y0 + y); rc.setAttribute('width', 1); rc.setAttribute('height', 1);
      rc.setAttribute('fill', COL[ch]);
      if (ch === 'B') rc.setAttribute('opacity', '.55');
      if (ch === 'E' && y === 4) rc.setAttribute('class', 'et');
      g.append(rc);
    }));
    parent.append(g); return g;
  }
  sprite(HEAD, 0, osvg);
  const gA = sprite(TA, 10, osvg), gB = sprite(TB, 10, osvg);
  gB.style.display = 'none';
  // O mesmo polvo, em pixels, estampado na tampa do notebook
  const lb = $('#lback'); if (lb){ const sv = document.createElementNS(NS, 'svg'); sv.setAttribute('viewBox', '0 0 16 14'); sprite(HEAD, 0, sv); sprite(TA, 10, sv); lb.append(sv); }
  const bubs = ['#b0', '#b1', '#b2'].map(s => $(s));

  // Rastro de zeros e uns em pixel (canvas), sem significado algum
  const cv = $('#trail'), cctx = cv.getContext('2d');
  let dpr = 1;
  const sizeCv = () => { dpr = Math.min(2, devicePixelRatio || 1); cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr); };
  sizeCv(); addEventListener('resize', sizeCv);
  const GL = {0:['111', '101', '101', '101', '111'], 1:['010', '110', '010', '010', '111']};
  const bits = [];
  function drawBits(now){
    cctx.clearRect(0, 0, cv.width, cv.height);
    for (let i = bits.length - 1; i >= 0; i--){
      const b = bits[i], age = (now - b.t) / b.life;
      if (age >= 1){ bits.splice(i, 1); continue; }
      cctx.globalAlpha = Math.ceil((1 - age) * 4) / 4;                 // some em 4 degraus
      cctx.fillStyle = b.c;
      const yy = b.y - Math.floor(age * 5) * b.s * 1.4;                // sobe em degraus
      GL[b.v].forEach((r, y) => { for (let x = 0; x < 3; x++) if (r[x] === '1') cctx.fillRect(Math.round((b.x + x * b.s) * dpr), Math.round((yy + y * b.s) * dpr), Math.ceil(b.s * dpr), Math.ceil(b.s * dpr)); });
    }
    cctx.globalAlpha = 1;
  }
  const spawn = (x, y, now) => bits.push({x: x - 4, y: y - 7, v: Math.random() < .5 ? 0 : 1, s: small() ? 2.5 : 3, t: now, life: 900 + Math.random() * 500, c: Math.random() < .2 ? '#F5F2EA' : '#C6F432'});

  let oy = 90, prevY = scrollY, vel = 0, bubT = 0, bubI = 0, swapT = 0, frameB = false, lastTx = 0, run = null, hadBits = false;
  const ss = v => v * v * (3 - 2 * v);
  function octoFrame(t){
    requestAnimationFrame(octoFrame);
    const y = scrollY, max = Math.max(1, docH - vh), p = y / max;
    vel = vel * .88 + (y - prevY) * .12; prevY = y;
    if (techVis) mqWrap.style.setProperty('--sk', clamp(vel * .14, -9, 9).toFixed(2));
    const w = octo.offsetWidth || 64, ps = w / 16, hgt = ps * 14;
    let s = Math.abs(vel);
    const topY = 64, botY = vh - hgt - (small() ? 96 : 120);
    oy += (topY + p * Math.max(0, botY - topY) - oy) * .07;
    const sway = Math.round(Math.sin(y * .006) * 10 / ps) * ps;
    const bob = Math.round(Math.sin(t * .002) * (1 - clamp(s / 20))) * ps;
    let tx = sway, ty = oy + bob;
    if (run){
      const k = clamp((t - run.t0) / run.dur);
      if (k >= 1){ run = null; }
      else {
        s = Math.max(s, 14);                                          // tentáculos batem rápido durante a volta
        const cx = innerWidth / 2, cy = innerHeight / 2, m = Math.max(14, w * .4);
        const rx = Math.max(40, innerWidth / 2 - w / 2 - m), ry = Math.max(40, innerHeight / 2 - hgt / 2 - 74);
        const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        const th = run.th0 + Math.PI * 2 * e;
        const exT = cx + rx * Math.cos(th) - w / 2 - run.natX, eyT = cy + ry * Math.sin(th) - hgt / 2;
        const bl = k < .1 ? ss(k / .1) : k > .9 ? 1 - ss((k - .9) / .1) : 1;
        tx = tx + (exT - tx) * bl; ty = ty + (eyT - ty) * bl;
        if (t - run.last > 36){ run.last = t; const j = () => (Math.random() - .5) * w * .5; spawn(run.natX + tx + w / 2 + j(), ty + hgt / 2 + j(), t); }
      }
    }
    lastTx = tx;
    octo.style.transform = 'translate3d(' + Math.round(tx / ps) * ps + 'px,' + Math.round(ty / ps) * ps + 'px,0)';
    if (t - swapT > 340 / (1 + clamp(s / 6) * 2.5)){
      swapT = t; frameB = !frameB; gA.style.display = frameB ? 'none' : ''; gB.style.display = frameB ? '' : 'none';
    }
    if (!run && s > 10 && t - bubT > 420){
      bubT = t; const b = bubs[bubI++ % 3]; b.style.setProperty('--bx', (Math.random() * 30 - 22).toFixed(0) + 'px');
      b.classList.remove('go'); void b.offsetWidth; b.classList.add('go');
    }
    if (bits.length || hadBits){ drawBits(t); hadBits = bits.length > 0; }
  }
  octo.addEventListener('click', () => {
    if (reduce || run) return;
    const t = performance.now(), r = octo.getBoundingClientRect(), w = r.width, hgt = r.height;
    const natX = r.left - lastTx;
    const cx = innerWidth / 2, cy = innerHeight / 2, m = Math.max(14, w * .4);
    const rx = Math.max(40, innerWidth / 2 - w / 2 - m), ry = Math.max(40, innerHeight / 2 - hgt / 2 - 74);
    run = {t0: t, dur: 3400, last: t, natX, th0: Math.atan2(((r.top + hgt / 2) - cy) / ry, ((r.left + w / 2) - cx) / rx)};
    for (let i = 0; i < 14; i++) spawn(r.left + Math.random() * w, r.top + Math.random() * hgt, t);   // estouro de bits ao clicar
    hadBits = true;
  });
  if (!reduce){
    requestAnimationFrame(octoFrame);
    (function blink(){ setTimeout(() => { octo.classList.add('blink'); setTimeout(() => octo.classList.remove('blink'), 160); blink(); }, 2400 + Math.random() * 3000); })();
  } else { octo.style.transform = 'translate3d(0,140px,0)'; }

  /* ---------- Brilho que segue o ponteiro nos cartões de contato ---------- */
  $$('[data-glow]').forEach(c => {
    c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
  });

  if (!reduce && matchMedia('(pointer:fine)').matches){
    const hp = $('.hero-pin');
    heroEl.addEventListener('pointermove', e => { const r = hp.getBoundingClientRect(); hp.style.setProperty('--cx', (e.clientX - r.left) + 'px'); hp.style.setProperty('--cy', (e.clientY - r.top) + 'px'); hp.classList.add('lit'); });
    heroEl.addEventListener('pointerleave', () => hp.classList.remove('lit'));
    $$('.btn.pri, .btn.lime').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = 'translate(' + (((e.clientX - r.left) / r.width - .5) * 10).toFixed(1) + 'px,' + (((e.clientY - r.top) / r.height - .5) * 8).toFixed(1) + 'px)'; });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  /* ---------- Início ---------- */
  function boot(){ measure(); dockMetrics(); update(); }
  boot();
  addEventListener('scroll', onScroll, {passive:true});
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(boot, 120); });
  addEventListener('load', boot);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot);
})();
