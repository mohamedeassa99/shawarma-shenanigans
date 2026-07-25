/* ══════════════════════════════════════════════════════════
   THE ROTATION BUREAU — scroll-scrubbed film + dossier
   ══════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── The script: shots, captions, flash beats ───────────── */
  const SCRIPT = {
    spit:    { captions: [["IT HAS NOT STOPPED SINCE 1870.", 0], ["THE CROWN IS NOT DECORATIVE.", 0.54]] },
    blade:   { flash: true, captions: [["ONE BLADE. THE OTHER KIND IS UNDER INVESTIGATION.", 0]] },
    saj:     { flash: true, captions: [["GRAVITY HAS BEEN BRIEFED.", 0], ["THE SHEET HAS BEEN NOTIFIED.", 0.52]] },
    toum:    { captions: [["NO EGG. NO DAIRY. NO EXPLANATION.", 0]] },
    pickles: { flash: true, captions: [["THE PINK WAS NEVER REAL.", 0]] },
    roll:    { captions: [["THE ROLL IS FINAL.", 0], ["ROTATION COMPLETE.", 0.62]] }
  };

  const REBUKE = "THE ROTATION DOES NOT REVERSE.";
  const IDLE   = "THE SPIT HAS NOT STOPPED. YOU HAVE.";

  /* ── Below-the-fold data (all verifiable) ───────────────── */
  const CELLS = [
    { city: "BURSA",  alias: "THE PIVOT EVENT", meta: "c.1870 · spit turned vertical", x: 620, y: 205, origin: true },
    { city: "BERLIN", alias: "DÖNER",           meta: "1970s · Turkish diaspora",      x: 505, y: 108 },
    { city: "ATHENS", alias: "GYRO",            meta: "20th c. · Greek migration",     x: 556, y: 246 },
    { city: "BEIRUT", alias: "SHAWARMA",        meta: "Levantine continuation",        x: 690, y: 300 },
    { city: "PUEBLA", alias: "TACOS AL PASTOR", meta: "early 20th c. · pineapple crown", x: 128, y: 322 }
  ];

  const CASES = [
    { n: "THE SAUCE ASSIGNMENT", body: "Chicken takes toum. Beef and lamb take tahini. Crossing this line is not a matter of preference. It is an error.", cas: "UNRECORDED", fr: "SEVERAL" },
    { n: "THE BLADE DISPUTE", body: "The traditional long knife against the electric rotating blade. Purists hold that the electric blade tears rather than shaves, and that the difference is audible.", cas: "UNRECORDED", fr: "MANY" },
    { n: "THE INTERIOR FRY QUESTION", body: "Fries inside the wrap. Standard in Egypt and across much of the Levant. Regarded elsewhere as structural vandalism. No treaty has been proposed.", cas: "UNQUANTIFIED", fr: "COUNTLESS" },
    { n: "THE WHITE SAUCE DEVIATION", body: "The New York halal-cart white sauce is not toum. It is mayonnaise-based. The Bureau classifies it as a diaspora variant while quietly eating it at 0200.", cas: "NONE CONFIRMED", fr: "A HANDFUL" },
    { n: "THE QUESTION OF ORIGIN", body: "Turkey, Syria, Lebanon and Palestine each claim it. No resolution exists. No resolution is wanted. The Bureau considers the dispute load-bearing.", cas: "UNRECORDED", fr: "ALL OF THEM" }
  ];

  const GLOSS = [
    ["çevirme", "Turkish", "To turn. The origin of the name."],
    ["toum", "ثوم", "Garlic. Also the sauce. The language saw no need to distinguish."],
    ["liyya", "ألية", "Sheep tail fat. Placed at the summit. Renders downward."],
    ["saj", "صاج", "Convex dome griddle. Also the bread made on it."],
    ["lift", "لفت", "Turnip. Pink under duress."],
    ["amba", "عمبة", "Pickled mango sauce. Arrived by trade route."],
    ["kabees", "كبيس", "Pickles, general."]
  ];

  const PROJ = [
    ["2027", "The rotation continues."],
    ["2031", "The rotation continues."],
    ["2049", "The rotation continues."],
    ["2100", "The rotation continues."],
    ["∞",    "See above."]
  ];

  const LEVELS = [
    { no: "CLEARANCE I", name: "FOIL HANDLER", items: ["Has said “no lettuce” without hesitation", "Identifies the shop by smell from outside", "Has never once asked what toum is"] },
    { no: "CLEARANCE II", name: "KEEPER OF THE EMULSION", items: ["Has broken a toum and filed no report", "Knows the turnips are white", "Holds a position on fries-inside and will defend it"] },
    { no: "CLEARANCE III", name: "CHIEF INSPECTOR OF THE VERTICAL", items: ["Has fought someone over the bill and won", "Knows why the tomato is up there", "Was present at a 0300 counter with no queue and did not hesitate"] }
  ];

  /* ══════════ BELOW-THE-FOLD RENDERING ══════════ */
  function renderCells() {
    const origin = CELLS[0];
    $("#map-string").innerHTML = CELLS.slice(1)
      .map(c => `<polyline points="${origin.x},${origin.y} ${c.x},${c.y}" />`).join("");

    $("#map-nodes").innerHTML = CELLS.map(c => `
      <g>
        ${c.origin ? `<circle class="halo" cx="${c.x}" cy="${c.y}" r="16"><animate attributeName="r" values="9;22;9" dur="3.6s" repeatCount="indefinite"/><animate attributeName="opacity" values=".5;0;.5" dur="3.6s" repeatCount="indefinite"/></circle>` : ""}
        <circle cx="${c.x}" cy="${c.y}" r="${c.origin ? 6 : 4}" />
        <text x="${c.x}" y="${c.y - 16}" text-anchor="middle">${c.city}</text>
        <text class="sub" x="${c.x}" y="${c.y + 26}" text-anchor="middle">${c.alias}</text>
      </g>`).join("");

    $("#cellgrid").innerHTML = CELLS.map(c => `
      <div class="cell">
        <p class="cell__city">${c.city}</p>
        <p class="cell__meta"><span class="cell__alias">${c.alias}</span><br>${c.meta}</p>
      </div>`).join("");
  }

  function renderCases() {
    const tabs = $("#case-tabs"), panel = $("#case-panel");
    tabs.innerHTML = CASES.map((c, i) =>
      `<button class="cases__tab" role="tab" id="tab-${i}" aria-controls="case-panel" aria-selected="${i === 0}">CASE ${String(i + 1).padStart(2, "0")}</button>`
    ).join("");

    const show = i => {
      const c = CASES[i];
      panel.innerHTML = `
        <p class="case__status">STATUS: UNRESOLVED</p>
        <h3 class="case__name">${c.n}</h3>
        <p class="case__body">${c.body}</p>
        <div class="case__meta">
          <span>CASUALTIES: <b>${c.cas}</b></span>
          <span>FRIENDSHIPS LOST: <b>${c.fr}</b></span>
        </div>`;
      $$(".cases__tab", tabs).forEach((t, j) => t.setAttribute("aria-selected", String(i === j)));
    };

    tabs.addEventListener("click", e => {
      const b = e.target.closest(".cases__tab");
      if (b) show($$(".cases__tab", tabs).indexOf(b));
    });
    tabs.addEventListener("keydown", e => {
      const list = $$(".cases__tab", tabs);
      const cur = list.findIndex(t => t.getAttribute("aria-selected") === "true");
      let next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (cur + 1) % list.length;
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   next = (cur - 1 + list.length) % list.length;
      if (next !== null) { e.preventDefault(); show(next); list[next].focus(); }
    });
    show(0);
  }

  function renderRest() {
    $("#gloss").innerHTML = GLOSS.map(([t, o, d]) =>
      `<div class="gloss__row"><dt>${t}<span>${o}</span></dt><dd>${d}</dd></div>`).join("");

    $("#proj").innerHTML = PROJ.map(([y, t]) =>
      `<div class="proj__row"><span class="proj__y">${y}</span><p class="proj__t">${t}</p></div>`).join("");

    $("#levels").innerHTML = LEVELS.map(l => `
      <div class="level">
        <p class="level__no">${l.no}</p>
        <h3 class="level__name">${l.name}</h3>
        <ul>${l.items.map(i => `<li>${i}</li>`).join("")}</ul>
      </div>`).join("");
  }

  /* ══════════ FORM 27-B ══════════ */
  function initForm() {
    const form = $("#form27b"), stamp = $("#stamp"), err = $("#err-fries");
    form.addEventListener("submit", e => {
      e.preventDefault();
      const fries = form.querySelector('input[name="fries"]:checked');
      if (!fries) {
        err.hidden = false;
        form.querySelector('input[name="fries"]').focus();
        return;
      }
      err.hidden = true;
      const ref = "27B/" + Math.random().toString(36).slice(2, 7).toUpperCase() + "/" + fries.value;
      $("#stamp-meta").textContent =
        `FILE ${ref} · POSITION RECORDED · REVIEW: NOT SCHEDULED`;
      form.hidden = true;
      stamp.hidden = false;
      stamp.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "center" });
    });
  }

  /* ══════════ TAB-TITLE GAG ══════════ */
  function initTitleGag() {
    const original = document.title;
    addEventListener("blur",  () => { document.title = "THE ROTATION CONTINUES WITHOUT YOU."; });
    addEventListener("focus", () => { document.title = original; });
  }

  /* ══════════ ODOMETER ══════════ */
  function initOdometer() {
    const el = $("#odometer");
    if (!el) return;
    // ~4 rev/min since 1870, stated with unearned precision.
    const START = Date.UTC(1870, 0, 1);
    const tick = () => {
      const mins = (Date.now() - START) / 60000;
      el.textContent = Math.floor(mins * 4).toLocaleString("en-US");
    };
    tick();
    setInterval(tick, 900);
  }

  /* ══════════ THE FILM ══════════ */
  async function initFilm() {
    const section = $("#rotation");
    const canvas  = $("#film");
    const ctx     = canvas.getContext("2d", { alpha: false });
    const capEl   = $("#caption");
    const flashEl = $("#flash");
    const endEl   = $("#endcard");
    const hintEl  = $("#scrollhint");
    const shotEl  = $("#hud-shot");

    let manifest;
    try {
      manifest = await (await fetch("./frames/manifest.json", { cache: "force-cache" })).json();
    } catch {
      document.body.classList.add("no-film");
      reveal();
      return;
    }

    const TOTAL = manifest.total;
    const shots = manifest.shots;

    // Absolute frame ranges per shot
    let acc = 0;
    for (const s of shots) { s.start = acc; acc += s.frames; s.end = acc - 1; }

    const imgs   = new Array(TOTAL);
    const ready  = new Array(TOTAL).fill(false);
    const src    = i => `./frames/f_${String(i + 1).padStart(3, "0")}.webp`;

    const load = i => new Promise(res => {
      const im = new Image();
      im.decoding = "async";
      im.onload = () => { imgs[i] = im; ready[i] = true; res(); };
      im.onerror = res;
      im.src = src(i);
    });

    /* Preload the opening burst, then stream the rest in the background
       so the cold open is not gated on the full ~6MB sequence. */
    const BURST = Math.min(28, TOTAL);
    const fill  = $("#preloader-fill");
    const stat  = $("#preloader-status");
    let done = 0;

    await Promise.all(Array.from({ length: BURST }, (_, i) =>
      load(i).then(() => {
        done++;
        fill.style.transform = `scaleX(${done / BURST})`;
        stat.textContent = done < BURST
          ? `DECLASSIFYING FRAME ${String(done).padStart(3, "0")}…`
          : "CLEARANCE GRANTED.";
      })
    ));

    (async () => { for (let i = BURST; i < TOTAL; i++) await load(i); })();

    /* Cover-fit draw */
    let lastDrawn = -1;
    function paint(idx) {
      let i = idx;
      if (!ready[i]) {                      // fall back to nearest loaded frame
        let lo = i, hi = i;
        while (lo >= 0 || hi < TOTAL) {
          if (lo >= 0 && ready[lo]) { i = lo; break; }
          if (hi < TOTAL && ready[hi]) { i = hi; break; }
          lo--; hi++;
        }
      }
      const im = imgs[i];
      if (!im || i === lastDrawn) return;
      lastDrawn = i;

      const dpr = Math.min(devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width  = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const ir = im.width / im.height, cr = w / h;
      let dw, dh;
      if (cr > ir) { dw = w; dh = w / ir; } else { dh = h; dw = h * ir; }
      ctx.drawImage(im, (w - dw) / 2, (h - dh) / 2, dw, dh);
    }

    /* Reduced motion: a single held frame, no scroll-jack */
    if (REDUCED) {
      section.style.height = "auto";
      await load(TOTAL - 1);
      paint(TOTAL - 1);
      capEl.textContent = "MOTION REDUCED. THE MEAT STILL TURNS ELSEWHERE.";
      capEl.classList.add("is-on");
      hintEl.hidden = true;
      reveal();
      return;
    }

    /* Scroll length. Guarded against a zero-size viewport (the page can
       initialise before layout in embedded/hidden contexts), and driven by a
       ResizeObserver so it self-corrects once real dimensions arrive. */
    const sizeSection = () => {
      const vh = innerHeight || 800;
      const vw = innerWidth || 1280;
      section.style.height = (TOTAL * (vw < 700 ? 17 : 27) + vh + 700) + "px";
    };
    sizeSection();

    const stage = $(".rotation__stage");
    let lastW = innerWidth, lastH = innerHeight;
    const onResize = () => {
      if (innerWidth !== lastW || Math.abs(innerHeight - lastH) > 120) {
        lastW = innerWidth; lastH = innerHeight; sizeSection();
      }
      lastDrawn = -1;
      paint(curFrame);
    };
    addEventListener("resize", onResize);
    if (typeof ResizeObserver === "function") new ResizeObserver(onResize).observe(stage);

    /* Caption / flash state */
    let curFrame = 0, curCap = "", curShot = -1, lastP = 0;
    let rebuke = false, idleTimer = null, idle = false;
    const flashed = new Set();

    /* Cross-fade the caption out, swap the text, fade back in. Driven by a
       timer rather than rAF so a dropped frame can never strand a line
       half-applied (curCap would then never retry it). */
    let capTimer = null;
    const setCap = (text, mod) => {
      if (text === curCap) return;
      curCap = text;
      capEl.classList.toggle("is-rebuke", mod === "rebuke");
      capEl.classList.remove("is-on");
      clearTimeout(capTimer);
      if (!text) return;
      capTimer = setTimeout(() => {
        capEl.textContent = text;
        capEl.classList.add("is-on");
      }, capEl.textContent ? 170 : 0);
    };

    function update() {
      const rect = section.getBoundingClientRect();
      const span = section.offsetHeight - innerHeight;
      const p = clamp(-rect.top / span, 0, 1);

      // End card owns the last stretch
      const FILM_END = 0.93;
      const inEnd = p >= FILM_END;
      endEl.hidden = false;
      endEl.classList.toggle("is-on", inEnd);

      const fp = clamp(p / FILM_END, 0, 1);
      curFrame = clamp(Math.round(fp * (TOTAL - 1)), 0, TOTAL - 1);
      paint(curFrame);

      hintEl.classList.toggle("scrollhint--gone", p > 0.02);

      // Which shot?
      const si = shots.findIndex(s => curFrame >= s.start && curFrame <= s.end);
      const shot = shots[si] || shots[shots.length - 1];
      if (si !== curShot && si >= 0) {
        curShot = si;
        shotEl.textContent = `SHOT ${String(si + 1).padStart(2, "0")} / ${String(shots.length).padStart(2, "0")}`;
        const def = SCRIPT[shot.id];
        if (def && def.flash && !flashed.has(si)) {
          flashed.add(si);
          flashEl.classList.remove("is-on");
          void flashEl.offsetWidth;
          flashEl.classList.add("is-on");
        }
      }

      /* Direction and idle state must settle BEFORE the caption is chosen,
         otherwise the rebuke lands one scroll event late. */
      if (p < lastP - 0.0006) rebuke = true;
      else if (p > lastP + 0.0006) rebuke = false;

      if (Math.abs(p - lastP) > 0.0002) {
        idle = false;
        clearTimeout(idleTimer);
        if (p > 0.01 && p < FILM_END) idleTimer = setTimeout(() => { idle = true; update(); }, 8000);
      }
      lastP = p;

      // Caption for position within shot
      let text = "";
      if (!inEnd && shot) {
        const within = (curFrame - shot.start) / Math.max(1, shot.frames - 1);
        const lines = (SCRIPT[shot.id] || {}).captions || [];
        for (const [t, at] of lines) if (within >= at) text = t;
      }

      if (rebuke && !inEnd)      setCap(REBUKE, "rebuke");
      else if (idle && !inEnd)   setCap(IDLE, "rebuke");
      else                       setCap(inEnd ? "" : text);
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    };
    addEventListener("scroll", onScroll, { passive: true });

    reveal();
    update();
  }

  /* ══════════ COLD OPEN ══════════ */
  function reveal() {
    const pre = $("#preloader"), cold = $("#coldopen"), main = $("#main");
    pre.classList.add("preloader--out");
    setTimeout(() => { pre.remove(); }, 600);

    if (REDUCED) { cold.remove(); main.hidden = false; return; }

    cold.hidden = false;
    main.hidden = false;
    const cards = $$(".coldopen__card", cold);
    document.documentElement.style.overflow = "hidden";

    cards.forEach((c, i) => setTimeout(() => c.classList.add("is-on"), i * 1050));
    setTimeout(() => {
      cold.classList.add("coldopen--out");
      document.documentElement.style.overflow = "";
      setTimeout(() => cold.remove(), 600);
    }, cards.length * 1050);
  }

  /* ══════════ GO ══════════ */
  renderCells();
  renderCases();
  renderRest();
  initForm();
  initTitleGag();
  initOdometer();
  initFilm();
})();
