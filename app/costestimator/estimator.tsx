"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DEPTS, type Tier } from "./data";
import { ARCH_PATH } from "./logo-path";
import {
  DEFAULT_INPUTS,
  STILT_MOD,
  baseRate,
  calcTotal,
  defaultSelections,
  deptStrip,
  derivePlot,
  fmt,
  fmtL,
  n,
  selKey,
  selectedItem,
  stiltLabel,
  summaryText,
  whatsappText,
  type Inputs,
  type Plot,
  type Selections,
  type Stilt,
} from "./pricing";

/** Estimates are sent to this WhatsApp number (country code, no plus). */
const WHATSAPP_NUMBER = "918330972705";

const PAGES = ["intro", "plot", ...DEPTS.map((d) => d.id), "summary"];

const PAGE_LABELS: Record<string, string> = {
  intro: "Start",
  plot: "Plot",
  civil: "Civil",
  grills: "Grills",
  interiors: "Interiors",
  mep: "MEP",
  lift: "Lift",
  summary: "Summary",
};

const UPLIFT: Record<Tier, string> = {
  std: "Base price",
  pre: "+10% vs Standard",
  lux: "+21% vs Standard",
};

const STILT_OPTIONS: { v: Stilt; title: string; text: string }[] = [
  {
    v: "full-stilt",
    title: "Complete stilt floor",
    text: "Entire ground floor is open parking — only columns, no rooms. Upper floors are fully built.",
  },
  {
    v: "partial-stilt",
    title: "Partial stilt",
    text: "Ground floor is part-parking, part-rooms (1–2 rooms). Mixed use at ground level.",
  },
  {
    v: "no-stilt",
    title: "No stilt — compact parking",
    text: "Every floor is fully constructed. A small parking bay is carved from within the ground floor plan.",
  },
];

const FACINGS = [
  "East",
  "West",
  "North",
  "South",
  "North-East",
  "North-West",
  "South-East",
  "South-West",
];

function Logo({ className, label }: { className: string; label?: string }) {
  return (
    <svg
      className={`bk-svg ${className}`}
      viewBox="0 0 500 622"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <use href="#ce-arch" />
    </svg>
  );
}

function Summary({ plot, sel }: { plot: Plot; sel: Selections }) {
  const r = calcTotal(plot, sel);
  return (
    <>
      {r && plot.totalSft ? (
        <div className="price-hero">
          <div className="ph-lbl">Total Project Estimate</div>
          <div className="ph-val">{fmtL(r.total)}</div>
          <div className="ph-note">
            {n(plot.totalSft)} sft × {fmt(r.rate)}/sft (blended)
            {r.lift > 0 ? ` + ${fmtL(r.lift)} lift` : ""}
          </div>
          <div className="ph-grid">
            <div>
              <div className="phg-v">{fmt(r.rate)}/sft</div>
              <div className="phg-k">Blended rate</div>
            </div>
            <div>
              <div className="phg-v">{n(plot.totalSft)} sft</div>
              <div className="phg-k">Total built-up</div>
            </div>
            <div>
              <div className="phg-v">{n(plot.slab)} sft</div>
              <div className="phg-k">Per floor</div>
            </div>
            <div>
              <div className="phg-v">G+{plot.floors - 1}</div>
              <div className="phg-k">Floors</div>
            </div>
          </div>
        </div>
      ) : null}
      {DEPTS.map((d) => (
        <div className="sum-grp" key={d.id}>
          <div className="sgt">{d.label}</div>
          {d.groups.map((g) => {
            const item = selectedItem(d, g.id, sel);
            if (!item) return null;
            return (
              <div className="sgr" key={g.id}>
                <span className="sl">{g.label}</span>
                <span className="sv">
                  {item.n}
                  <small>
                    {item.br} · {item.b}
                  </small>
                </span>
              </div>
            );
          })}
        </div>
      ))}
      {plot.plotL && plot.plotW ? (
        <div className="sum-grp">
          <div className="sgt">Plot Details</div>
          <div className="sgr">
            <span className="sl">Dimensions</span>
            <span className="sv">
              {plot.plotL}×{plot.plotW} ft{plot.facing ? " · " + plot.facing : ""}
            </span>
          </div>
          <div className="sgr">
            <span className="sl">Setbacks</span>
            <span className="sv">
              F{plot.sbF} R{plot.sbR} L{plot.sbL} Rt{plot.sbRt} ft
            </span>
          </div>
          <div className="sgr">
            <span className="sl">Parking</span>
            <span className="sv">{stiltLabel(plot.stilt)}</span>
          </div>
          <div className="sgr">
            <span className="sl">Built-up</span>
            <span className="sv">
              {n(plot.totalSft)} sft ({n(plot.slab)} × {plot.floors} floors)
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default function Estimator() {
  const [splash, setSplash] = useState<"show" | "exit" | "gone">("show");
  const [cp, setCp] = useState(0);
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [sel, setSel] = useState<Selections>(defaultSelections);
  const [sheetOpen, setSheetOpen] = useState(false);
  // bumped on every change so the header total replays its pulse
  const [tick, setTick] = useState(0);
  const tabRow = useRef<HTMLDivElement>(null);

  const plot = useMemo(() => derivePlot(inputs), [inputs]);
  const total = calcTotal(plot, sel);
  const pid = PAGES[cp];
  const isLast = cp === PAGES.length - 1;

  useEffect(() => {
    tabRow.current
      ?.querySelector(".active")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [cp]);

  function setInput<K extends keyof Inputs>(key: K, value: Inputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setTick((t) => t + 1);
  }

  function pickTier(deptId: string, groupId: string, tier: Tier) {
    setSel((prev) => ({ ...prev, [selKey(deptId, groupId)]: tier }));
    setTick((t) => t + 1);
  }

  function goTo(idx: number) {
    if (idx < 0 || idx >= PAGES.length) return;
    setCp(idx);
    window.scrollTo(0, 0);
  }

  function enterApp() {
    setSplash("exit");
    window.setTimeout(() => setSplash("gone"), 800);
  }

  function download() {
    const blob = new Blob([summaryText(plot, sel, new Date())], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Briklay-Estimate.txt";
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const numberField = (
    key: "plotL" | "plotW" | "sbF" | "sbR" | "sbL" | "sbRt",
    label: string,
    placeholder?: string,
  ) => (
    <div>
      <label className="fl" htmlFor={`ce-${key}`}>
        {label}
      </label>
      <div className="iw">
        <input
          type="number"
          inputMode="decimal"
          id={`ce-${key}`}
          placeholder={placeholder}
          value={inputs[key]}
          onChange={(e) => setInput(key, e.target.value)}
        />
        <sup>ft</sup>
      </div>
    </div>
  );

  const showResult = Boolean(plot.plotL && plot.plotW && plot.slab > 0);
  const base = baseRate(plot.totalSft);
  const stiltMod = STILT_MOD[plot.stilt] || 1;
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText(plot, sel))}`;

  return (
    <div className="ce">
      {/* logo artwork, defined once and reused */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="ce-arch" viewBox="0 0 500 622">
          <path fill="currentColor" fillRule="evenodd" d={ARCH_PATH} />
          <text
            x="250"
            y="597"
            fontFamily="Georgia,serif"
            fontSize="80"
            fontWeight="400"
            textAnchor="middle"
            fill="currentColor"
            letterSpacing="3"
          >
            Briklay
          </text>
        </symbol>
      </svg>

      {splash !== "gone" && (
        <div id="splash" className={splash === "exit" ? "exit" : undefined}>
          <div className="sp-glow" />
          <div className="sp-arc" />
          <div className="sp-arc" />
          <div className="sp-arc" />
          <div className="sp-rule top" />
          <div className="sp-rule bot" />
          <div className="sp-content">
            <div className="sp-logo-wrap">
              <Logo className="sp-logo" />
            </div>
            <div className="sp-eyebrow">Engineering · Design · Build</div>
            <h1 className="sp-headline">
              Your home,
              <br />
              built <em>right.</em>
            </h1>
            <p className="sp-sub">
              From foundation to finishing — every material chosen with intention, every rupee
              accounted for.
            </p>
            <div className="sp-stats">
              <div className="sp-stat">
                <div className="sp-stat-num">100%</div>
                <div className="sp-stat-lbl">Transparent pricing</div>
              </div>
              <div className="sp-stat">
                <div className="sp-stat-num">A–Z</div>
                <div className="sp-stat-lbl">Verified brands</div>
              </div>
              <div className="sp-stat">
                <div className="sp-stat-num">Real-time</div>
                <div className="sp-stat-lbl">Cost estimate</div>
              </div>
            </div>
            <button type="button" className="sp-btn" onClick={enterApp}>
              Begin Configuration
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="sp-footnote">Briklay Engineering</div>
          </div>
        </div>
      )}

      <div className="topbar">
        <div className="brand">
          <Logo className="topbar-logo" label="Briklay" />
        </div>
        <div className="top-right">
          <button type="button" className="bp-btn" onClick={() => setSheetOpen(true)}>
            Blueprint
          </button>
          <div className="live-rate">
            <div className="lr-lbl">Est. Total</div>
            <div className={`lr-val${tick ? " bump" : ""}`} id="topTotal" key={tick}>
              {total ? fmtL(total.total) : "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="tabs" id="tabRow" ref={tabRow}>
        {PAGES.map((p, i) => (
          <button
            type="button"
            key={p}
            className={`tab${i === cp ? " active" : ""}${i < cp && p !== "intro" ? " done" : ""}`}
            onClick={() => goTo(i)}
          >
            {PAGE_LABELS[p] || p}
          </button>
        ))}
      </div>

      <div className="scroll" id="mainScroll">
        {/* INTRO */}
        <div className={`page${pid === "intro" ? " active" : ""}`} id="page-0">
          <div className="intro-hero">
            <Logo className="intro-logo" />
            <h1>
              Design your home,
              <br />
              <em>your way.</em>
            </h1>
            <p>
              Answer a few questions, choose your materials, and get a real-time cost estimate that
              updates with every selection.
            </p>
            <button type="button" className="start-btn" onClick={() => goTo(1)}>
              Start Configuration →
            </button>
          </div>
          <div className="sec-grid" id="secGrid">
            {DEPTS.map((d, i) => (
              <button type="button" className="sec-card" key={d.id} onClick={() => goTo(i + 2)}>
                <span className="sc-n">{d.label}</span>
                <span className="sc-s">
                  {d.groups.length} item{d.groups.length > 1 ? "s" : ""}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* PLOT */}
        <div className={`page${pid === "plot" ? " active" : ""}`} id="page-1">
          <div className="sec-head">
            <h2>
              Your <em>Plot</em>
            </h2>
            <p>
              We&apos;ll calculate your exact buildable area and give you an accurate cost estimate.
            </p>
          </div>

          <div className="icard">
            <div className="icard-title">Plot dimensions</div>
            <div className="icard-sub">
              Enter your plot boundary. For irregular plots, use the overall bounding dimensions.
            </div>
            <div className="frow">
              {numberField("plotL", "Length", "40")}
              {numberField("plotW", "Width", "30")}
            </div>
            <div className="frow one">
              <div>
                <label className="fl" htmlFor="ce-facing">
                  Plot facing
                </label>
                <select
                  id="ce-facing"
                  value={inputs.facing}
                  onChange={(e) => setInput("facing", e.target.value)}
                >
                  <option value="">— Select —</option>
                  {FACINGS.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="icard">
            <div className="icard-title">Setbacks</div>
            <div className="icard-sub">
              Setbacks are the empty gaps your local authority requires you to leave on each side of
              the plot — no construction allowed in these strips.
            </div>
            <div className="hint">
              <strong>Why this matters:</strong> A 30×40 plot with 2ft setbacks on all sides leaves
              only 26×36 ft to build on — that&apos;s 936 sft instead of 1,200 sft. Getting this
              right prevents surprises later.
            </div>
            <div className="frow" style={{ marginTop: 12 }}>
              {numberField("sbF", "Front")}
              {numberField("sbR", "Rear")}
            </div>
            <div className="frow">
              {numberField("sbL", "Left side")}
              {numberField("sbRt", "Right side")}
            </div>
          </div>

          <div className="icard">
            <div className="icard-title">Number of floors</div>
            <div className="frow one">
              <div>
                <label className="fl" htmlFor="ce-floors">
                  Total floors to build
                </label>
                <select
                  id="ce-floors"
                  value={inputs.floors}
                  onChange={(e) => setInput("floors", e.target.value)}
                >
                  <option value="1">Ground floor only (G)</option>
                  <option value="2">G + 1 upper floor (G+1)</option>
                  <option value="3">G + 2 upper floors (G+2)</option>
                  <option value="4">G + 3 upper floors (G+3)</option>
                  <option value="5">G + 4 upper floors (G+4)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="icard">
            <div className="icard-title">Parking arrangement</div>
            <div className="icard-sub">
              How parking is handled affects what percentage of the ground floor is constructed,
              which changes your cost per sft.
            </div>
            <div className="stilt-list">
              {STILT_OPTIONS.map((o) => (
                <button
                  type="button"
                  key={o.v}
                  className={`stilt-opt${inputs.stilt === o.v ? " sel" : ""}`}
                  aria-pressed={inputs.stilt === o.v}
                  onClick={() => setInput("stilt", o.v)}
                >
                  <span className="so-t">{o.title}</span>
                  <span className="so-d">{o.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="res-box" id="resBox" style={{ display: showResult ? "block" : "none" }}>
            <div className="res-lbl">Your project breakdown</div>
            <div className="res-grid">
              <div className="res-item">
                <div className="v">{n(plot.slab)} sft</div>
                <div className="k">Slab area per floor</div>
              </div>
              <div className="res-item">
                <div className="v">
                  {n(plot.slab)} × {plot.floors}
                </div>
                <div className="k">Floors × slab area</div>
              </div>
              <div className="res-item">
                <div className="v">{n(plot.totalSft)} sft</div>
                <div className="k">Total built-up area</div>
              </div>
              <div className="res-item">
                <div className="v">{fmt(Math.round(base * stiltMod))}</div>
                <div className="k">Base rate / sft (standard)</div>
              </div>
            </div>
            <div className="res-note">
              {n(plot.totalSft)} sft total ({n(plot.slab)} sft/floor × {plot.floors} floors). Base
              rate ₹{n(base)}/sft for this project size with {stiltLabel(plot.stilt)}.
            </div>
          </div>
        </div>

        {/* MATERIAL PAGES */}
        {DEPTS.map((d) => {
          const strip = deptStrip(d, plot, sel);
          const isLift = d.id === "lift";
          return (
            <div
              className={`page${pid === d.id ? " active" : ""}`}
              id={`page-dept-${d.id}`}
              key={d.id}
            >
              <div className="sec-head">
                <h2>
                  <em>{d.label}</em>
                </h2>
                <p>
                  {isLift
                    ? "Lift cost is added directly to the total — it doesn't affect the per-sft rate."
                    : "All items start at Standard. Tap any grade to upgrade it — the total updates instantly."}
                </p>
              </div>
              <div className="callout">
                Standard is pre-selected everywhere. Only upgrade what matters most to you.
              </div>

              <div className="dept-strip">
                <div className="ds-item">
                  <div className="ds-v">{strip.rate}</div>
                  <div className="ds-k">Rate/sft</div>
                </div>
                <div className="ds-item">
                  <div className="ds-v">{strip.total}</div>
                  <div className="ds-k">{isLift ? "Lift add-on" : "Dept total"}</div>
                </div>
                <div className="ds-item">
                  <div className="ds-v">{strip.grade}</div>
                  <div className="ds-k">Grade mix</div>
                </div>
              </div>

              {d.groups.map((g) => {
                const chosen = sel[selKey(d.id, g.id)] || "std";
                const item = selectedItem(d, g.id, sel);
                return (
                  <div className="mat-section" key={g.id}>
                    <div className="mat-label">{g.label}</div>
                    <div className="tier-selector">
                      {g.items.map((it) => {
                        const active = it.t === chosen;
                        const costLabel = isLift
                          ? it.addCost && it.addCost > 0
                            ? `Adds ${fmtL(it.addCost)}`
                            : "No added cost"
                          : UPLIFT[it.t];
                        return (
                          <button
                            type="button"
                            key={it.t}
                            className={`ts-btn${active ? ` ${it.t}-active` : ""}`}
                            aria-pressed={active}
                            onClick={() => pickTier(d.id, g.id, it.t)}
                          >
                            <span className="tsb-radio">{active ? "✓" : ""}</span>
                            <span className="tsb-grade">{it.b}</span>
                            <span className="tsb-name">{it.n}</span>
                            <span className="tsb-uplift">{costLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                    {item && (
                      <div className="mat-detail open" key={item.t}>
                        <div className="md-name">{item.n}</div>
                        <div className="md-brand">{item.br}</div>
                        <div className="md-desc">{item.d}</div>
                        <div className="md-why">{item.w}</div>
                        <div className="md-specs">
                          {item.sp.map((s) => (
                            <span className="md-spec" key={s}>
                              {s}
                            </span>
                          ))}
                        </div>
                        {item.addCost && item.addCost > 0 ? (
                          <div className="lift-cost-note">
                            Adds approximately {fmtL(item.addCost)} to total project cost
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* SUMMARY */}
        <div className={`page${pid === "summary" ? " active" : ""}`} id="page-sum">
          <div className="sec-head">
            <h2>
              Your <em>Blueprint</em>
            </h2>
            <p>
              Your complete specification and cost estimate. Download to share with your contractor.
            </p>
          </div>
          <div id="inlineSum">
            <Summary plot={plot} sel={sel} />
          </div>
          <div className="wa-cta">
            <p>
              Want this checked against your actual plot? Send the estimate to Briklay on WhatsApp
              to take it further.
            </p>
            <a className="btn-wa" href={waHref} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 20l1.3-4.1A8 8 0 1 1 8.2 19L4 20z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
              Send to Briklay on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className={`bnav${cp === 0 ? "" : " show"}`} id="bnav">
        <button
          type="button"
          className="btn-back"
          style={{ visibility: cp <= 1 ? "hidden" : "visible" }}
          onClick={() => goTo(cp - 1)}
        >
          Back
        </button>
        <button
          type="button"
          className="btn-fwd"
          onClick={isLast ? download : () => goTo(cp + 1)}
        >
          {isLast ? "Download Summary" : "Continue"}
        </button>
      </div>

      <div className={`overlay${sheetOpen ? " open" : ""}`} id="overlay">
        <div className="ov-bg" onClick={() => setSheetOpen(false)} />
        <div className="sheet" role="dialog" aria-modal="true" aria-label="Your Blueprint">
          <div className="sh-handle" />
          <div className="sh-head">
            <Logo className="sh-logo" />
            <h3>Your Blueprint</h3>
            <p>Live selections &amp; estimate</p>
          </div>
          <div className="sh-body" id="ovBody">
            {sheetOpen && <Summary plot={plot} sel={sel} />}
          </div>
          <div className="sh-foot">
            <button type="button" className="btn-close" onClick={() => setSheetOpen(false)}>
              Close
            </button>
            <button type="button" className="btn-dl" onClick={download}>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
