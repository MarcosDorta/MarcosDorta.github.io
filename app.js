(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const wa = t => 'https://wa.me/5515997275246?text=' + encodeURIComponent(t);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width:900px), (pointer:coarse)').matches;

  $('#yr').textContent = new Date().getFullYear();
  $('#wa-nav').href = wa('Olá, Marcos! Vi seu portfólio e quero conversar.');
  $('#fab').href = $('#wa-nav').href;
  $$('[data-wa]').forEach(a => a.href = wa('Olá, Marcos! Quero um orçamento de: ' + a.dataset.wa + '.'));
  // Texto do visitante: remove caracteres UTF-16 soltos (evita URIError), apara e limita o tamanho
  const clean = (s, max) => Array.from(String(s || '').replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '').trim()).slice(0, max).join('');
  $('#form').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const nome = clean(f.get('nome'), 80), msg = clean(f.get('text'), 800);
    if (!nome){ e.target.nome.focus(); return; }
    const a = document.createElement('a');
    a.href = wa('Olá, Marcos! Sou ' + nome + '. Quero: ' + clean(f.get('tipo'), 40) + '.' + (msg ? '\n' + msg : ''));
    a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
  });

  // Foto: se foto.jpg não existir, mostra um aviso (sem handler inline, compatível com CSP)
  const photoImg = $('#ph img');
  const photoFail = () => { const d = document.createElement('div'); d.className = 'none'; d.textContent = 'Salve sua foto como foto.webp'; $('#ph').replaceChildren(d); };
  if (photoImg){ photoImg.addEventListener('error', photoFail); if (photoImg.complete && !photoImg.naturalWidth) photoFail(); }

  // Tecnologias
  const techs = [['HTML','H5','Front-end'],['CSS','C3','Front-end'],['JavaScript','JS','Front-end'],['TypeScript','TS','Front-end'],
    ['Python','Py','Back-end e automação'],['SQL','SQ','Banco de dados'],['n8n','n8','Automação']];
  $('#tiles').innerHTML = techs.map(t => `<div class="tile"><span class="ic">${t[1]}</span><div><b>${t[0]}</b><small>${t[2]}</small></div></div>`).join('');

  // Prévias dos projetos
  const L = (c='') => `<i class="l ${c}" style="display:block"></i>`;
  const views = {
    lp:  ['seusite.com.br', `<div class="b h"></div>${L('m')}${L('s')}<div class="v" style="height:30px;width:42%"></div><div class="gs"><div class="b h"></div><div class="b h"></div><div class="b h"></div></div>`],
    site:['empresa.com.br', `<div class="b" style="height:22px"></div><div class="g2"><div style="display:grid;gap:8px;align-content:start">${L('m')}${L('s')}${L('m')}<div class="v" style="height:26px;width:60%"></div></div><div class="b h"></div></div><div class="gs"><div class="b h"></div><div class="b h"></div><div class="b h"></div></div>`],
    loja:['loja.com.br', `<div class="b" style="height:22px"></div><div class="gs"><div class="b sq"></div><div class="b sq"></div><div class="b sq"></div><div class="b sq"></div><div class="b sq"></div><div class="b sq"></div></div><div class="v" style="height:28px;width:38%"></div>`],
    sys: ['app.seusistema.com', `<div class="side"><div class="b" style="height:230px"></div><div style="display:grid;gap:10px"><div class="gs"><div class="v" style="height:50px"></div><div class="b" style="height:50px"></div><div class="b" style="height:50px"></div></div><div class="b tr"></div><div class="b tr sel"></div><div class="b tr"></div><div class="b tr"></div><div class="b tr"></div></div></div>`],
    bot: ['whatsapp / bot', `<div class="b bub"></div><div class="bub r"></div><div class="b bub"></div><div class="bub r"></div><div class="b bub" style="width:40%"></div>`]
  };
  const rows = $$('.row');
  // Miniaturas (CSS mostra só abaixo de 900px) e janela de prévia (CSS mostra só acima): montadas sempre, para o layout seguir a largura da tela
  rows.forEach(r => r.insertAdjacentHTML('afterbegin', `<div class="thumb" aria-hidden="true"><div class="screen">${views[r.dataset.v][1]}</div></div>`));
  const screen = $('#screen'), urlEl = $('#url');
  const show = k => {
    const [u, html] = views[k];
    urlEl.textContent = u; screen.innerHTML = html;
    if (!reduce){ screen.classList.remove('swap'); void screen.offsetWidth; screen.classList.add('swap'); }
  };
  show('lp');
  rows.forEach(r => {
    const on = () => { rows.forEach(x => x.classList.toggle('act', x === r)); show(r.dataset.v); };
    r.addEventListener('mouseenter', on); r.addEventListener('focus', on);
  });

  // Command bar do hero, montada a partir dos projetos
  const list = $('#cmdlist');
  const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };
  rows.forEach(r => {
    const li = el('li'), a = el('a');
    a.href = r.href; a.target = '_blank'; a.rel = 'noopener';
    a.append(el('span', 'ic', r.dataset.ic), el('span', '', $('h3', r).textContent), el('span', 'pr', $('strong', r).textContent));
    li.append(a); list.append(li);
  });
  const items = $$('li', list);
  let sel = 0, hover = false;
  const select = i => { sel = i; items.forEach((li, k) => li.classList.toggle('sel', k === i)); };
  select(0);
  items.forEach((li, k) => li.addEventListener('mouseenter', () => { hover = true; select(k); }));
  list.addEventListener('mouseleave', () => hover = false);

  // Seleção automática só enquanto a barra está na tela
  let cycle = null;
  if (!reduce && 'IntersectionObserver' in window){
    new IntersectionObserver(es => {
      const vis = es[es.length - 1].isIntersecting;
      if (vis && !cycle) cycle = setInterval(() => { if (!hover) select((sel + 1) % items.length); }, 2200);
      else if (!vis && cycle){ clearInterval(cycle); cycle = null; }
    }).observe($('#cmdk'));
  }

  // Abertura (CSS): título em palavras e digitação
  const h1 = $('#h1');
  const words = h1.textContent.split(' ');
  h1.textContent = '';
  words.forEach((w, i) => {
    const s = el('span', 'w in', w);
    s.style.setProperty('--d', (.25 + i * .07).toFixed(2) + 's');
    h1.append(s, ' ');
  });
  const QUERY = 'novo projeto', q = $('#q');
  if (reduce) q.textContent = QUERY;
  else setTimeout(function step(n){ n = n || 0; q.textContent = QUERY.slice(0, ++n); if (n < QUERY.length) setTimeout(() => step(n), 55 + Math.random()*40); }, 1500);

  // Reveal no celular: uma vez, com IntersectionObserver (sem scrub)
  if (mobile && !reduce && 'IntersectionObserver' in window){
    const targets = $$('.rv, #photo, #why .card, .tile, .row, #band');
    targets.forEach(t => t.classList.add('rvx'));
    const io = new IntersectionObserver(es => {
      es.filter(e => e.isIntersecting).forEach((e, i) => {
        const el = e.target; io.unobserve(el);
        el.style.transitionDelay = (i * 60) + 'ms';
        el.classList.add('v');
        setTimeout(() => { el.classList.remove('rvx', 'v'); el.style.transitionDelay = ''; }, 700 + i * 60);
      });
    }, {rootMargin:'0px 0px -6% 0px', threshold:.01});
    targets.forEach(t => io.observe(t));
  }

  // Posições em cache e leitura de scroll em um frame por vez
  const fab = $('#fab'), navLinks = $$('.links a');
  let tops = {}, tick = false, lastShow = null, activeH = '#inicio';
  const measure = () => { tops = {projetos:$('#projetos').offsetTop, contato:$('#contato').offsetTop}; };
  function onScroll(){
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = scrollY, show = y > 500 && y < tops.contato - innerHeight * .5;
      if (show !== lastShow){ lastShow = show; fab.classList.toggle('show', show); }
      const lim = y + innerHeight * .55;
      const h = lim > tops.contato ? '#contato' : lim > tops.projetos ? '#projetos' : '#inicio';
      if (h !== activeH){ activeH = h; navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === h)); }
    });
  }
  measure(); onScroll();
  addEventListener('scroll', onScroll, {passive:true});
  addEventListener('resize', () => { measure(); onScroll(); });
  addEventListener('load', () => { measure(); onScroll(); });

  // Âncoras
  let lenisRef = null;
  const hh = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hh')) || 84;
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); const t = id.length > 1 && $(id); if (!t) return;
    e.preventDefault();
    const y = id === '#inicio' ? 0 : t.getBoundingClientRect().top + scrollY - hh() + 8;
    lenisRef ? lenisRef.scrollTo(y) : scrollTo({top:y, behavior: reduce ? 'auto' : 'smooth'});
    // Acessibilidade: leva o foco à seção e registra o hash (botão voltar funciona)
    t.setAttribute('tabindex', '-1'); t.focus({preventScroll:true});
    history.pushState(null, '', id);
  }));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); onScroll(); });

  // Só no desktop: carrega GSAP, ScrollTrigger e Lenis sob demanda (o celular não baixa nada disso)
  if (mobile || reduce) return;
  const load = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  load('vendor/gsap.min.js')
    .then(() => load('vendor/ScrollTrigger.min.js'))
    .then(() => load('vendor/lenis.min.js').catch(() => {}))
    .then(enhance).catch(() => {});

  function enhance(){
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);
    if (window.Lenis){
      const lenis = new Lenis({lerp:.1});
      lenisRef = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
    }
    const hs = {trigger:'.hero', start:'top top', end:'bottom top', scrub:true};
    gsap.to('#blue', {yPercent:18, ease:'none', scrollTrigger:hs});
    gsap.to('#b1', {yPercent:-16, xPercent:-12, ease:'none', scrollTrigger:hs});
    gsap.to('#b2', {yPercent:22, ease:'none', scrollTrigger:hs});
    gsap.to('#b3', {yPercent:-10, xPercent:14, ease:'none', scrollTrigger:hs});

    $$('.rv').forEach(el => gsap.from(el, {y:24, opacity:0, ease:'none', scrollTrigger:{trigger:el, start:'top 92%', end:'top 72%', scrub:true}}));
    gsap.fromTo('#ph', {clipPath:'inset(0 0 100% 0)'}, {clipPath:'inset(0 0 0% 0)', ease:'none', scrollTrigger:{trigger:'#photo', start:'top 88%', end:'top 40%', scrub:true}});
    gsap.fromTo('#ph img', {scale:1.25}, {scale:1, ease:'none', scrollTrigger:{trigger:'#photo', start:'top 88%', end:'bottom 40%', scrub:true}});
    gsap.from('#why .card', {y:30, opacity:0, stagger:.12, ease:'none', scrollTrigger:{trigger:'#why', start:'top 92%', end:'top 50%', scrub:true}});
    gsap.from('.tile', {y:24, opacity:0, stagger:{each:.04, from:'start'}, ease:'none', scrollTrigger:{trigger:'#tiles', start:'top 92%', end:'bottom 70%', scrub:true}});
    rows.forEach(r => gsap.from(r, {y:26, opacity:0, ease:'none', scrollTrigger:{trigger:r, start:'top 95%', end:'top 76%', scrub:true}}));
    gsap.from('#band', {y:50, opacity:0, ease:'none', scrollTrigger:{trigger:'#band', start:'top 98%', end:'top 62%', scrub:true}});
    ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
})();
