// Pricing model for the cost estimator.
// Ported as-is from the sample configurator; tune rates and weights here.

import { DEPTS, type Dept, type Item, type Tier } from "./data";

export type Stilt = "full-stilt" | "partial-stilt" | "no-stilt";

/** Raw form values, exactly as typed. */
export type Inputs = {
  plotL: string;
  plotW: string;
  facing: string;
  sbF: string;
  sbR: string;
  sbL: string;
  sbRt: string;
  floors: string;
  stilt: Stilt;
};

/** deptId_groupId -> chosen tier */
export type Selections = Record<string, Tier>;

/** Share of the per-sft rate carried by each department. Lift is a fixed add-on. */
export const WEIGHTS: Record<string, number> = {
  civil: 0.42,
  grills: 0.06,
  interiors: 0.32,
  mep: 0.2,
  lift: 0,
};

/** Rate multiplier per grade. */
export const TIER_MULT: Record<Tier, number> = { std: 1.0, pre: 1.1, lux: 1.21 };

/** Starting rate per sft at standard grade. What stands at ground level sets it; it changes cost, not area. */
export const STILT_RATE: Record<Stilt, number> = {
  "full-stilt": 2000,
  "partial-stilt": 2100,
  "no-stilt": 2200,
};

export const DEFAULT_INPUTS: Inputs = {
  plotL: "",
  plotW: "",
  facing: "",
  sbF: "5",
  sbR: "3",
  sbL: "2",
  sbRt: "2",
  floors: "2",
  stilt: "full-stilt",
};

export function defaultSelections(): Selections {
  const sel: Selections = {};
  DEPTS.forEach((d) =>
    d.groups.forEach((g) => {
      sel[selKey(d.id, g.id)] = "std";
    }),
  );
  return sel;
}

export function selKey(deptId: string, groupId: string) {
  return `${deptId}_${groupId}`;
}

export type Plot = {
  plotL: number;
  plotW: number;
  sbF: number;
  sbR: number;
  sbL: number;
  sbRt: number;
  floors: number;
  facing: string;
  stilt: Stilt;
  /** slab area per floor, sft */
  slab: number;
  /** slab area x every floor, sft */
  totalSft: number;
};

const num = (v: string) => parseFloat(v) || 0;

export function derivePlot(i: Inputs): Plot {
  const plotL = num(i.plotL);
  const plotW = num(i.plotW);
  const sbF = num(i.sbF);
  const sbR = num(i.sbR);
  const sbL = num(i.sbL);
  const sbRt = num(i.sbRt);
  const floors = parseInt(i.floors, 10) || 2;
  const bL = Math.max(0, plotL - sbF - sbR);
  const bW = Math.max(0, plotW - sbL - sbRt);
  const slab = Math.round(bL * bW);
  return {
    plotL,
    plotW,
    sbF,
    sbR,
    sbL,
    sbRt,
    floors,
    facing: i.facing,
    stilt: i.stilt,
    slab,
    totalSft: slab * floors,
  };
}

function tierOf(sel: Selections, deptId: string, groupId: string): Tier {
  return sel[selKey(deptId, groupId)] || "std";
}

function deptAvgMult(d: Dept, sel: Selections) {
  let avg = 0;
  d.groups.forEach((g) => {
    avg += TIER_MULT[tierOf(sel, d.id, g.id)];
  });
  return avg / d.groups.length;
}

function blendedMult(sel: Selections) {
  let b = 0;
  let totalW = 0;
  DEPTS.forEach((d) => {
    if (d.w === 0) return; // lift handled separately
    const w = WEIGHTS[d.id] || d.w;
    b += w * deptAvgMult(d, sel);
    totalW += w;
  });
  return b / totalW;
}

export function liftCost(sel: Selections) {
  const liftDept = DEPTS.find((d) => d.id === "lift");
  if (!liftDept?.liftCosts) return 0;
  return liftDept.liftCosts[tierOf(sel, "lift", "lift")] || 0;
}

export type Total = { rate: number; total: number; lift: number };

export function calcTotal(p: Plot, sel: Selections): Total | null {
  if (!p.totalSft) return null;
  const base = STILT_RATE[p.stilt] ?? STILT_RATE["full-stilt"];
  const rate = Math.round((base * blendedMult(sel)) / 10) * 10;
  const lift = liftCost(sel);
  return { rate, total: rate * p.totalSft + lift, lift };
}

export type DeptStrip = { rate: string; total: string; grade: string };

const GRADE_NAME: Record<Tier, string> = {
  std: "Standard",
  pre: "Premium",
  lux: "Luxury",
};

export function deptStrip(d: Dept, p: Plot, sel: Selections): DeptStrip {
  if (d.id === "lift") {
    const lc = liftCost(sel);
    return {
      rate: lc > 0 ? fmtL(lc) : "None",
      total: lc > 0 ? fmtL(lc) : "Included",
      grade: GRADE_NAME[tierOf(sel, "lift", "lift")],
    };
  }
  const score =
    d.groups.reduce((s, g) => {
      const t = tierOf(sel, d.id, g.id);
      return s + (t === "lux" ? 2 : t === "pre" ? 1 : 0);
    }, 0) / d.groups.length;
  const grade = score >= 1.5 ? "Luxury" : score >= 0.5 ? "Premium" : "Standard";
  if (!p.totalSft) return { rate: "—", total: "—", grade };
  const w = WEIGHTS[d.id] || d.w;
  const base = STILT_RATE[p.stilt] ?? STILT_RATE["full-stilt"];
  const dRate = Math.round((base * deptAvgMult(d, sel)) / 10) * 10;
  return {
    rate: `${fmt(dRate)}/sft`,
    total: fmtL(dRate * p.totalSft * w),
    grade,
  };
}

export function selectedItem(d: Dept, groupId: string, sel: Selections): Item | undefined {
  const g = d.groups.find((x) => x.id === groupId);
  return g?.items.find((i) => i.t === tierOf(sel, d.id, groupId));
}

export const stiltLabel = (s: Stilt) => s.replace(/-/g, " ");

export const n = (v: number) => v.toLocaleString("en-IN");

export function fmt(v: number) {
  return "₹" + n(v);
}

export function fmtL(v: number) {
  if (v >= 10000000) return "₹" + (v / 10000000).toFixed(2) + " Cr";
  if (v >= 100000) return "₹" + (v / 100000).toFixed(1) + " L";
  return fmt(v);
}

/** Plain-text estimate, offered as a download. */
export function summaryText(p: Plot, sel: Selections, today: Date) {
  const r = calcTotal(p, sel);
  const rule = "─".repeat(30);
  let txt = "BRIKLAY ENGINEERING\nHOME SPECIFICATION & ESTIMATE\n" + "═".repeat(44) + "\n\n";
  txt += `Date: ${today.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}\n\n`;
  if (p.plotL && p.plotW) {
    txt += `PLOT\n${rule}\n`;
    txt += `  Size: ${p.plotL}×${p.plotW} ft${p.facing ? " · " + p.facing + " facing" : ""}\n`;
    txt += `  Setbacks: F${p.sbF} R${p.sbR} L${p.sbL} Rt${p.sbRt} ft\n`;
    txt += `  Slab area/floor: ${n(p.slab)} sft\n`;
    txt += `  Total built-up: ${n(p.totalSft)} sft (${n(p.slab)} × ${p.floors} floors)\n`;
    txt += `  Parking: ${stiltLabel(p.stilt)}\n\n`;
  }
  if (r) {
    txt += `ESTIMATE\n${rule}\n`;
    txt += `  Total built-up: ${n(p.totalSft)} sft\n`;
    txt += `  Rate (blended): ${fmt(r.rate)}/sft\n`;
    if (r.lift > 0) txt += `  Lift addition: ${fmtL(r.lift)}\n`;
    txt += `  TOTAL: ${fmtL(r.total)}\n\n`;
  }
  DEPTS.forEach((d) => {
    txt += `${d.label.toUpperCase()}\n${rule}\n`;
    d.groups.forEach((g) => {
      const item = selectedItem(d, g.id, sel);
      if (item) txt += `  ${g.label}: ${item.n} [${item.b}]\n    ${item.br}\n`;
    });
    txt += "\n";
  });
  txt +=
    "═".repeat(44) +
    "\nPreliminary estimate — subject to site conditions and contractor confirmation.\n";
  return txt;
}

/** Short message that opens in WhatsApp, addressed to Briklay. */
export function whatsappText(p: Plot, sel: Selections) {
  const r = calcTotal(p, sel);
  const lines = ["Hi Briklay, I used the cost estimator on briklay.in.", ""];
  if (p.plotL && p.plotW) {
    lines.push(`Plot: ${p.plotL}×${p.plotW} ft${p.facing ? ", " + p.facing + " facing" : ""}`);
    lines.push(
      `Built-up: ${n(p.totalSft)} sft (${n(p.slab)} sft × ${p.floors} floors, ${stiltLabel(p.stilt)})`,
    );
  }
  if (r) {
    lines.push(
      `Estimate: ${fmtL(r.total)} at ${fmt(r.rate)}/sft${r.lift > 0 ? `, including ${fmtL(r.lift)} lift` : ""}`,
    );
  }
  const upgrades: string[] = [];
  DEPTS.forEach((d) =>
    d.groups.forEach((g) => {
      const item = selectedItem(d, g.id, sel);
      if (item && item.t !== "std") upgrades.push(`- ${g.label}: ${item.n} (${item.b})`);
    }),
  );
  lines.push("");
  if (upgrades.length) lines.push("Upgrades chosen:", ...upgrades);
  else lines.push("All materials at Standard grade.");
  lines.push("", "Please get in touch to discuss my home.");
  return lines.join("\n");
}
