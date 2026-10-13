// Behaviour for the home page: the opening film, the estimate, and the things that
// arrive as you read. Plain DOM code, started once by home-behaviour.tsx.

export function startHome() {
  var doc = document, root = doc.getElementById("pg");
  if (!root || root.dataset.started) return;
  root.dataset.started = "1";
  var $ = function (id) { return doc.getElementById(id); };
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WA = "https://wa.me/918330972705?text=";
  var MESSAGES = {
    hello: "Hi Briklay, I am planning to build a home in Kakinada and would like to talk.",
    checklist: "Hi Briklay, please send me your full quality checklist for home construction.",
    pride: "Hi Briklay, I would like details of the flats at Bhaskar's The Pride, Vaidya Nagar.",
    interiors: "Hi, I would like to talk about interiors for my home.",
    homes: "Hi Briklay, I saw your homes on briklay.in. Please send me more photos and details."
  };
  doc.querySelectorAll("[data-wa]").forEach(function (a) { a.href = WA + encodeURIComponent(MESSAGES[a.dataset.wa]); });
  root.classList.add("js");

  function seen(el, fn, opts) {
    if (!("IntersectionObserver" in window)) { fn(el); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); fn(e.target); } });
    }, opts || { threshold: 0.2 });
    io.observe(el);
  }
  var n = function (v) { return Math.round(v).toLocaleString("en-IN"); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  doc.querySelectorAll("[data-r]").forEach(function (el) {
    seen(el, function (e) { e.classList.add("in"); }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  });

  /* ── the home, as the visitor describes it ── */
  var SETBACK = { front: 5, rear: 3, left: 2, right: 2 };
  var FLOORS = [
    { say: "ground-floor", name: "G", sub: "Ground floor only" },
    { say: "G+1", name: "G+1", sub: "Ground and one floor above" },
    { say: "G+2", name: "G+2", sub: "Ground and two floors above" },
    { say: "G+3", name: "G+3", sub: "Ground and three floors above" },
    { say: "G+4", name: "G+4", sub: "Ground and four floors above" }
  ];
  // the starting rate: smaller homes cost more per sq ft, and what stands at ground level adds to it
  var STILT = [
    { say: "stilt parking", sub: "The whole ground level is open parking.", add: 0 },
    { say: "part stilt", sub: "Parking, with a room or two beside it.", add: 100 },
    { say: "no stilt", sub: "Every floor is built. Parking is a bay inside the ground floor.", add: 200 }
  ];
  var baseRate = function (sft) { return sft < 5000 ? 2100 : sft <= 10000 ? 2000 : 1800; };
  var home = { w: 30, d: 40, floors: 2, stilt: 0 };
  function money(v) {
    if (v >= 10000000) return "₹" + (v / 10000000).toFixed(2) + " crore";
    return "₹" + (v / 100000).toFixed(1) + " lakh";
  }
  function price() {
    var slab = Math.round(Math.max(0, home.d - SETBACK.front - SETBACK.rear) * Math.max(0, home.w - SETBACK.left - SETBACK.right));
    var sft = slab * home.floors, st = STILT[home.stilt], base = baseRate(sft), rate = base + st.add;
    return { slab: slab, sft: sft, base: base, rate: rate, total: rate * sft, st: st };
  }

  /* the figure: only the characters that change turn over */
  var fig = $("fig"), figShown = "";
  function roll(text) {
    var parts = text.split(" "), num = parts[0], unit = parts[1] || "";
    var cells = fig.querySelectorAll("b");
    if (calm || !figShown || cells.length !== num.length) {
      fig.innerHTML = num.split("").map(function (c) { return "<b><i>" + esc(c) + "</i></b>"; }).join("") + (unit ? "<small>" + unit + "</small>" : "");
    } else {
      var k = 0;
      num.split("").forEach(function (c, i) {
        var cell = cells[i], old = cell.lastElementChild;
        if (old.textContent === c) return;
        while (cell.children.length > 1) cell.removeChild(cell.firstElementChild);
        var nu = doc.createElement("i"); nu.textContent = c; cell.appendChild(nu);
        var opt = { duration: 620, easing: "cubic-bezier(0.22, 1, 0.36, 1)", delay: k++ * 45, fill: "both" };
        old.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-90%)", opacity: 0 }], opt);
        nu.animate([{ transform: "translateY(90%)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }], opt).onfinish = function () {
          if (old.parentNode === cell) cell.removeChild(old);
        };
      });
      var sm = fig.querySelector("small"); if (sm) sm.textContent = unit;
    }
    figShown = text;
    $("figText").textContent = text;
  }
  function pick(group, v) {
    var idx = 0;
    group.querySelectorAll("button").forEach(function (b, i) {
      var on = Number(b.dataset.v) === v;
      b.setAttribute("aria-pressed", String(on)); if (on) idx = i;
    });
    group.style.setProperty("--k", idx);
  }
  var ownChip = $("plot-own"), bld = $("bld"), levels = [].slice.call(bld.querySelectorAll("i")).reverse();
  var buzz = function () { try { if (navigator.vibrate) navigator.vibrate(8); } catch {} };
  function draw() {
    // one storey for each floor above the ground level; the ground level shows what stands there
    levels.forEach(function (el, i) { el.classList.toggle("on", i < home.floors - 1); });
    var w = Math.round(50 + Math.max(0, Math.min(1, (home.w - 20) / 50)) * 50) + "px";
    bld.style.setProperty("--w", w); bld.parentNode.style.setProperty("--w", w);
    bld.style.setProperty("--wall", ["0%", "50%", "100%"][home.stilt]);
    $("dimText").textContent = home.w + " × " + home.d + " ft";
  }
  function render() {
    $("st-0").disabled = home.floors === 1; // a single ground floor cannot be all parking
    if (home.floors === 1 && home.stilt === 0) home.stilt = 2;
    var p = price(), fl = FLOORS[home.floors - 1], plot = home.w + " × " + home.d;
    var preset = false;
    doc.querySelectorAll("#plots .chip[data-w]").forEach(function (b) {
      var on = Number(b.dataset.w) === home.w && Number(b.dataset.d) === home.d;
      b.setAttribute("aria-pressed", String(on)); if (on) preset = true;
    });
    ownChip.setAttribute("aria-pressed", String(!preset));
    ownChip.textContent = preset ? "Other" : plot;
    pick($("floors"), home.floors); pick($("stilt"), home.stilt);
    draw();
    $("floorsHint").textContent = fl.sub;
    $("stiltNote").textContent = p.st.sub;
    STILT.forEach(function (st, i) { $("st-" + i + "-d").textContent = "₹" + n(p.base + st.add) + " per sq ft"; });
    $("ansPre").innerHTML = "<b>" + (home.floors === 1 ? "Ground-floor" : fl.name) + " home</b> on a " + esc(plot) + " ft plot";
    var text = p.total ? money(p.total) : "—";
    roll(text);
    $("ansLine").textContent = p.total ? n(p.sft) + " sq ft, from ₹" + n(p.rate) + " per sq ft" : "Nothing is left to build on after setbacks. Try a wider or deeper plot.";
    $("barSmall").textContent = fl.name + ", " + plot + " ft, from";
    $("barBig").textContent = text;
    var msg = p.total
      ? "Hi Briklay, I want to build a " + fl.say + " home with " + p.st.say + " on a " + plot + " ft plot in Kakinada. Your website shows it starting from " + text + " (" + n(p.sft) + " sq ft, from ₹" + n(p.rate) + " per sq ft). I would like to talk."
      : MESSAGES.hello;
    $("ansWa").href = $("barWa").href = WA + encodeURIComponent(msg);
  }
  $("plots").addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    home.w = Number(b.dataset.w); home.d = Number(b.dataset.d); buzz(); render();
  });
  ownChip.addEventListener("click", function () { open(); });
  // tap a choice; on the row of floors you can also drag across and the price follows the finger
  function choose(group, key, drag) {
    var btns = [].slice.call(group.querySelectorAll("button")), held = false;
    function set(b) { if (!b || b.disabled) return; var v = Number(b.dataset.v); if (home[key] === v) return; home[key] = v; buzz(); render(); }
    function at(x) { var r = group.getBoundingClientRect(); return btns[Math.max(0, Math.min(btns.length - 1, Math.floor((x - r.left) / (r.width / btns.length))))]; }
    group.addEventListener("click", function (e) { set(e.target.closest("button")); });
    if (!drag) return;
    group.addEventListener("pointerdown", function (e) { if (e.button) return; held = true; try { group.setPointerCapture(e.pointerId); } catch {} });
    group.addEventListener("pointermove", function (e) { if (held) set(at(e.clientX)); });
    ["pointerup", "pointercancel"].forEach(function (ev) { group.addEventListener(ev, function (e) { if (held && ev === "pointerup") set(at(e.clientX)); held = false; }); });
  }
  choose($("floors"), "floors", true); choose($("stilt"), "stilt", false);

  /* ── the sheet: only for a plot size that is not listed ── */
  var wrap = $("sheetWrap"), sheet = $("sheet"), body = $("sheetBody"), closing = 0;
  function open() {
    clearTimeout(closing);
    $("sheetTitle").textContent = "Your plot size";
    $("sheetSub").textContent = "Width along the road, then depth, in feet.";
    body.innerHTML = '<div class="dims">' +
      '<label class="dim"><span>Width</span><input type="number" inputmode="decimal" min="0" id="own-w" value="' + home.w + '" autocomplete="off"></label><i aria-hidden="true">×</i>' +
      '<label class="dim"><span>Depth</span><input type="number" inputmode="decimal" min="0" id="own-d" value="' + home.d + '" autocomplete="off"></label></div>' +
      '<button class="btn" type="button" id="own-done">Done</button>';
    function typed() {
      var w = parseFloat($("own-w").value), d = parseFloat($("own-d").value);
      if (w > 0 && d > 0) { home.w = w; home.d = d; render(); }
    }
    $("own-w").addEventListener("input", typed); $("own-d").addEventListener("input", typed);
    $("own-done").addEventListener("click", close);
    wrap.hidden = false; sheet.style.transform = "";
    doc.documentElement.style.overflow = "hidden";
    void sheet.getBoundingClientRect();
    wrap.classList.add("open");
    var first = $("own-w"); first.focus({ preventScroll: true }); first.select();
  }
  function close() {
    if (wrap.hidden) return;
    wrap.classList.remove("open"); sheet.style.transform = "";
    doc.documentElement.style.overflow = "";
    closing = setTimeout(function () { wrap.hidden = true; }, calm ? 0 : 420);
    ownChip.focus({ preventScroll: true });
  }
  $("sheetBg").addEventListener("click", close);
  $("grab").addEventListener("click", close);
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  // pull the sheet down to put it away
  (function () {
    var y0 = null, dy = 0;
    sheet.addEventListener("pointerdown", function (e) {
      if (e.target.closest("input, .btn") || sheet.scrollTop > 0) return;
      y0 = e.clientY; dy = 0;
    });
    sheet.addEventListener("pointermove", function (e) {
      if (y0 === null) return;
      dy = Math.max(0, e.clientY - y0);
      if (dy > 6) { wrap.classList.add("drag"); sheet.style.transform = "translateY(" + dy + "px)"; }
    });
    function end() {
      if (y0 === null) return;
      wrap.classList.remove("drag"); y0 = null;
      if (dy > 90) close(); else sheet.style.transform = "";
    }
    sheet.addEventListener("pointerup", end); sheet.addEventListener("pointercancel", end);
  })();
  render();

  /* ── the hero: the first movement down the page opens the arch, and from there it is a
        short film in three facts. One swipe moves one fact, never more; left alone, each
        fact holds for two seconds and the page carries itself on, through to the next
        section. It plays once. ── */
  var scene = $("top"), stage = $("stage"), copy = $("scCopy"), field = $("field"), html = doc.documentElement;
  var facts = [].slice.call(doc.querySelectorAll("#facts li")).map(function (li) {
    var b = li.querySelector("b"); return { li: li, b: b, to: b.dataset.to ? Number(b.dataset.to) : null, run: 0, settled: 0 };
  });
  var dots = [].slice.call(doc.querySelectorAll("#dots i"));
  var sceneLive = !calm && "IntersectionObserver" in window;
  var coarse = window.matchMedia("(pointer: coarse)").matches;
  var W = 0, H = 0, afterTop = 0, step = 0, idle = 0, locked = false, played = false, ready = true, touching = false, skipGesture = false, steppedAt = 0, touchY = 0;
  var ctx = field.getContext ? field.getContext("2d") : null, dpr = 1;
  var scrollY0 = function () { return window.scrollY || window.pageYOffset || 0; };
  function measure() {
    W = stage.clientWidth; H = stage.clientHeight;
    var top0 = Math.min(Math.max(copy.offsetTop + copy.offsetHeight + 40, H * 0.5), Math.max(H - 150, copy.offsetTop + copy.offsetHeight + 24));
    var h0 = H - top0, w0 = Math.min(W * 0.6, 300, h0 * 1.15), r = w0 / 2;
    // opened, its curve has left the top of the screen and its sides have left the edges
    var S = Math.max(H / (h0 - r), W / w0) * 1.04;
    var st = scene.style;
    st.setProperty("--w0", w0.toFixed(1) + "px"); st.setProperty("--h0", h0.toFixed(1) + "px");
    st.setProperty("--top0", top0.toFixed(1) + "px"); st.setProperty("--s", S.toFixed(4));
    afterTop = $("after").offsetTop;
    if (ctx) { dpr = Math.min(window.devicePixelRatio || 1, 2); field.width = Math.round(W * dpr); field.height = Math.round(H * dpr); }
  }

  /* behind each number, the number itself */
  var INK = "241,230,207";
  function paint(kind, t, value) {
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    if (kind === 0) {
      // plots filling from the ground up, the way a building rises
      var cols = W > 700 ? 20 : 10, gap = 6, pad = W > 700 ? 48 : 22, c = (W - pad * 2 - gap * (cols - 1)) / cols;
      var rows = Math.ceil((H + gap) / (c + gap)), lit = Math.round(cols * rows * t), k = 0;
      for (var r = 0; r < rows; r++) for (var x = 0; x < cols; x++, k++) {
        var px = pad + x * (c + gap), py = H - (r + 1) * (c + gap) + gap;
        if (k < lit) { ctx.fillStyle = "rgba(" + INK + ",0.12)"; ctx.fillRect(px, py, c, c); }
        else { ctx.strokeStyle = "rgba(" + INK + ",0.07)"; ctx.lineWidth = 1; ctx.strokeRect(px + 0.5, py + 0.5, c - 1, c - 1); }
      }
    } else if (kind === 1) {
      // seven hundred marks, lit one for one with the count
      var n1 = W > 700 ? 35 : 20, m = 700 / n1, padX = W > 700 ? 48 : 22, padY = 74;
      var sx = (W - padX * 2) / (n1 - 1), sy = (H - padY * 2) / (m - 1), q = 0;
      for (var a = 0; a < m; a++) for (var b2 = 0; b2 < n1; b2++, q++) {
        ctx.beginPath(); ctx.arc(padX + b2 * sx, padY + a * sy, q < value ? 2.3 : 1.6, 0, 6.2832);
        ctx.fillStyle = "rgba(" + INK + "," + (q < value ? 0.5 : 0.11) + ")"; ctx.fill();
      }
    } else if (kind === 3) {
      // the app: a phone, and the day's entries arriving on it
      var pw = Math.min(W * 0.6, 280), ph = pw * 2.05, x0 = W - pw * 0.86 - (W > 700 ? W * 0.12 : 0), y0 = H * 0.5 - ph * 0.22, rad = pw * 0.14;
      var soft = function (al) { return "rgba(" + INK + "," + al + ")"; };
      ctx.lineWidth = 1.3; ctx.strokeStyle = soft(0.3 * Math.min(1, t * 3));
      ctx.beginPath(); ctx.moveTo(x0 + rad, y0); ctx.arcTo(x0 + pw, y0, x0 + pw, y0 + ph, rad); ctx.arcTo(x0 + pw, y0 + ph, x0, y0 + ph, rad); ctx.arcTo(x0, y0 + ph, x0, y0, rad); ctx.arcTo(x0, y0, x0 + pw, y0, rad); ctx.closePath(); ctx.stroke();
      ctx.fillStyle = soft(0.3 * Math.min(1, t * 3)); ctx.fillRect(x0 + pw * 0.38, y0 + pw * 0.07, pw * 0.24, 3);
      for (var e2 = 0; e2 < 6; e2++) {
        var sh = Math.max(0, Math.min(1, t * 7 - e2 - 0.6)); if (sh <= 0) break;
        var ry = y0 + pw * 0.24 + e2 * pw * 0.27, rx = x0 + pw * 0.1;
        ctx.fillStyle = soft(0.09 * sh); ctx.fillRect(rx, ry, pw * 0.8, pw * 0.21);
        ctx.beginPath(); ctx.arc(rx + pw * 0.1, ry + pw * 0.105, pw * 0.042, 0, 6.2832); ctx.fillStyle = soft(0.5 * sh); ctx.fill();
        ctx.fillStyle = soft(0.34 * sh); ctx.fillRect(rx + pw * 0.2, ry + pw * 0.07, pw * (0.34 + (e2 % 3) * 0.07), 3);
        ctx.fillStyle = soft(0.18 * sh); ctx.fillRect(rx + pw * 0.2, ry + pw * 0.125, pw * (0.22 + ((e2 + 1) % 3) * 0.06), 3);
      }
    } else {
      // ten arches, one for each year, each inside the next
      var cx = W / 2;
      for (var y = 1; y <= 10; y++) {
        var show = Math.max(0, Math.min(1, t * 10 - (y - 1)));
        if (show <= 0) break;
        var w = Math.min(W, 620) * (0.12 + 0.105 * y), h = H * (0.16 + 0.078 * y), rr = w / 2, top = H - h + rr;
        ctx.beginPath(); ctx.moveTo(cx - rr, H + 2); ctx.lineTo(cx - rr, top); ctx.arc(cx, top, rr, Math.PI, 0); ctx.lineTo(cx + rr, H + 2);
        ctx.strokeStyle = "rgba(" + INK + "," + (0.26 * show) + ")"; ctx.lineWidth = 1.2; ctx.stroke();
      }
    }
  }
  function count(f, i, on, firstOpen) {
    cancelAnimationFrame(f.run);
    if (!on) return;
    var t0 = performance.now() + (firstOpen ? 600 : 160);
    f.settled = t0 + 1400;
    field.classList.remove("on");
    (function tick(now) {
      var t = Math.min(1, Math.max(0, (now - t0) / 1400)), e = 1 - Math.pow(1 - t, 4), v = f.to === null ? 0 : Math.round(f.to * e);
      if (f.to !== null) f.b.textContent = v.toLocaleString("en-US") + "+";
      if (now >= t0 - 120) { paint(i, e, v); field.classList.add("on"); }
      if (t < 1) f.run = requestAnimationFrame(tick);
    })(performance.now());
  }
  function setStep(next) {
    if (next === step) return;
    var wasOpen = step >= 1; step = next; steppedAt = performance.now();
    scene.classList.toggle("was-open", wasOpen && next >= 1);
    scene.classList.toggle("open", next >= 1);
    if (next < 1) field.classList.remove("on");
    facts.forEach(function (f, i) {
      var on = i === next - 1;
      f.li.classList.toggle("on", on); f.li.classList.toggle("past", i < next - 1);
      count(f, i, on, !wasOpen);
    });
    dots.forEach(function (d, i) { d.classList.remove("run"); d.classList.toggle("done", i < next - 1); });
    fit();
    arm();
  }
  // while the film is on, the stage is exactly as tall as the screen is right now
  function fit() {
    var want = locked || step >= 1 ? window.innerHeight + "px" : "";
    if (scene.style.getPropertyValue("--stage-h") === want) return;
    if (want) scene.style.setProperty("--stage-h", want); else scene.style.removeProperty("--stage-h");
    measure();
  }
  // while the film plays the page itself is held still
  function lock() {
    locked = true; skipGesture = true;
    if (scrollY0() > H * 0.2) window.scrollTo(0, Math.round(H * 0.06)); // a big first jump: bring the stage back whole
    if (coarse) html.style.overflow = "hidden"; // also stops a flick that is still coasting
    stage.style.touchAction = "none";
    fit();
  }
  function unlock() { locked = false; html.style.overflow = ""; stage.style.touchAction = ""; }
  function go(n) {
    clearTimeout(idle);
    if (n <= 0) { ready = false; setStep(0); unlock(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (n > facts.length) { // the film is over: on to the section that follows
      played = true; unlock();
      dots.forEach(function (d) { d.classList.remove("run"); d.classList.add("done"); });
      window.scrollTo({ top: afterTop, behavior: "smooth" }); return;
    }
    setStep(n);
  }
  // once a figure has finished counting, two seconds without a touch and it moves on by itself
  function arm() {
    clearTimeout(idle);
    dots.forEach(function (d) { d.classList.remove("run"); });
    if (!locked || touching || step < 1) return;
    var settle = Math.max(0, facts[step - 1].settled - performance.now());
    var d = dots[step - 1]; if (d) { void d.offsetWidth; d.classList.add("run"); }
    idle = setTimeout(function () { go(step + 1); }, settle + 2000);
  }
  function fromScroll() {
    var y = scrollY0();
    if (y < H * 0.02) ready = true; // it opens again only after the page has come to rest at the top
    if (!played) { if (ready && !locked && step === 0 && y > H * 0.05) { lock(); go(1); } }
    else if (y < H * 0.02) setStep(0); // seen once; back at the top it is simply the opening page
  }
  var settledEnough = function () { return performance.now() - steppedAt > 650; };
  if (sceneLive) {
    scene.classList.add("live"); measure(); fromScroll();
    var waiting = false;
    window.addEventListener("scroll", function () {
      if (waiting) return; waiting = true;
      requestAnimationFrame(function () { waiting = false; fromScroll(); });
    }, { passive: true });
    window.addEventListener("resize", function () { fit(); measure(); if (step >= 1) paint(step - 1, 1, facts[step - 1].to || 0); });
    // one swipe, one fact
    window.addEventListener("touchstart", function (e) {
      touching = true; skipGesture = false; touchY = e.touches[0].clientY; clearTimeout(idle);
      dots.forEach(function (d) { d.classList.remove("run"); });
    }, { passive: true });
    window.addEventListener("touchmove", function (e) { if (locked && e.cancelable) e.preventDefault(); }, { passive: false });
    var touchDone = function (e) {
      touching = false;
      if (!locked) return;
      var dy = touchY - (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : touchY);
      if (!skipGesture && settledEnough() && Math.abs(dy) > 28) go(step + (dy > 0 ? 1 : -1)); else arm();
      skipGesture = false;
    };
    window.addEventListener("touchend", touchDone, { passive: true });
    window.addEventListener("touchcancel", touchDone, { passive: true });
    window.addEventListener("wheel", function (e) {
      if (!locked) return;
      e.preventDefault();
      if (performance.now() - steppedAt > 900 && Math.abs(e.deltaY) > 6) go(step + (e.deltaY > 0 ? 1 : -1));
    }, { passive: false });
    window.addEventListener("keydown", function (e) {
      if (!locked) return;
      var down = e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ", up = e.key === "ArrowUp" || e.key === "PageUp";
      if (!down && !up) return;
      e.preventDefault(); if (settledEnough()) go(step + (down ? 1 : -1));
    });
  }
  // in-page links glide, and work the same inside any viewer
  function glide(id) {
    var el = $(id); if (!el) return;
    if (locked || !played) { played = true; clearTimeout(idle); unlock(); }
    var y = el.getBoundingClientRect().top + scrollY0() - 8;
    window.scrollTo({ top: y, behavior: calm ? "auto" : "smooth" });
  }
  doc.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); glide(a.getAttribute("href").slice(1)); });
  });
  $("barFig").addEventListener("click", function () { glide("cost"); });

  /* ── the figures turn into place ── */
  if (!calm) doc.querySelectorAll("[data-odo]").forEach(function (el, k) {
    var text = el.textContent, cols = [], i = 0;
    el.setAttribute("aria-label", text); el.textContent = "";
    text.split("").forEach(function (ch) {
      if (!/\d/.test(ch)) { var s = doc.createElement("span"); s.textContent = ch; s.setAttribute("aria-hidden", "true"); el.appendChild(s); return; }
      var col = doc.createElement("span"), strip = doc.createElement("i"), d = Number(ch);
      col.className = "odo"; col.setAttribute("aria-hidden", "true");
      for (var t = 0; t <= 10 + d; t++) { var c = doc.createElement("span"); c.textContent = String(t % 10); strip.appendChild(c); }
      strip.style.setProperty("--n", i++ + k * 2);
      col.appendChild(strip); el.appendChild(col); cols.push([strip, 10 + d]);
    });
    seen(el, function () {
      setTimeout(function () { cols.forEach(function (c) { c[0].style.transform = "translateY(" + (-c[1] * 1.1) + "em)"; }); }, 250);
    }, { threshold: 0.9 });
  });

  /* ── the log: each row loads, then passes ── */
  var log = $("log");
  if (calm) log.classList.remove("seq");
  else seen(log, function () {
    [].slice.call(log.querySelectorAll(".log-row")).forEach(function (row, i) {
      setTimeout(function () {
        row.classList.add("load");
        setTimeout(function () { row.classList.remove("load"); row.classList.add("ok"); }, 900);
      }, 250 + i * 480);
    });
  }, { threshold: 0.35 });

  /* ── two quotes ── */
  var COMPARE = [
    ["Materials", "Brands get decided later, at site", "Every material named by brand and grade before you sign."],
    ["Concrete", "Mixed by eye, never tested", "Cubes cast from every pour, tested at 7 and 28 days."],
    ["Steel", "Whatever the supplier has that week", "Fe 500D is the least we build with, on every home."],
    ["Checking", "The mason checks his own work", "700+ checks, recorded stage by stage."],
    ["Changes", "Extras turn up in the final bill", "Priced and agreed in writing before the work is done."],
    ["After handover", "A spoken promise", "A warranty of 10 years and more."]
  ];
  var qEl = $("q");
  qEl.innerHTML = COMPARE.map(function (r) {
    return "<li><small>" + r[0] + '</small><span class="q-low">' + r[1] + '</span><p class="q-ours"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"></circle><path d="M5.8 10.300l2.800 2.800 5.600-6.200"></path></svg>' + r[2] + "</p></li>";
  }).join("");
  var qRows = [].slice.call(qEl.children);

  /* ── the day's messages arrive, one after another ── */
  var chat = $("chat"), typing = $("typing"), msgs = [].slice.call(chat.querySelectorAll(".msg"));
  if (!calm && "IntersectionObserver" in window) {
    chat.style.minHeight = chat.offsetHeight + "px"; // the card keeps its size while it fills
    msgs.forEach(function (m) { m.hidden = true; });
    seen(chat, function () {
      var i = 0;
      (function next() {
        if (i >= msgs.length) { typing.hidden = true; return; }
        chat.insertBefore(typing, msgs[i]); typing.hidden = false;
        setTimeout(function () {
          typing.hidden = true; msgs[i].hidden = false; msgs[i].classList.add("pop"); i++;
          setTimeout(next, 650);
        }, i === 0 ? 900 : 1150);
      })();
    }, { threshold: 0.35 });
  }

  /* ── questions ── */
  var FAQS = [
    ["What does the price depend on?", "Mostly on how much you build and what you build it with: plot size, number of floors, how parking is handled, and the grade of materials you choose. The estimate on this page shows how the first three move the starting price."],
    ["What kind of homes do you build?", "Independent houses from a single ground floor up to G+4, and apartment buildings on stilts. Each one is designed for its plot."],
    ["Can I choose my own materials and brands?", "Yes. Every item, from cement and steel to tiles and switches, comes in three grades with named brands. Upgrade only what matters to you."],
    ["How do payments work?", "Payments are split into stages of the build and written into the agreement before work starts."],
    ["Do you build outside Kakinada?", "Our sites are in and around Kakinada. If your plot is in a nearby town, message us and we will tell you plainly whether we can take it on."],
    ["Do you also do interiors?", "Yes, through Zyrio Studio, our interior and architectural design studio. Ask us about it when we talk."]
  ];
  $("faq").innerHTML = FAQS.map(function (f, i) {
    return '<div><button class="faq-q" type="button" id="faq-q-' + i + '" aria-expanded="false" aria-controls="faq-a-' + i + '">' + f[0] + '<i aria-hidden="true"></i></button>' +
      '<div class="faq-a" id="faq-a-' + i + '" role="region" aria-labelledby="faq-q-' + i + '"><div><p>' + f[1] + "</p></div></div></div>";
  }).join("");
  $("faq").addEventListener("click", function (e) {
    var q = e.target.closest(".faq-q"); if (!q) return;
    var isOpen = q.getAttribute("aria-expanded") === "true";
    $("faq").querySelectorAll(".faq-q").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    q.setAttribute("aria-expanded", String(!isOpen));
  });

  /* ── the second quote is written as each line comes up the screen ── */
  if (calm || !("IntersectionObserver" in window)) qRows.forEach(function (li) { li.classList.add("on"); });
  else {
    var qio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle("on", e.isIntersecting || e.boundingClientRect.top < 0); });
    }, { rootMargin: "0px 0px -34% 0px", threshold: 0 });
    qRows.forEach(function (li) { qio.observe(li); });
  }

  /* ── homes: one photo at a time; it moves on by itself until someone takes over ── */
  var hRow = $("homesRow"), hItems = [].slice.call(hRow.children), hDots = [].slice.call($("homesDots").children);
  var hAt = 0, hTick = false, hAuto = null, hTaken = false;
  function hGo(i) {
    i = Math.max(0, Math.min(hItems.length - 1, i));
    hRow.scrollTo({ left: hItems[i].offsetLeft - hItems[0].offsetLeft, behavior: calm ? "auto" : "smooth" });
  }
  function hRead() {
    hTick = false;
    var x = hRow.scrollLeft, best = 0, d = Infinity, end = x + hRow.clientWidth >= hRow.scrollWidth - 2;
    hItems.forEach(function (li, i) { var k = Math.abs(li.offsetLeft - hItems[0].offsetLeft - x); if (k < d) { d = k; best = i; } });
    if (end && window.innerWidth < 800) best = hItems.length - 1;
    $("homesNext").disabled = end;
    if (best === hAt) return;
    hAt = best;
    hItems.forEach(function (li, i) { li.classList.toggle("on", window.innerWidth < 800 ? i === best : i === best || i === best + 1); });
    hDots.forEach(function (o, i) { o.classList.toggle("on", i === best); });
    $("homesCount").textContent = (best + 1) + " / " + hItems.length;
    $("homesPrev").disabled = best === 0;
  }
  function hStop() { hTaken = true; clearInterval(hAuto); hAuto = null; }
  function hPlay() {
    if (calm || hTaken || hAuto) return;
    hAuto = setInterval(function () { if ($("homesNext").disabled) { hStop(); return; } hGo(hAt + 1); }, 3200);
  }
  if (window.innerWidth >= 800) hItems[1].classList.add("on");
  hRow.addEventListener("scroll", function () { if (!hTick) { hTick = true; requestAnimationFrame(hRead); } }, { passive: true });
  ["pointerdown", "touchstart", "wheel", "keydown"].forEach(function (ev) { hRow.addEventListener(ev, hStop, { passive: true }); });
  $("homesPrev").addEventListener("click", function () { hStop(); hGo(hAt - 1); });
  $("homesNext").addEventListener("click", function () { hStop(); hGo(hAt + 1); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) hPlay(); else { clearInterval(hAuto); hAuto = null; } });
    }, { threshold: 0.6 }).observe(hRow);
  }

  /* ── bar: the price in one corner, and a track to slide the green dot along to open the chat ── */
  var slide = $("slide"), knob = $("barWa"), slSay = $("slSay"), sX0 = 0, sMax = 0, sP = 0, sHeld = false, sMoved = false, sSkip = false, sBack = 0;
  function sSize() {
    sMax = slide.clientWidth - knob.offsetWidth - 12;
    // the show-me glide stops just short of the price, far enough to uncover the words
    var room = $("barFig").offsetLeft - knob.offsetWidth - 14, need = slSay.offsetWidth + 30;
    slide.style.setProperty("--half", Math.max(need, Math.min(room, sMax * 0.55)).toFixed(1) + "px");
    slide.style.setProperty("--figdim", need > room ? "0" : "1");
  }
  function sSet(x) { sP = sMax ? x / sMax : 0; slide.style.setProperty("--x", x.toFixed(1) + "px"); slide.style.setProperty("--p", sP.toFixed(3)); }
  function sRest() { slide.classList.remove("drag", "done"); slSay.textContent = "Slide to chat"; sSet(0); }
  function sDone() {
    sSize(); slide.classList.remove("drag", "demo"); slide.classList.add("done"); slSay.textContent = "Opening WhatsApp"; sSet(sMax); buzz();
    clearTimeout(sBack); sBack = setTimeout(sRest, 1800);
  }
  sSize(); window.addEventListener("resize", sSize); if (!calm) slide.classList.add("demo");
  knob.addEventListener("dragstart", function (e) { e.preventDefault(); });
  knob.addEventListener("pointerdown", function (e) {
    if (e.button) return;
    // if it is caught mid-glide, carry on from where the finger found it
    var at = 0; try { at = new DOMMatrix(getComputedStyle(knob).transform).m41 || 0; } catch {}
    sSize(); sHeld = true; sMoved = false; sX0 = e.clientX - at;
    if (at > 1) { slide.classList.add("drag"); sSet(Math.min(sMax, at)); }
    slide.classList.remove("demo");
    try { knob.setPointerCapture(e.pointerId); } catch {}
  });
  knob.addEventListener("pointermove", function (e) {
    if (!sHeld) return;
    var dx = Math.max(0, Math.min(sMax, e.clientX - sX0));
    if (!sMoved && dx > 6) { sMoved = true; clearTimeout(sBack); slide.classList.remove("done"); slide.classList.add("drag"); }
    if (sMoved) { sSet(dx); slSay.textContent = sP > 0.8 ? "Release to chat" : "Slide to chat"; }
  });
  ["pointerup", "pointercancel"].forEach(function (ev) {
    knob.addEventListener(ev, function () {
      if (!sHeld) return; sHeld = false;
      if (!sMoved) { slide.classList.remove("drag"); return; } // a plain tap: the click that follows opens the chat
      sSkip = true; setTimeout(function () { sSkip = false; }, 450); // the browser's own click after a drag is not a second request
      if (ev === "pointerup" && sP > 0.8) { sDone(); knob.click(); } else sRest();
    });
  });
  knob.addEventListener("click", function (e) {
    if (!e.isTrusted) return;            // our own click, sent when the slide completes
    if (sSkip) { e.preventDefault(); sSkip = false; return; }
    sDone();                             // tapped or pressed Enter: it slides across by itself
  });

  /* ── bar: appears once the first figure has scrolled away, leaves at the close ── */
  var bar = $("bar");
  if ("IntersectionObserver" in window) {
    var state = new Map([[$("top"), true], [$("talk"), false]]);
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { state.set(e.target, e.isIntersecting); });
      var on = !state.get($("top")) && !state.get($("talk"));
      bar.classList.toggle("on", on); bar.inert = !on;
    });
    bar.inert = true; io.observe($("top")); io.observe($("talk"));
  }
}
