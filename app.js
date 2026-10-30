(function(){
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const PHONE = '5515997275246';
  const wa = t => 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(t);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };

  $('#yr').textContent = new Date().getFullYear();
  const hello = wa('Olá, Marcos! Vi seu portfólio e quero conversar.');
  ['#wa-nav', '#wa-pill', '#fab'].forEach(s => { const a = $(s); if (a) a.href = hello; });
  $$('[data-wa]').forEach(a => a.href = wa('Olá, Marcos! Quero um orçamento de: ' + a.dataset.wa + '.'));

  // Formulário -> WhatsApp (texto do visitante sempre limpo, limitado e codificado)
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

  // Copiar número
  const copyBtn = $('#copy');
  copyBtn.addEventListener('click', async () => {
    const txt = '+55 15 99727-5246';
    try { await navigator.clipboard.writeText(txt); copyBtn.textContent = 'copiado'; }
    catch { copyBtn.textContent = 'selecione e copie'; }
    setTimeout(() => copyBtn.textContent = 'copiar', 1800);
  });

  // Foto: aviso se o arquivo não existir
  const img = $('#avatar img');
  const photoFail = () => { const d = el('div', 'none', 'Salve sua foto como foto.webp'); $('#avatar').replaceChildren(d); };
  if (img){ img.addEventListener('error', photoFail); if (img.complete && !img.naturalWidth && img.currentSrc) photoFail(); }

  // Nome: letra por letra, com recorte vertical (a camada de recorte some ao terminar, para o brilho não ser cortado)
  const nameEl = $('#name');
  const full = nameEl.getAttribute('aria-label');
  nameEl.textContent = '';
  Array.from(full).forEach((c, i) => {
    const ch = el('span', 'ch'); ch.setAttribute('aria-hidden', 'true');
    const s = el('span', '', c === ' ' ? ' ' : c); s.style.setProperty('--i', i);
    ch.append(s); nameEl.append(ch);
  });
  const cur = el('span', 'cur', '_'); cur.setAttribute('aria-hidden', 'true'); nameEl.append(cur);
  const lastLetter = $$('.ch > span', nameEl).pop();
  const finish = () => nameEl.classList.add('done');
  if (reduce) finish(); else if (lastLetter) lastLetter.addEventListener('animationend', finish);

  // Linhas de comando "digitadas" ao entrar na tela
  const cmds = $$('.cmd[data-type]');
  cmds.forEach(c => { const t = $('.t', c); c.style.setProperty('--n', Math.max(1, t.textContent.length)); t.style.setProperty('--n', Math.max(1, t.textContent.length)); });
  if ('IntersectionObserver' in window && !reduce){
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); } }), {threshold:.6});
    cmds.forEach(c => { if (!c.classList.contains('on')) io.observe(c); });
  } else cmds.forEach(c => c.classList.add('on'));

  // Prévias em carrossel infinito (conteúdo duplicado para o loop sem emenda)
  const L = c => `<i class="l ${c || ''}"></i>`;
  const previews = [
    ['landing-page/', 'R$ 450', `<div class="b h"></div>${L('m')}${L('s')}<div class="v" style="height:18px;width:42%"></div>`],
    ['site-institucional/', 'R$ 1.300', `<div class="b" style="height:14px"></div><div class="g2"><div style="display:grid;gap:6px;align-content:start">${L('m')}${L('s')}<div class="v" style="height:16px;width:60%"></div></div><div class="b h"></div></div>`],
    ['loja-virtual/', 'R$ 2.700', `<div class="b" style="height:12px"></div><div class="gs"><div class="b sq"></div><div class="b sq"></div><div class="b sq"></div></div><div class="v" style="height:16px;width:38%"></div>`],
    ['sistema-web/', 'R$ 4.500', `<div class="side"><div class="b" style="height:88px"></div><div style="display:grid;gap:7px"><div class="gs"><div class="v" style="height:26px"></div><div class="b" style="height:26px"></div><div class="b" style="height:26px"></div></div><div class="b tr"></div><div class="b tr sel"></div><div class="b tr"></div></div></div>`],
    ['automacao-basica/', 'R$ 750', `<div class="b bub"></div><div class="bub r"></div><div class="b bub"></div><div class="bub r"></div>`]
  ];
  const makeSet = hidden => {
    const set = el('div', 'mq-set');
    if (hidden) set.setAttribute('aria-hidden', 'true');
    previews.forEach(([name, price, html]) => {
      const c = el('div', 'pv');
      const h = el('div', 'pv-h'); h.append(el('span', '', name), el('span', '', price));
      const s = el('div', 'screen'); s.innerHTML = html;           // conteúdo fixo do próprio código
      const f = el('div', 'pv-f', 'a partir de');
      c.append(h, s, f); set.append(c);
    });
    return set;
  };
  const track = $('#mq'); track.append(makeSet(false), makeSet(true));

  // Indicador de passos (violeta): avança a cada 1,5 s, a linha preenche com transição de largura e reinicia ao final
  const steps = $$('.st', $('#steps')), fills = $$('.sg i', $('#steps')), stepsEl = $('#steps'), cap = $('#cap');
  const texts = [
    ['Conversa', 'Você conta a ideia pelo WhatsApp e tira as dúvidas.'],
    ['Orçamento', 'Prazo e preço fechados antes de começar.'],
    ['Criação', 'Eu construo o projeto sob medida para você.'],
    ['Entrega', 'Publicação e suporte depois da entrega.']
  ];
  let cur2 = 0, timer = null;
  function paint(i){
    steps.forEach((s, k) => {
      s.classList.toggle('act', k === i);
      s.classList.toggle('done', k < i);
      if (k === i) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current');
    });
    fills.forEach((f, k) => f.classList.toggle('on', k < i));
    cap.replaceChildren(el('b', '', (i + 1) + '/4 ' + texts[i][0] + ': '), document.createTextNode(texts[i][1]));
  }
  function next(){
    if (cur2 >= steps.length - 1){
      cur2 = 0;
      stepsEl.classList.add('reset'); paint(0);            // volta ao início sem animar o recuo da linha
      void stepsEl.offsetWidth; stepsEl.classList.remove('reset');
    } else paint(++cur2);
  }
  paint(0);
  if (reduce){ paint(steps.length - 1); }
  else if ('IntersectionObserver' in window){
    new IntersectionObserver(es => {
      const vis = es[es.length - 1].isIntersecting;
      if (vis && !timer) timer = setInterval(next, 1500);
      else if (!vis && timer){ clearInterval(timer); timer = null; }
    }, {threshold:.3}).observe(stepsEl);
  } else timer = setInterval(next, 1500);

  // Link ativo do menu e botão fixo do WhatsApp (leitura de scroll uma vez por quadro)
  const links = $$('.tnav a'), fab = $('#fab');
  let tops = {}, tick = false, lastShow = null, active = '#inicio';
  const measure = () => { tops = {projetos:$('#projetos').offsetTop, contato:$('#contato').offsetTop}; };
  function onScroll(){
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = scrollY, show = y > 500 && y < tops.contato - innerHeight * .5;
      if (show !== lastShow){ lastShow = show; fab.classList.toggle('show', show); }
      const lim = y + innerHeight * .5;
      const h = lim > tops.contato ? '#contato' : lim > tops.projetos ? '#projetos' : '#inicio';
      if (h !== active){ active = h; links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === h)); }
    });
  }
  measure(); onScroll();
  addEventListener('scroll', onScroll, {passive:true});
  addEventListener('resize', () => { measure(); onScroll(); });
  addEventListener('load', () => { measure(); onScroll(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); onScroll(); });
})();
