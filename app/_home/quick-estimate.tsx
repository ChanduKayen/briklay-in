"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { waLink } from "../_lib/contact";
import {
  DEFAULT_INPUTS,
  calcTotal,
  defaultSelections,
  derivePlot,
  n,
} from "../costestimator/pricing";
import { WhatsAppIcon } from "./icons";

const PRESETS: [number, number][] = [
  [30, 40],
  [30, 50],
  [40, 60],
  [50, 80],
];

const FLOORS = [
  { v: 1, label: "G" },
  { v: 2, label: "G+1" },
  { v: 3, label: "G+2" },
  { v: 4, label: "G+3" },
  { v: 5, label: "G+4" },
];

const STANDARD = defaultSelections();

function money(v: number) {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} crore`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)} lakh`;
  return `₹${n(v)}`;
}

/** Plot plan: the plot, the setbacks and what is left to build on. */
function PlotPlan({ width, depth }: { width: number; depth: number }) {
  const hatch = useId();
  const sb = {
    front: Number(DEFAULT_INPUTS.sbF),
    rear: Number(DEFAULT_INPUTS.sbR),
    left: Number(DEFAULT_INPUTS.sbL),
    right: Number(DEFAULT_INPUTS.sbRt),
  };
  const ok = width > 0 && depth > 0;
  const w = ok ? width : 30;
  const d = ok ? depth : 40;
  const s = Math.min(160 / w, 120 / d);
  const pw = w * s;
  const pd = d * s;
  const x0 = 50 + (160 - pw) / 2;
  const y0 = 8 + (120 - pd) / 2;
  const bw = Math.max(0, w - sb.left - sb.right) * s;
  const bd = Math.max(0, d - sb.front - sb.rear) * s;
  return (
    <svg className="qe-plan" viewBox="0 0 220 166" aria-hidden="true">
      <defs>
        <pattern id={hatch} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" className="qe-hatch" />
        </pattern>
      </defs>
      <rect className="qe-plot" x={x0} y={y0} width={pw} height={pd} />
      {bw > 0 && bd > 0 && (
        <>
          <rect x={x0 + sb.left * s} y={y0 + sb.rear * s} width={bw} height={bd} fill={`url(#${hatch})`} />
          <rect className="qe-build" x={x0 + sb.left * s} y={y0 + sb.rear * s} width={bw} height={bd} />
        </>
      )}
      {/* width, along the road */}
      <g className="qe-dim">
        <line x1={x0} y1={y0 + pd + 12} x2={x0 + pw} y2={y0 + pd + 12} />
        <line x1={x0 - 3} y1={y0 + pd + 15} x2={x0 + 3} y2={y0 + pd + 9} />
        <line x1={x0 + pw - 3} y1={y0 + pd + 15} x2={x0 + pw + 3} y2={y0 + pd + 9} />
        <text x={x0 + pw / 2} y={y0 + pd + 31} textAnchor="middle">
          {ok ? `${width} ft` : "width"}
        </text>
      </g>
      {/* depth */}
      <g className="qe-dim">
        <line x1={x0 - 12} y1={y0} x2={x0 - 12} y2={y0 + pd} />
        <line x1={x0 - 15} y1={y0 + 3} x2={x0 - 9} y2={y0 - 3} />
        <line x1={x0 - 15} y1={y0 + pd + 3} x2={x0 - 9} y2={y0 + pd - 3} />
        <text
          x={x0 - 21}
          y={y0 + pd / 2}
          textAnchor="middle"
          transform={`rotate(-90 ${x0 - 21} ${y0 + pd / 2})`}
        >
          {ok ? `${depth} ft` : "depth"}
        </text>
      </g>
    </svg>
  );
}

export default function QuickEstimate() {
  const [width, setWidth] = useState("30");
  const [depth, setDepth] = useState("40");
  const [floors, setFloors] = useState(2);

  const w = parseFloat(width) || 0;
  const d = parseFloat(depth) || 0;
  const plot = derivePlot({ ...DEFAULT_INPUTS, plotL: depth, plotW: width, floors: String(floors) });
  const total = calcTotal(plot, STANDARD);
  const floorLabel = floors === 1 ? "a ground floor" : `G+${floors - 1}`;
  const query = `?w=${encodeURIComponent(width)}&d=${encodeURIComponent(depth)}&floors=${floors}`;

  return (
    <div className="qe">
      <div className="qe-controls">
        <fieldset className="qe-field">
          <legend>Plot size, in feet</legend>
          <div className="qe-chips">
            {PRESETS.map(([pw, pd]) => {
              const on = w === pw && d === pd;
              return (
                <button
                  type="button"
                  key={`${pw}x${pd}`}
                  className="qe-chip"
                  aria-pressed={on}
                  onClick={() => {
                    setWidth(String(pw));
                    setDepth(String(pd));
                  }}
                >
                  {pw} × {pd}
                </button>
              );
            })}
          </div>
          <div className="qe-inputs">
            <label>
              <span>Width, along the road</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </label>
            <label>
              <span>Depth</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="qe-field">
          <legend>Floors</legend>
          <div className="qe-seg">
            {FLOORS.map((f) => (
              <button
                type="button"
                key={f.v}
                className="qe-segbtn"
                aria-pressed={floors === f.v}
                onClick={() => setFloors(f.v)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="qe-result">
        <PlotPlan width={w} depth={d} />
        <div className="qe-figures" aria-live="polite">
          {total ? (
            <>
              <p className="qe-about">About</p>
              <p className="qe-total">{money(total.total)}</p>
              <p className="qe-line">
                {n(plot.totalSft)} sq ft over {floorLabel}, at ₹{n(total.rate)} per sq ft with standard
                materials.
              </p>
            </>
          ) : (
            <p className="qe-line">
              Nothing is left to build on after setbacks. Check the width and depth of the plot.
            </p>
          )}
        </div>
        <div className="qe-actions">
          <Link className="btn btn-solid" href={`/costestimator${total ? query : ""}`}>
            Choose materials, see the full cost
          </Link>
          <a
            className="btn btn-wa"
            href={waLink(
              total
                ? `Hi Briklay, I have a ${width} × ${depth} ft plot and want to build ${floorLabel}. Your website shows about ${money(total.total)}. I would like to talk.`
                : "Hi Briklay, I would like a cost estimate for my home.",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
            Chat on WhatsApp
          </a>
        </div>
        <p className="qe-note">
          A rough figure, not a quote. It assumes setbacks of 5 ft at the front, 3 ft at the rear and
          2 ft on each side, and counts every floor including stilt parking.
        </p>
      </div>
    </div>
  );
}
