import type { CSSProperties } from "react";

/** Delay (seconds) at which a part of the drawing appears. */
const at = (t: number) => ({ "--t": `${t}s` }) as CSSProperties;

const COLUMNS = [52, 124, 214, 284];
const GRID = ["A", "B", "C", "D"];

const LEVELS = [
  { y: 262, label: "Ground" },
  { y: 198, label: "First" },
  { y: 130, label: "Second" },
  { y: 64, label: "Terrace" },
];

type Tag = {
  label: string;
  /** point on the building being checked */
  dot: [number, number];
  /** where the leader meets the tag */
  to: [number, number];
  /** tag box: x, y, width */
  box: [number, number, number];
  t: number;
};

// in the order the home is built: bottom to top
const TAGS: Tag[] = [
  { label: "Footing depth", dot: [124, 280], to: [132, 292], box: [132, 286, 90], t: 2.5 },
  { label: "Cube test", dot: [169, 201], to: [169, 222], box: [134, 222, 70], t: 2.8 },
  { label: "Wall plumb", dot: [112, 100], to: [106, 100], box: [29, 93, 77], t: 3.1 },
  { label: "Ponding test", dot: [170, 67], to: [170, 50], box: [128, 35, 85], t: 3.4 },
];

/**
 * Front elevation of a G+2 home, drawn the way our own sheets are drawn.
 * It draws itself on load, bottom to top, and each stage gets its check.
 */
export default function HeroDrawing() {
  return (
    <svg
      className="hd"
      viewBox="0 0 360 332"
      role="img"
      aria-label="Line drawing of a three-storey home with four quality checks marked on it: footing depth, cube test, wall plumb and ponding test."
    >
      {/* ground */}
      <line className="hd-heavy hd-draw" pathLength={1} x1="0" y1="262" x2="360" y2="262" style={at(0)} />

      {/* footings, below ground so shown as hidden lines */}
      <g className="hd-hidden hd-fade" style={at(0.25)}>
        {COLUMNS.map((x) => (
          <g key={x}>
            <path d={`M${x - 3} 262V276M${x + 3} 262V276`} />
            <rect x={x - 10} y="276" width="20" height="8" />
          </g>
        ))}
      </g>

      {/* columns */}
      {COLUMNS.map((x, i) => (
        <rect
          key={x}
          className="hd-line hd-draw"
          pathLength={1}
          x={x - 3}
          y="204"
          width="6"
          height="58"
          style={at(0.45 + i * 0.05)}
        />
      ))}

      {/* first floor slab, walls */}
      <rect className="hd-line hd-draw" pathLength={1} x="32" y="198" width="258" height="6" style={at(0.75)} />
      <path className="hd-line hd-draw" pathLength={1} d="M49 198V136M287 198V136" style={at(0.95)} />

      {/* second floor slab, walls */}
      <rect className="hd-line hd-draw" pathLength={1} x="46" y="130" width="244" height="6" style={at(1.15)} />
      <path className="hd-line hd-draw" pathLength={1} d="M112 130V70M287 130V70" style={at(1.35)} />

      {/* roof slab, parapet, stair room, tank */}
      <rect className="hd-line hd-draw" pathLength={1} x="108" y="64" width="184" height="6" style={at(1.55)} />
      <path className="hd-line hd-draw" pathLength={1} d="M112 64V54H287V64" style={at(1.7)} />
      <rect className="hd-line hd-draw" pathLength={1} x="234" y="28" width="44" height="26" style={at(1.8)} />
      <rect className="hd-thin hd-draw" pathLength={1} x="246" y="15" width="20" height="13" rx="3" style={at(1.9)} />

      {/* terrace parapet over the first floor */}
      <path className="hd-line hd-draw" pathLength={1} d="M49 130V118H112" style={at(1.7)} />

      {/* openings */}
      <g className="hd-thin">
        <path className="hd-draw" pathLength={1} d="M236 262V214H260V262" style={at(1.95)} />
        <path className="hd-draw" pathLength={1} d="M62 198V146H106V198M84 146V198" style={at(2.0)} />
        <path className="hd-draw" pathLength={1} d="M150 150H258V184H150ZM186 150V184M222 150V184" style={at(2.05)} />
        <path className="hd-draw" pathLength={1} d="M132 84H190V116H132ZM161 84V116" style={at(2.1)} />
        <path className="hd-draw" pathLength={1} d="M216 84H270V116H216ZM243 84V116" style={at(2.15)} />
      </g>

      {/* balcony railing */}
      <g className="hd-thin hd-fade" style={at(2.2)}>
        <line x1="32" y1="176" x2="112" y2="176" />
        {[32, 42, 52, 62, 72, 82, 92, 102, 112].map((x) => (
          <line key={x} x1={x} y1="176" x2={x} y2="198" />
        ))}
      </g>

      {/* tree */}
      <g className="hd-thin hd-fade" style={at(2.25)}>
        <line x1="16" y1="262" x2="16" y2="245" />
        <circle cx="16" cy="234" r="11" />
      </g>

      {/* floor levels */}
      <g className="hd-fade" style={at(2.3)}>
        {LEVELS.map((l) => (
          <g key={l.label}>
            {l.y !== 262 && <line className="hd-thin" x1="293" y1={l.y} x2="305" y2={l.y} />}
            <text className="hd-note" x="309" y={l.y === 262 ? 257 : l.y + 3}>
              {l.label}
            </text>
          </g>
        ))}
      </g>

      {/* structural grid */}
      <g className="hd-fade" style={at(2.3)}>
        {COLUMNS.map((x, i) => (
          <g key={x}>
            <line className="hd-hidden" x1={x} y1="290" x2={x} y2="310" />
            <circle className="hd-thin" cx={x} cy="318" r="8" />
            <text className="hd-note" x={x} y="321.5" textAnchor="middle">
              {GRID[i]}
            </text>
          </g>
        ))}
      </g>

      {/* the checks */}
      {TAGS.map((tag) => (
        <g className="hd-tag" key={tag.label} style={at(tag.t)}>
          <line className="hd-leader" x1={tag.dot[0]} y1={tag.dot[1]} x2={tag.to[0]} y2={tag.to[1]} />
          <circle className="hd-dot" cx={tag.dot[0]} cy={tag.dot[1]} r="2.6" />
          <rect className="hd-tagbox" x={tag.box[0]} y={tag.box[1]} width={tag.box[2]} height="15" rx="2" />
          <path
            className="hd-tick"
            d={`M${tag.box[0] + 6} ${tag.box[1] + 7.8}l2.6 2.6l4.8-5.4`}
          />
          <text className="hd-taglabel" x={tag.box[0] + 18} y={tag.box[1] + 10.8}>
            {tag.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
