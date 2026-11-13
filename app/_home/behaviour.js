// Behaviour for the home page: the hero painting, the quality log, the chat, the estimate
// and the dock. Plain DOM code, started once by home-behaviour.tsx.
/* eslint-disable */

export function startHome() {
  const root = document.getElementById("pg");
  if (!root || root.dataset.started) return;
  root.dataset.started = "1";
{
/* ---------- nav + dock ---------- */
const nav = document.getElementById('nav'), dock = document.getElementById('dock'), wrap = document.getElementById('herowrap'), costEl = document.getElementById('cost'), closeEl = document.querySelector('.close');
let costVisible = false, closeVisible = false;
function onScroll(){
  const end = wrap.offsetTop + wrap.offsetHeight - innerHeight;
  nav.classList.toggle('solid', scrollY > end - 40);
  dock.classList.toggle('on', scrollY > end + innerHeight * .35 && !costVisible && !closeVisible);
}
addEventListener('scroll', onScroll, { passive:true }); addEventListener('resize', onScroll);
new IntersectionObserver(es => es.forEach(e => { costVisible = e.isIntersecting; onScroll(); }), { threshold:0.12 }).observe(costEl);
new IntersectionObserver(es => es.forEach(e => { closeVisible = e.isIntersecting; onScroll(); }), { threshold:0.1 }).observe(closeEl);
window.updateDock = function(e){
  document.getElementById('sealT').textContent = 'Send my estimate';
  document.getElementById('sealP').textContent = e.v + ' ' + e.u;
  document.getElementById('seal').href = e.href;
};
(function(){
  const seal = document.getElementById('seal'), dockEl = document.getElementById('dock'), btn = seal.querySelector('.seal-btn');
  const ink1 = document.getElementById('ink1'), ink2 = document.getElementById('ink2'), wob = document.getElementById('wob');
  const loadT = document.getElementById('loadT'), dots = document.getElementById('dots');
  let pass = false;
  function bloom(cx, cy){
    const r = btn.getBoundingClientRect(), x = cx - r.left + 30, y = cy - r.top + 30, R = Math.hypot(r.width, r.height) + 30, t0 = performance.now();
    for (const c of [ink1, ink2]) { c.setAttribute('cx', x); c.setAttribute('cy', y); }
    (function grow(now){
      const e = Math.min(1, (now - t0) / 1100), q = 1 - Math.pow(1 - e, 3);
      ink1.setAttribute('r', (R * q).toFixed(1)); ink2.setAttribute('r', (R * .7 * Math.min(1, q * 1.15)).toFixed(1));
      ink2.setAttribute('cx', (x - 14 * q).toFixed(1));
      if (e < 1) requestAnimationFrame(grow);
    })(t0);
  }
  function reset(){ dockEl.classList.remove('inking'); ink1.setAttribute('r', 0); ink2.setAttribute('r', 0); loadT.textContent = 'Opening WhatsApp'; dots.textContent = ''; }
  seal.addEventListener('click', e => {
    if (pass) { pass = false; return; }
    e.preventDefault();
    if (dockEl.classList.contains('inking')) { if (loadT.textContent.startsWith('Tap')) { pass = true; seal.click(); } return; }
    const r = btn.getBoundingClientRect();
    bloom(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2);
    dockEl.classList.add('inking');
    try { wob.beginElement(); } catch (_) {}
    let n = 1; const tk = setInterval(() => { dots.textContent = '.'.repeat(n++ % 4); }, 380);
    setTimeout(() => { pass = true; seal.click(); }, 2500);
    setTimeout(() => { clearInterval(tk); dots.textContent = ''; loadT.textContent = 'Tap to open WhatsApp'; }, 3400);
    setTimeout(reset, 8000);
  });
})();

/* ---------- reveal ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const t = e.target; t.classList.add('in'); io.unobserve(t); setTimeout(() => { t.style.transitionDelay = ''; t.classList.add('shown'); }, 900 + (parseFloat(t.style.transitionDelay) || 0)); } }), { threshold:0.12, rootMargin:'0px 0px -6% 0px' });
document.querySelectorAll('.rv').forEach((el, i) => { el.style.transitionDelay = (el.parentElement.querySelectorAll(':scope > .rv').length > 1 ? ([...el.parentElement.children].indexOf(el) % 6) * 70 : 0) + 'ms'; io.observe(el); });

/* ---------- quality log ticking ---------- */
(function(){
  const rows = [...document.querySelectorAll('#log tbody tr')], cnt = document.getElementById('cnt');
  if (matchMedia('(min-width:640px)').matches) document.querySelector('.whenh').style.display = '';
  let started = false;
  new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting || started) return; started = true;
    rows.forEach((r, i) => setTimeout(() => {
      r.classList.add('done'); r.querySelector('.t').textContent = 'Passed';
      cnt.textContent = (i + 1) + ' of 7 passed';
    }, 700 + i * 520));
  }), { threshold:0.45 }).observe(document.getElementById('log'));
})();

/* ---------- chat arriving ---------- */
(function(){
  const msgs = [...document.querySelectorAll('#chat .msg')], typing = document.getElementById('typing');
  let started = false;
  new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting || started) return; started = true;
    let t = 300;
    msgs.forEach((m, i) => {
      const mine = m.classList.contains('me');
      if (!mine) { setTimeout(() => { typing.classList.add('on'); m.before(typing); }, t); t += 900; }
      else t += 900;
      setTimeout(() => { typing.classList.remove('on'); m.classList.add('in'); }, t);
      t += 650;
    });
  }), { threshold:0.4 }).observe(document.getElementById('phone'));
})();

/* ---------- estimator ---------- */
(function(){
  const RATES = { stilt:2000, part:2100, none:2200 }, NAMES = { stilt:'stilt', part:'part stilt', none:'no stilt' };
  const COVER = 0.6933; // built-up per floor as a share of plot area
  const st = { w:30, d:40, f:2, p:'stilt' }; let touched = false;
  const $ = id => document.getElementById(id), wIn = $('w'), dIn = $('d');
  const fmtINR = n => n.toLocaleString('en-IN');
  function money(n){
    if (n >= 1e7) return ['₹' + (n / 1e7).toFixed(2), 'crore'];
    return ['₹' + (n / 1e5).toFixed(1), 'lakh'];
  }
  let shown = null, totalRaf = 0;
  const calmNum = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function paintTotal(n){ const [v, u] = money(n); $('total').innerHTML = v + '<small>' + u + '</small>'; }
  function showTotal(to){
    cancelAnimationFrame(totalRaf);
    if (shown === null || calmNum) { shown = to; paintTotal(to); return; }
    const from = shown, t0 = performance.now();
    (function f(now){
      const e = Math.min(1, (now - t0) / 420), q = 1 - Math.pow(1 - e, 3);
      shown = from + (to - from) * q; paintTotal(e < 1 ? shown : to);
      if (e < 1) totalRaf = requestAnimationFrame(f); else shown = to;
    })(t0);
  }
  function render(){
    const area = Math.round(st.w * st.d * COVER) * st.f, rate = RATES[st.p], total = area * rate;
    const [v, u] = money(total);
    showTotal(total);
    $('area').textContent = fmtINR(area) + ' sq ft';
    $('rate').textContent = '₹' + fmtINR(rate) + ' / sq ft';
    const fl = st.f === 1 ? 'G' : 'G+' + (st.f - 1);
    $('sum').textContent = fl + ' on ' + st.w + ' × ' + st.d + ' ft, ' + NAMES[st.p];
    $('send').href = 'https://wa.me/918330972705?text=' + encodeURIComponent(
      'Hi Briklay, I used the estimator: ' + fl + ' on a ' + st.w + ' x ' + st.d + ' ft plot, ' + NAMES[st.p] + ' parking. Estimate: ' + v + ' ' + u + '. Please get in touch.');
    if (touched && window.updateDock) updateDock({ v, u, label: fl + ' · ' + st.w + '×' + st.d + ' ft', href: $('send').href });
    document.querySelectorAll('#chips .chip').forEach(c => c.classList.toggle('on', +c.dataset.w === st.w && +c.dataset.d === st.d));
  }
  document.querySelectorAll('#chips .chip').forEach(c => c.addEventListener('click', () => {
    touched = true; st.w = +c.dataset.w; st.d = +c.dataset.d; wIn.value = st.w; dIn.value = st.d; render();
  }));
  function readDims(){
    const w = parseInt(wIn.value, 10), d = parseInt(dIn.value, 10);
    touched = true; if (w >= 10 && w <= 300) st.w = w; if (d >= 10 && d <= 300) st.d = d; render();
  }
  wIn.addEventListener('input', readDims); dIn.addEventListener('input', readDims);
  function seg(id, key, num){
    document.querySelectorAll('#' + id + ' button').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('#' + id + ' button').forEach(x => x.classList.toggle('on', x === b));
      touched = true; st[key] = num ? +b.dataset.v : b.dataset.v; render();
    }));
  }
  seg('floors', 'f', true); seg('park', 'p', false);
  render();
})();
}
{
(function(){
  const hero = document.getElementById('top'), wrap = document.getElementById('herowrap'), sheet = document.getElementById('sheet');
  const lens = document.getElementById('lens'), cue = document.getElementById('cue'), hint = document.getElementById('hint'), nav = document.getElementById('nav');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, touch = matchMedia('(hover: none)').matches;
  hint.textContent = touch ? 'Tap, or hold and drag, to light it up' : 'Move over the house to light it up';
  const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

  // 1. sketch reveal, then the washes bloom in
  const day = new Image(); day.src = getComputedStyle(document.querySelector('.pl.day')).backgroundImage.slice(5, -2);
  let t0 = null;
  function reveal(now){
    if (t0 === null) t0 = now;
    const e = (now - t0) / 1000;
    hero.style.setProperty('--rev', reduce ? 1 : ss(0, 1.8, e).toFixed(3));
    hero.style.setProperty('--wash', reduce ? 1 : ss(1.2, 2.8, e).toFixed(3));
    if (e < 2.9 && !reduce) requestAnimationFrame(reveal);
  }
  const go = () => requestAnimationFrame(reveal);
  const dusk = new Image(); dusk.src = getComputedStyle(document.querySelector('.pl.dusk')).backgroundImage.slice(5, -2);
  if (dusk.decode) dusk.decode().catch(() => {});
  day.complete ? go() : (day.onload = go, day.onerror = go);

  // 2. scroll: day into dusk, eased so a fast flick never snaps the light
  let k = 0, kT = 0, p = 0, loop = false, lastT = 0;
  let mode = 'day', glideRaf = 0, glideTimer = 0;
  function glide(to, dur){
    cancelAnimationFrame(glideRaf);
    const from = scrollY, t0 = performance.now(), ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    (function f(now){ const e = Math.min(1, (now - t0) / dur); scrollTo({ top: from + (to - from) * ease(e), behavior: 'instant' }); glideRaf = e < 1 ? requestAnimationFrame(f) : 0; })(t0);
  }
  const stopGlide = () => { cancelAnimationFrame(glideRaf); glideRaf = 0; clearTimeout(glideTimer); };
  let finger = false, lastScroll = 0, wantGlide = false;
  if (touch) {
    addEventListener('touchstart', () => { finger = true; wantGlide = false; if (!held) stopGlide(); }, { passive:true });
    const up = () => { finger = false; }; addEventListener('touchend', up, { passive:true }); addEventListener('touchcancel', up, { passive:true });
    addEventListener('wheel', () => { wantGlide = false; stopGlide(); }, { passive:true });
    // phones: the first swipe up does not move the page. The hero holds still, turns fully to dusk,
    // and only then does the page travel on to the next section.
    if (!reduce) {
      let sy = 0, sx = 0;
      addEventListener('touchstart', e => { const t = e.touches[0]; if (t) { sx = t.clientX; sy = t.clientY; } heldGesture = false; }, { passive:true });
      addEventListener('touchmove', e => {
        if (tracking || e.touches.length > 1) return;
        if (held || heldGesture) { if (e.cancelable) e.preventDefault(); return; }
        if (mode !== 'day' || scrollY > 8 || !e.cancelable) return;
        const t = e.touches[0], dy = t.clientY - sy, dx = t.clientX - sx;
        if (dy < -6 && Math.abs(dy) > Math.abs(dx)) {
          e.preventDefault();
          held = heldGesture = true; mode = 'dusk'; kT = 1; wantGlide = false; stopGlide();
          clearTimeout(heldTimer); heldTimer = setTimeout(release, 3200);
          cue.style.opacity = 0;
          if (!loop) { loop = true; lastT = performance.now(); requestAnimationFrame(stepK); }
        }
      }, { passive:false });
    }
  }
  let held = false, heldGesture = false, heldTimer = 0;
  function release(){
    if (!held) return;
    held = false; clearTimeout(heldTimer);
    const how = document.getElementById('how');
    if (scrollY < how.offsetTop - 80) glide(how.offsetTop - 64, 1400);
  }
  // wait until the dusk has played and the page has come to rest, then carry on to the next section
  function tryGlide(){
    clearTimeout(glideTimer);
    if (!wantGlide || mode !== 'dusk') return;
    const how = document.getElementById('how');
    if (scrollY >= how.offsetTop - 80) { wantGlide = false; return; }
    if (finger || k < .93 || performance.now() - lastScroll < 260) { glideTimer = setTimeout(tryGlide, 120); return; }
    wantGlide = false; glide(how.offsetTop - 64, 1400);
  }
  // one switch for every colour that changes with the light; the gap between on and off stops it chattering
  let dark = false;
  function setDark(){
    if (!dark && k > .56) dark = true; else if (dark && k < .44) dark = false;
    hero.classList.toggle('dark', dark);
    nav.classList.toggle('ondark', dark && wrap.getBoundingClientRect().bottom > 80);
  }
  function readScroll(){
    p = Math.min(1, Math.max(0, -wrap.getBoundingClientRect().top / (wrap.offsetHeight - innerHeight)));
    if (touch) {
      // phones: the first swipe plays the whole dusk, then the page glides on to the next section
      if (!glideRaf) lastScroll = performance.now();
      if (mode === 'day' && scrollY > 24) {
        mode = 'dusk'; kT = 1;
        if (!reduce) { wantGlide = true; clearTimeout(glideTimer); glideTimer = setTimeout(tryGlide, 900); }
      } else if (mode === 'dusk' && scrollY < 8 && !held && !glideRaf) { mode = 'day'; kT = 0; wantGlide = false; stopGlide(); }
    } else {
      kT = ss(.06, .82, p);
    }
    cue.style.opacity = (1 - ss(0, .12, touch ? (mode === 'dusk' ? 1 : 0) : p)).toFixed(3);
    setDark();
    if (!loop) { loop = true; lastT = performance.now(); requestAnimationFrame(stepK); }
  }
  function stepK(now){
    const dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
    k += (kT - k) * (reduce ? 1 : 1 - Math.exp(-dt * (touch ? 2.4 : 3.2)));
    hero.style.setProperty('--k', k.toFixed(4));
    setDark();
    if (held && k > .95) release();
    if (Math.abs(kT - k) > .001) requestAnimationFrame(stepK); else loop = false;
  }
  addEventListener('scroll', readScroll, { passive:true }); addEventListener('resize', readScroll); readScroll();

  /* ---------- the people: soft backlit silhouettes, as if seen through sheer glass ---------- */
  (function(){
    const svg = document.getElementById('story');
    const L = { desk: { w: 2400, h: 1400, S: 9.6, gy: 1356 }, mob: { w: 1200, h: 2000, S: 15.2, gy: 1820 } };
    const mq = matchMedia('(max-aspect-ratio:4/5)');
    const MAN = 'M-.09,-4.93 L-.09,-4.8 C-.26,-4.78 -.47,-4.74 -.54,-4.6 C-.6,-4.3 -.61,-3.9 -.6,-3.55 L-.58,-2.66 C-.56,-2.58 -.48,-2.58 -.46,-2.66 L-.43,-3.3 L-.37,-2.75 L-.33,-.06 L-.11,-.06 L-.05,-2.42 L.05,-2.42 L.11,-.06 L.33,-.06 L.37,-2.75 L.43,-3.3 L.46,-2.66 C.48,-2.58 .56,-2.58 .58,-2.66 L.6,-3.55 C.61,-3.9 .6,-4.3 .54,-4.6 C.47,-4.74 .26,-4.78 .09,-4.8 L.09,-4.93 Z';
    const WOMAN = 'M-.08,-4.9 L-.08,-4.78 C-.22,-4.76 -.4,-4.72 -.45,-4.58 C-.5,-4.28 -.5,-3.9 -.5,-3.55 L-.49,-2.75 C-.47,-2.67 -.4,-2.67 -.38,-2.75 L-.36,-3.3 L-.32,-2.9 C-.4,-2.2 -.48,-1.1 -.52,-.06 L.52,-.06 C.48,-1.1 .4,-2.2 .32,-2.9 L.36,-3.3 L.38,-2.75 C.4,-2.67 .47,-2.67 .49,-2.75 L.5,-3.55 C.5,-3.9 .5,-4.28 .45,-4.58 C.4,-4.72 .22,-4.76 .08,-4.78 L.08,-4.9 Z';
    function fig(kind, x, y, o = {}){
      const s = (o.s || .86), sway = o.still ? '' : `<animateTransform attributeName="transform" type="rotate" values="-.5 0 0;.5 0 0;-.5 0 0" dur="${o.sd || 8}s" begin="${o.b || 0}s" repeatCount="indefinite"/>`;
      const head = kind === 'w' ? '<ellipse cx="0" cy="-5.2" rx=".24" ry=".3"/><ellipse cx=".02" cy="-5.44" rx=".2" ry=".12"/>' : '<ellipse cx="0" cy="-5.24" rx=".26" ry=".32"/>';
      const drift = o.drift ? `<animateTransform attributeName="transform" type="translate" values="0,0;${o.drift},0;${o.drift},0;0,0;0,0" keyTimes="0;.3;.5;.8;1" calcMode="spline" keySplines=".45 0 .55 1;0 0 1 1;.45 0 .55 1;0 0 1 1" dur="${o.dd || 24}s" begin="${o.b || 0}s" repeatCount="indefinite"/>` : '';
      return `<g transform="translate(${x} ${-y}) scale(${s})"><g>${drift}<g class="sil" filter="url(#soft)">${sway}${head}<path d="${kind === 'w' ? WOMAN : MAN}"/></g></g></g>`;
    }
    // a climber who rises tread by tread, then fades at the landing
    function climber(){
      const x0 = 29.1, y0 = 26.75, rise = .62, n = 13, per = .85, dur = n * per + 3.2;
      const vals = [], kt = [], spl = [];
      for (let i = 0; i <= n; i++) { const t = (i * per) / dur; vals.push(`${x0 + (i % 2 ? .05 : -.05)},${-(y0 + i * rise)}`); kt.push(t.toFixed(4)); if (i) spl.push('.55 0 .35 1'); }
      vals.push(vals[vals.length - 1]); kt.push('1'); spl.push('0 0 1 1');
      const last = (n * per / dur);
      return `<g><animateTransform attributeName="transform" type="translate" values="${vals.join(';')}" keyTimes="${kt.join(';')}" calcMode="spline" keySplines="${spl.join(';')}" dur="${dur}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;.08;${(last * .92).toFixed(3)};${last.toFixed(3)};1" dur="${dur}s" repeatCount="indefinite"/>
        <g transform="scale(.8)"><g class="sil" filter="url(#soft)"><ellipse cx="0" cy="-5.24" rx=".26" ry=".32"/><path d="${MAN}"/></g></g></g>`;
    }
    const clip = (id, x0, y0, x1, y1) => `<clipPath id="${id}"><rect x="${x0}" y="${-y1}" width="${x1 - x0}" height="${y1 - y0}"/></clipPath>`;
    // two quiet geometric figures: a circle on a triangle, a circle on a box
    function geo(kind, x, y, o = {}){
      const h = 3.9, r = .3;
      const body = kind === 'tri'
        ? `<path d="M0,${-(h - 2 * r - .12)} L.62,0 L-.62,0 Z"/>`
        : `<rect x="-.42" y="${-(h - 2 * r - .12)}" width=".84" height="${h - 2 * r - 1.35}" rx=".08"/><rect x="-.32" y="-1.35" width=".24" height="1.35"/><rect x=".08" y="-1.35" width=".24" height="1.35"/>`;
      const bob = `<animateTransform attributeName="transform" type="translate" values="0,0;0,-.05;0,0" dur="${o.d || 6}s" begin="${o.b || 0}s" repeatCount="indefinite"/>`;
      return `<g transform="translate(${x} ${-y})" class="geo"><g>${bob}<circle cx="0" cy="${-(h - r)}" r="${r}"/></g>${body}</g>`;
    }
    function build(){
      const c = mq.matches ? L.mob : L.desk, ox = c.w / 2 - 20.7 * c.S;
      svg.setAttribute('viewBox', `0 0 ${c.w} ${c.h}`);
      svg.innerHTML = `<defs>${clip('cGF', 2.05, 14.35, 21.2, 22.85)}</defs>
      <g transform="matrix(${c.S} 0 0 ${c.S} ${ox} ${c.gy})">
        <g clip-path="url(#cGF)">${geo('box', 12.6, 14.35, { d: 7, b: 1.5 })}</g>
        ${geo('tri', 11.2, 24.15, { d: 6 })}
      </g>`;
    }
    build(); mq.addEventListener ? mq.addEventListener('change', build) : mq.addListener(build);
  })();

  // the clouds and the figures rest while the hero is off screen
  if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(e => {
    hero.classList.toggle('away', !e.isIntersecting);
    const st = document.getElementById('story');
    try { e.isIntersecting ? st.unpauseAnimations() : st.pauseAnimations(); } catch (_) {}
  })).observe(hero);

  // 3. light lens: a small disc moved by the compositor, never a full-screen repaint
  const lensIn = lens.firstElementChild;
  let LR = 170, box = null;
  function sizeLens(){
    LR = touch ? 125 : 170;
    lens.style.width = lens.style.height = (2 * LR) + 'px'; lens.style.margin = (-LR) + 'px 0 0 ' + (-LR) + 'px';
    lensIn.style.width = sheet.offsetWidth + 'px'; lensIn.style.height = sheet.offsetHeight + 'px';
  }
  sizeLens(); addEventListener('resize', sizeLens);
  const local = (cx, cy) => { box = box || sheet.getBoundingClientRect(); return [cx - box.left, cy - box.top]; };
  addEventListener('scroll', () => { box = null; }, { passive:true }); addEventListener('resize', () => { box = null; });
  const L = { x: 0, y: 0, tx: 0, ty: 0, o: 0, to: 0 }; let running = false, last = 0;
  function place(){
    lens.style.transform = 'translate3d(' + L.x.toFixed(1) + 'px,' + L.y.toFixed(1) + 'px,0)';
    lensIn.style.transform = 'translate3d(' + (LR - L.x).toFixed(1) + 'px,' + (LR - L.y).toFixed(1) + 'px,0)';
    lens.style.opacity = L.o.toFixed(3);
  }
  const tilt = { rx: 0, ry: 0, trx: 0, try: 0 };
  function kick(){ if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); } }
  function tick(now){
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const a = 1 - Math.exp(-dt * (touch ? 16 : 11)), b = 1 - Math.exp(-dt * (L.to ? 6 : 3));
    L.x += (L.tx - L.x) * a; L.y += (L.ty - L.y) * a; L.o += (L.to - L.o) * b;
    place();
    if (!touch && !reduce) {
      const c = 1 - Math.exp(-dt * 3.5); tilt.rx += (tilt.trx - tilt.rx) * c; tilt.ry += (tilt.try - tilt.ry) * c;
      sheet.style.transform = 'rotateX(' + tilt.rx.toFixed(3) + 'deg) rotateY(' + tilt.ry.toFixed(3) + 'deg)';
    }
    const moving = Math.abs(L.tx - L.x) + Math.abs(L.ty - L.y) > .3 || Math.abs(L.to - L.o) > .003 || (!touch && Math.abs(tilt.trx - tilt.rx) + Math.abs(tilt.try - tilt.ry) > .002);
    if (moving || tracking) requestAnimationFrame(tick); else running = false;
  }
  let tracking = false;
  if (!touch) {
    hero.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const [x, y] = local(e.clientX, e.clientY);
      if (L.o < .02) { L.x = x; L.y = y; }
      L.tx = x; L.ty = y; L.to = 1;
      const r = hero.getBoundingClientRect();
      tilt.try = ((e.clientX - r.left) / r.width - .5) * 2.4; tilt.trx = -((e.clientY - r.top) / r.height - .5) * 1.6;
      hint.classList.add('gone'); kick();
    }, { passive:true });
    hero.addEventListener('pointerleave', () => { L.to = 0; tilt.trx = tilt.try = 0; kick(); });
  } else {
    // tap: glow blooms where you touched. press and hold, then drag: the glow follows your finger.
    let down = null, holdT = 0, fadeT = 0;
    hero.addEventListener('touchstart', e => {
      const t = e.touches[0]; if (!t || e.touches.length > 1 || e.target.closest('a')) return;
      box = null; down = { x: t.clientX, y: t.clientY, t: performance.now() };
      clearTimeout(holdT); clearTimeout(fadeT);
      holdT = setTimeout(() => { if (!down) return; tracking = true; const [x, y] = local(down.x, down.y); L.x = L.tx = x; L.y = L.ty = y; L.to = 1; hint.classList.add('gone'); kick(); }, 220);
    }, { passive:true });
    hero.addEventListener('touchmove', e => {
      if (tracking) { e.preventDefault(); const t = e.touches[0]; const [x, y] = local(t.clientX, t.clientY); L.tx = x; L.ty = y; return; }
      if (down) { const t = e.touches[0]; if (Math.hypot(t.clientX - down.x, t.clientY - down.y) > 10) { clearTimeout(holdT); down = null; } }
    }, { passive:false });
    const release = () => {
      clearTimeout(holdT);
      if (tracking) { tracking = false; down = null; L.to = 0; kick(); return; }
      if (!down) return;
      const d = down; down = null;
      if (performance.now() - d.t > 600) return;
      const [x, y] = local(d.x, d.y); L.x = L.tx = x; L.y = L.ty = y; L.to = 1; hint.classList.add('gone'); kick();
      fadeT = setTimeout(() => { L.to = 0; kick(); }, 1800);
    };
    hero.addEventListener('touchend', release, { passive:true }); hero.addEventListener('touchcancel', release, { passive:true });
    addEventListener('scroll', () => { if (L.to && !tracking) { L.to = 0; kick(); } }, { passive:true });
  }
})();
}
}
