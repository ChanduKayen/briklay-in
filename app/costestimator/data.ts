// Material catalogue for the cost estimator.
// Ported as-is from the sample configurator; edit copy and brands here.

export type Tier = "std" | "pre" | "lux";

export type Item = {
  /** tier */
  t: Tier;
  /** tier badge */
  b: string;
  /** name */
  n: string;
  /** brands */
  br: string;
  /** description */
  d: string;
  /** why Briklay recommends it */
  w: string;
  /** spec chips */
  sp: string[];
  /** fixed rupee add-on (lift only) */
  addCost?: number;
};

export type Group = { id: string; label: string; items: Item[] };

export type Dept = {
  id: string;
  label: string;
  pg: string;
  /** share of the per-sft rate; 0 = priced as a fixed add-on */
  w: number;
  liftCosts?: Record<Tier, number>;
  groups: Group[];
};

// prettier-ignore
export const DEPTS: Dept[] = [
{id:'civil', label:'Civil Works', pg:'Civil', w:0.40,
 groups:[
  {id:'concrete', label:'Concrete grade', items:[
   {t:'std',b:'Standard',n:'M20 Site-Mixed',br:'Controlled site mix — weigh-batching required',
    d:'20 N/mm² characteristic strength. Briklay permits site-mixed concrete only with calibrated weigh-batching, a designated site engineer on every pour, and mandatory cube testing at 7 and 28 days. No guesswork with bags-by-hand.',
    w:'Briklay uses this only on very small ancillary structures. For main RCC work, we recommend stepping up to M25 RMC — the cost difference over the whole project is typically under 2%.',sp:['20 N/mm²','Weigh-batching required','Cube testing','IS 456']},
   {t:'pre',b:'Premium',n:'M25 Ready-Mix Concrete',br:'ACC RMC · Ultratech RMC · Prism RMC',
    d:'Consistent design-mix concrete delivered from a certified batching plant. Every truck carries a delivery challan with mix design details and water-cement ratio. Eliminates the single biggest source of structural failure in Indian residential — inconsistent site mixing.',
    w:'Briklay specifies M25 RMC as our standard for all structural elements. We work with ACC and Ultratech RMC plants that we have verified for quality — not just the nearest plant.',sp:['25 N/mm²','Design mix','Delivery challan','Certified batching plant']},
   {t:'lux',b:'Luxury',n:'M30 Ready-Mix Concrete',br:'ACC RMC · Ultratech RMC · UltraTech Concrete',
    d:'Denser, stronger concrete with lower permeability. The extra strength is almost irrelevant for loading — the real benefit is impermeability. Water and chloride ingress are the primary causes of structural deterioration; M30 resists both far better than M25.',
    w:'Briklay recommends M30 for all coastal projects, basements, sumps, and any slab exposed to the elements. The long-term maintenance savings more than recover the upfront premium.',sp:['30 N/mm²','Low permeability','Coastal-grade','60–80yr structural life']}
  ]},
  {id:'bricks', label:'Masonry / Bricks', items:[
   {t:'std',b:'Standard',n:'Red Clay Brick',br:'Local IS 1077 kiln · Wienerberger clay (select markets)',
    d:'Traditional fired clay brick. Good thermal mass, widely available, easy to repair. Briklay sources only IS 1077-certified bricks and conducts water absorption tests on every batch delivered to site.',
    w:'Briklay does not simply accept whatever bricks arrive from the nearest kiln. We test and certify every delivery — because a brick that fails water absorption will cause seepage problems in the finished wall.',sp:['IS 1077 certified','Batch-tested','Good thermal mass','Easy repair']},
   {t:'pre',b:'Premium',n:'AAC Block',br:'Aerocon · Siporex · Biltech',
    d:'Autoclaved Aerated Concrete — 3× lighter than brick, excellent thermal insulation (U-value ~0.3 W/m²K), and dimensionally precise. Faster construction with less mortar waste. Aerocon and Siporex are the two most quality-consistent brands in India.',
    w:'Briklay recommends AAC blocks for all projects where thermal comfort is a priority. The dead load reduction also allows slightly lighter structural design — a saving that partially offsets the block premium.',sp:['Aerocon / Siporex','Lightweight','Better insulation','20% faster walling']},
   {t:'lux',b:'Luxury',n:'AAC Block + Wienerberger Facing Brick',br:'Aerocon / Siporex + Wienerberger Porotherm',
    d:'AAC for structural walls (performance) with Wienerberger Porotherm or Terca facing brick on exterior (aesthetics). Wienerberger is the world\'s largest brick manufacturer — their facing bricks are dimensionally perfect and weather-proof without any render.',
    w:'Briklay specifies this combination when clients want an architectural exterior that requires no painting or rendering — ever. The facing brick becomes a permanent, self-maintaining finish.',sp:['Aerocon / Siporex core','Wienerberger Terca facing','No painting needed','Architectural exterior']}
  ]},
  {id:'steel', label:'TMT Reinforcement Steel', items:[
   {t:'std',b:'Standard',n:'Fe 500D TMT',br:'TATA Tiscon · JSW Neosteel · Kamdhenu',
    d:'500 MPa yield strength with D-grade ductility — the correct minimum for any reinforced concrete structure. Briklay does not specify Fe 415 on any project; Fe 500D is our baseline because the cost difference is marginal but the structural benefit is significant.',
    w:'At Briklay, Fe 500D is our floor — not a premium. TATA Tiscon and JSW Neosteel are our preferred brands for their consistent rolling quality and IS 1786 certification.',sp:['500 MPa','D-grade ductility','IS 1786','TATA Tiscon / JSW']},
   {t:'pre',b:'Premium',n:'Fe 500D TMT — TATA Tiscon 550 SD',br:'TATA Tiscon 550 SD · Vizag Steel',
    d:'TATA Tiscon 550 SD — higher yield with superior ductility. Produced at TATA\'s own steel plant with traceable heat numbers and mill test certificates. Recommended for G+3 and above, and all seismic zone II/III sites.',
    w:'Briklay insists on mill certificates and heat traceability at this grade. Vizag Steel (RINL) is the public-sector alternative with equally reliable quality.',sp:['550 MPa','Seismic zone II/III','Mill cert + traceability','TATA Tiscon 550 SD']},
   {t:'lux',b:'Luxury',n:'Fe 550D CRS — Corrosion Resistant',br:'TATA Tiscon CRS · SAIL TMT-CRS',
    d:'Chromium-bearing corrosion-resistant TMT. Forms a self-protecting oxide layer that resists salt-laden air and high humidity. Designed for coastal and waterfront projects with an 80+ year structural design life.',
    w:'Briklay specifies CRS grade for all projects within 5 km of a coastline — it is a non-negotiable call we make on behalf of our clients\' long-term interests.',sp:['550 MPa','CRS coating','Coastal + humid','80yr design life']}
  ]},
  {id:'sand', label:'Sand & Aggregates', items:[
   {t:'std',b:'Standard',n:'River Sand + Stone Aggregate',br:'Local quarry',
    d:'Conventional river sand and crushed stone. Widely used and well understood.',
    w:'Works well when properly graded and moisture-controlled by a careful contractor.',sp:['Available everywhere','Proven','Cost-effective']},
   {t:'pre',b:'Premium',n:'M-Sand + Graded Aggregate',br:'Robo Silicon',
    d:'Manufactured sand — consistent grading, no organic matter, no silt. Produces more uniform concrete.',
    w:'More consistent concrete strength and a more sustainable source than river sand.',sp:['Consistent grading','Zero silt','Eco-friendly']},
   {t:'lux',b:'Luxury',n:'M-Sand + Micro-silica Admix',br:'Robo Silicon + Fosroc',
    d:'Premium M-Sand with micro-silica admixtures. Ultra-dense, high-strength, low-permeability concrete.',
    w:'Achieves C30+ equivalent performance. Best for premium RCC and water-retaining structures.',sp:['Ultra-dense','Low permeability','Chemical-resistant']}
  ]},
  {id:'wp', label:'Waterproofing', items:[
   {t:'std',b:'Standard',n:'Acrylic Waterproof Coat',br:'Dr. Fixit Pidifin 2K · STP Dampstop · Fosroc Nitoproof',
    d:'Flexible polymer-modified acrylic coating applied in 2 coats to bathroom floors, sunken slabs, and terrace. Dr. Fixit Pidifin 2K is a two-component system that outperforms standard single-component acrylic. Briklay applies a reinforcing third coat at all pipe penetrations and slab corners.',
    w:'Briklay treats waterproofing as the most critical invisible work on every project. We have never had a seepage complaint on a completed home — that record comes from specifying correctly and applying thoroughly, not from cutting corners.',sp:['Dr. Fixit Pidifin 2K','2-component','Extra at penetrations','8-10yr life']},
   {t:'pre',b:'Premium',n:'PU Coat + Crystalline Admix',br:'Dr. Fixit PU + Xypex Canada · Kryton Krystol',
    d:'Polyurethane coating on terraces (UV-stable, 10+ year life) combined with Xypex or Kryton crystalline admixture in all bathroom and sump concrete. Crystalline compounds grow inside concrete pores and self-heal future micro-cracks.',
    w:'Briklay recommends this combination on all homes with exposed flat terraces. Xypex Canada and Kryton Krystol carry NSF 61 certification — safe for drinking water tanks. We do not cut to cheaper crystalline products.',sp:['Xypex / Kryton crystalline','PU terrace coat','Self-healing','NSF 61 certified']},
   {t:'lux',b:'Luxury',n:'Torch Membrane + Crystalline',br:'Soprema Alsan · Grace Bituthene + Xypex',
    d:'Torch-applied SBS-modified bituminous membrane (Soprema Alsan or Grace Bituthene) for terraces — the same system used in commercial buildings and 5-star hotels. Combined with crystalline in all structural concrete and polymer-modified slurry at bathroom beds.',
    w:'Briklay specifies Soprema and Grace for clients who want absolute certainty about their terrace. These brands have been the global commercial waterproofing standard for over 50 years — we see no reason to use less for a premium home.',sp:['Soprema / Grace','25yr membrane life','Triple-system approach','Commercial-grade']}
  ]}
]},

{id:'grills', label:'Grills & Railings', pg:'Grills', w:0.03,
 groups:[
  {id:'grills', label:'Window grills & stair railings', items:[
   {t:'std',b:'Standard',n:'MS Square Bar Grills — Hot-Dip Galvanised',br:'Local fabrication · IS 2062 MS',
    d:'Mild steel IS 2062 square bar grills in vertical or geometric pattern. Hot-dip galvanised (not brush-painted) and finished with weatherproof enamel. Briklay insists on hot-dip galvanising rather than simple paint — it penetrates into the steel and provides 15+ years of rust resistance.',
    w:'Briklay\'s standard grill spec includes hot-dip galvanising rather than paint alone. Most contractors skip this step to save cost — we do not, because a rusting grill stains the entire facade.',sp:['IS 2062 MS','Hot-dip galvanised','15yr rust protection','Powder-coat top finish']},
   {t:'pre',b:'Premium',n:'MS Designer Grills — Powder Coated',br:'Local fabrication + Berger / Asian powder coat',
    d:'Mild steel with custom design — geometric, jaali-inspired, or architectural pattern. Powder-coated in a RAL colour of your choice. Briklay works with specialist fabricators and sends powder coat samples for client approval before execution.',
    w:'Briklay recommends powder-coated designer grills for all street-facing windows. The design and colour are chosen to complement the facade — not applied as an afterthought.',sp:['Custom design','RAL colour choice','10yr powder coat','Architectural look']},
   {t:'lux',b:'Luxury',n:'SS 304 Framed Glass Railing',br:'Ozone Overseas · Dorset · Hafele SS systems',
    d:'Grade 304 stainless steel posts with 12mm toughened glass infill panels. Glass is SGP-laminated at balconies. Ozone Overseas and Dorset are India\'s leading manufacturers of SS railing systems with nationwide support.',
    w:'Briklay recommends SS glass railings for all terraces and stair balustrades in premium projects. Zero maintenance, open sightlines, and a finish that looks as good in 20 years as it does on day one.',sp:['SS 304','12mm toughened glass','SGP-laminated balcony','Ozone / Dorset']}
  ]}
]},

{id:'interiors', label:'Interior Finishes', pg:'Interiors', w:0.30,
 groups:[
  {id:'flooring', label:'Flooring tiles', items:[
   {t:'std',b:'Standard',n:'GVT 600×600',br:'Somany Ceramics · Asian Granito · Nitco',
    d:'Glazed vitrified tile in 600×600 format. Wide design range from all three brands. Briklay specifies Somany, Asian Granito, or Nitco at standard grade — all three have nationwide replacement stock, which matters if a tile needs to be matched years later.',
    w:'Briklay selects brands at standard grade based on long-term replacement availability as much as upfront quality. You should be able to match your tile in 10 years.',sp:['Somany / Asian Granito / Nitco','600×600 GVT','Wide replacement stock','IS 13753']},
   {t:'pre',b:'Premium',n:'GVT 600×1200',br:'Kajaria · RAK Ceramics · Nexion',
    d:'Large-format GVT in 600×1200 — fewer grout lines, seamless appearance, noticeably more spacious feel. Kajaria has the widest 600×1200 range in India. RAK Ceramics offers superior glaze consistency. Briklay presents both ranges side by side for client selection.',
    w:'Briklay recommends 600×1200 for all living rooms, master bedrooms, and corridors. It is the single upgrade most clients say they are glad they made.',sp:['Kajaria / RAK / Nexion','600×1200 large format','Fewer joints','10yr warranty']},
   {t:'lux',b:'Luxury',n:'800×1600 Slab / Natural Marble',br:'Qutone · RAK Classtone · Italian / Rajasthan marble',
    d:'Qutone and RAK Classtone ultra-large slab tiles, or genuine natural marble sourced from Italian or Rajasthan quarries. Near-seamless floor with almost no visible grout lines. Briklay\'s luxury tile sourcing includes a sample approval visit to the supplier showroom.',
    w:'Briklay treats tile selection at luxury grade as a design exercise, not a catalogue choice. We take clients through slab selection personally — because at this scale, every slab looks different and the layout matters.',sp:['Qutone / RAK Classtone','800×1600 or natural marble','Near-seamless','Client-selected slabs']}
  ]},
  {id:'bathrooms', label:'Sanitaryware & CP fittings', items:[
   {t:'std',b:'Standard',n:'Cera / Parryware + Cera CP',br:'Cera Sanitaryware · Parryware · Cera Faucets',
    d:'Cera and Parryware are India\'s most-serviced sanitary brands with replacement parts available in virtually every town. Cera\'s Quartz series offers good aesthetics. Briklay specifies Cera CP fittings at standard grade — brass body, ceramic cartridge, 5-year warranty.',
    w:'Briklay chooses Cera and Parryware at standard grade because service availability across India is unmatched. A sanitaryware brand that cannot be serviced in your city in 10 years is a false economy.',sp:['Cera / Parryware','Brass-body CP fittings','5yr warranty','Pan-India service']},
   {t:'pre',b:'Premium',n:'Jaquar / Hindware-Roca + Jaquar CP',br:'Jaquar · Hindware-Roca · Jaquar Artize CP',
    d:'Jaquar is India\'s most complete bathroom brand — sanitaryware, CP fittings, showers, and geysers from one system. Hindware-Roca brings Spanish Roca design at accessible pricing. Both include rain shower + hand shower combo at this grade. Jaquar\'s Artize sub-brand is their premium CP line.',
    w:'Briklay recommends Jaquar at Premium grade for a coordinated bathroom — one brand manages all elements, one service call resolves any issue. The rain shower + hand shower included at this grade is, in our experience, the upgrade clients appreciate most.',sp:['Jaquar / Hindware-Roca','Rain + hand shower','Coordinated system','10yr warranty']},
   {t:'lux',b:'Luxury',n:'Kohler / TOTO + Grohe CP',br:'Kohler · TOTO · Grohe Germany',
    d:'TOTO\'s Tornado Flush uses 70% less water and the Cefiontect glaze is effectively self-cleaning. Kohler\'s Veil collection defines the luxury bathroom aesthetic. Grohe Germany CP fittings are built to DIN standards with ceramic disc cartridges rated for 500,000 cycles. Briklay\'s luxury bathroom spec always includes a thermostatic shower system.',
    w:'Briklay has fitted TOTO sanitaryware in luxury projects for several years. Clients who experience the washlet seat consistently say it is the one feature they will never remove. Grohe\'s German engineering is reflected in every turn of the tap.',sp:['TOTO Tornado Flush','Self-cleaning Cefiontect','Grohe DIN-standard CP','Thermostatic shower']}
  ]},
  {id:'doors', label:'Interior doors & frames', items:[
   {t:'std',b:'Standard',n:'Flush Door + Granite Frame',br:'Century Ply / Greenply flush · Granite frame local',
    d:'Blockboard-core flush door with BWR-grade ply skin, fitted into a granite stone frame. Briklay uses granite frames — not MS angle — because granite is termite-proof, does not corrode, and stays perfectly plumb for decades without painting.',
    w:'Briklay\'s standard spec already uses granite frames rather than the MS frames you\'ll see in most builder projects. It is a small detail that makes a big difference to long-term quality.',sp:['BWR ply skin','Granite frame','Termite-proof frame','No painting needed']},
   {t:'pre',b:'Premium',n:'Membrane Panel Door + Granite Frame',br:'Durian · Godrej Interio · Merino Laminates + Granite frame',
    d:'Moulded panel effect with PVC membrane laminate over MDF core. No swelling in humidity, no delamination. Fitted in a polished granite frame. Briklay specifies Durian and Godrej Interio for consistent quality and their 10-year warranty on the laminate finish.',
    w:'Briklay recommends membrane doors for all master bedrooms and common areas — the improvement in appearance and humidity resistance over plain flush doors is immediately obvious.',sp:['PVC membrane','No swelling','Granite frame','Durian / Godrej Interio']},
   {t:'lux',b:'Luxury',n:'Solid Teak Panel Door + Teak Frame',br:'Myanmar Grade-A Teak · Hafele / Dorma hardware',
    d:'Solid Myanmar teak panel doors fitted in matching teak wood frames — not granite. Teak-to-teak gives a seamless, architectural look. Hardware from Hafele or Dorma. Briklay sources teak directly through verified suppliers to ensure Grade-A quality with no hollow sections.',
    w:'Briklay\'s luxury interior door spec uses full teak frames rather than mixing materials. It is the same approach used in heritage bungalows and premium residences — every door frame is a statement in itself.',sp:['Solid teak door','Matching teak frame','Hafele / Dorma hardware','Grade-A Myanmar teak']}
  ]},
  {id:'ext-doors', label:'External / main entrance door', items:[
   {t:'std',b:'Standard',n:'Steel Security Door',br:'Dorset Steel Doors · Spider Steel · Ozone Overseas',
    d:'Single-skin or double-skin steel security door with multi-point locking system. Powder-coated finish. Dorset, Spider, and Ozone are the leading Indian steel door manufacturers with nationwide service. Fire-rated options available from Dorset.',
    w:'Briklay specifies steel security doors at standard grade because they offer the best protection-to-cost ratio at the main entrance. A teak door at this grade would compromise either the wood quality or the security hardware — steel avoids that trade-off.',sp:['Multi-point lock','Powder-coated','Fire-rated option','Dorset / Spider / Ozone']},
   {t:'pre',b:'Premium',n:'Teak Wood Panel Door + Granite Frame',br:'Myanmar Teak · Hafele / Dorma hardware',
    d:'Solid teak panel door (minimum 40mm thick) with a polished granite door frame. Hafele or Dorma 3-point locking system. Teak is naturally termite and rot resistant — a well-made teak door easily outlasts the building if maintained. Briklay supervises joinery fabrication to ensure correct thickness, gluing and seasoning.',
    w:'This is the most popular main door choice in Briklay projects. The combination of teak and granite is timeless, warm, and requires only light oiling once a year to maintain its appearance for decades.',sp:['40mm solid teak','Granite frame','Hafele 3-point lock','Annual oiling only']},
   {t:'lux',b:'Luxury',n:'Teak Door + Teak Frame + Pivot / Digital Lock',br:'Grade-A Myanmar Teak · Hafele Dialock / Dormakaba',
    d:'Oversized pivot-hung teak panel door with full teak frame and architrave. Digital smart lock (Hafele Dialock or Dormakaba) with fingerprint, PIN, and remote access. The pivot hinge creates a dramatic entrance statement impossible with conventional hung doors. Briklay works with specialist joinery fabricators for pivot door systems.',
    w:'Briklay recommends pivot doors for clients who want the entrance to make an immediate architectural impression. Combined with a smart lock, it is the most sophisticated and secure main door system available for residential use.',sp:['Pivot-hung teak','Full teak frame','Hafele Dialock / Dormakaba','Fingerprint + remote access']}
  ]},
  {id:'paint', label:'Paint & wall finish', items:[
   {t:'std',b:'Standard',n:'Asian Tractor Emulsion',br:'Asian Paints Tractor Emulsion · Berger Easy Clean',
    d:'Asian Tractor Emulsion is India\'s largest-selling interior paint for a reason — reliable coverage, washable, easy to touch up, and available in any colour. Briklay uses 2 coats over Birla White putty and primer.',
    w:'Briklay uses Tractor Emulsion in utility areas, service rooms, and secondary bedrooms. We do not recommend premium paint in areas where it adds no visible value.',sp:['Asian Paints / Berger','Washable','Easy touch-up','2 coats over putty']},
   {t:'pre',b:'Premium',n:'Asian Royale / Nippon Silk Glow',br:'Asian Paints Royale · Nippon Silk Glow · Berger Silk',
    d:'Asian Royale is tested to 10,000 scrub cycles — it can be wiped clean with a damp cloth without fading. Nippon Silk Glow adds a soft sheen that makes colours look richer and spaces feel warmer. Both have built-in anti-fungal protection. Briklay applies 2 topcoats over Birla White putty and Primer Sealer.',
    w:'Briklay specifies Premium paint in all living spaces, master bedrooms, and children\'s rooms. The cost difference over Standard is about ₹8,000–12,000 for an average home — the quality difference is felt every single day.',sp:['Asian Royale / Nippon Silk','10,000 scrub cycles','Anti-fungal','Soft sheen finish']},
   {t:'lux',b:'Luxury',n:'Dulux Velvet Touch + Venetian Plaster accent',br:'Dulux Velvet Touch (AkzoNobel) + Terraco Silkstone',
    d:'Dulux Velvet Touch produces a dead-matte suede-like finish that makes even imperfect walls look considered and deliberate. One Terraco Silkstone Venetian plaster accent wall per major room — hand-applied with a steel trowel in 3 coats, polished to a marble-like depth. Briklay works with trained Terraco-certified applicators only.',
    w:'Briklay recommends Venetian plaster selectively — one wall per room, not all walls. Overuse kills the effect. A single well-executed plaster wall is a feature that guests remember long after they leave.',sp:['Dulux Velvet Touch','Terraco Silkstone plaster','Certified applicator','One accent wall / room']}
  ]},
  {id:'ceiling', label:'Ceilings', items:[
   {t:'std',b:'Standard',n:'POP Skim + Cove Detail',br:'Birla White POP · JK White Cement POP',
    d:'Plaster of Paris skim coat (Birla White or JK) over RCC slab with a 4-inch cove border and central medallion. Briklay\'s POP teams are trained to achieve a glass-smooth finish — we do not accept uneven or wavy POP work.',
    w:'Briklay uses POP from Birla White or JK White only — not unbranded loose POP, which shrinks unevenly. Our standard ceiling includes LED-strip cove lighting as a built-in feature.',sp:['Birla White / JK POP','Glass-smooth finish','Cove detail','LED cove ready']},
   {t:'pre',b:'Premium',n:'Saint-Gobain Gypsum + POP Cove',br:'Saint-Gobain Gyproc · USG Boral · Hilux Gypsum',
    d:'Saint-Gobain Gyproc boards on GI channel framing for the flat ceiling field, with POP cove edges and perimeter detail. Consistent, flat finish without the cracking risk of direct POP on slab. Concealed lighting channels integrated into the design.',
    w:'Briklay uses Saint-Gobain Gyproc on all Premium ceiling projects. The flat, joint-free field that gypsum produces is something POP cannot reliably achieve — and once you\'ve seen it with concealed cove lighting, you don\'t want anything else.',sp:['Saint-Gobain Gyproc','GI channel framing','Flat joint-free field','Concealed LED cove']},
   {t:'lux',b:'Luxury',n:'Gypsum + POP + Teak / WPC Wood Slat',br:'Saint-Gobain Gyproc + Teak / Durawood WPC slats',
    d:'Saint-Gobain flat gypsum ceiling with POP cove lighting channel, plus linear wood slat accent panels over the dining table and master bedroom. Teak veneer or Durawood WPC slats on aluminium backing — both are moisture-resistant for Indian conditions.',
    w:'Briklay introduced wood slat ceilings into our projects after seeing the warmth they add to the dining room in particular. A well-designed slat ceiling makes the room feel intentionally designed from top to bottom.',sp:['Saint-Gobain Gyproc base','Teak / Durawood WPC slats','Moisture-resistant','Dining + master bedroom']}
  ]}
]},

{id:'mep', label:'MEP Systems', pg:'MEP', w:0.20,
 groups:[
  {id:'elec', label:'Electrical wiring & DB panel', items:[
   {t:'std',b:'Standard',n:'FR Wires + MCB Panel',br:'Finolex FR · Polycab FR + Havells DB · L&T DB',
    d:'Flame-retardant wires (Finolex or Polycab, both IS 694 certified) with a Havells or L&T MCB distribution board. Briklay specifies a minimum of 2.5 sqmm for all power sockets and 1.5 sqmm for lighting — undersized wiring is the most common shortcut we see on other sites.',
    w:'Briklay\'s standard wiring spec uses Finolex or Polycab FR — not unbranded wire. Electrical wiring is a 30-year decision. The cost difference between branded and unbranded wire over an entire home is typically under ₹15,000.',sp:['Finolex / Polycab FR','IS 694 certified','Havells / L&T DB','Correct gauges enforced']},
   {t:'pre',b:'Premium',n:'FR-LSH Wires + Legrand DB + RCCB',br:'Finolex FR-LSH · Polycab ZHFR + Legrand Lexic DB',
    d:'Low-smoke halogen-free wiring — if a cable overheats, it does not release toxic chlorine gas. Legrand Lexic DB with RCCB protection on all circuits. RCCB detects a 30mA earth leakage — enough to stop electrocution. Briklay\'s site engineers verify correct circuit segregation at the DB before handover.',
    w:'Briklay upgraded our standard specification to FR-LSH after researching residential fire investigations. The difference in smoke toxicity between FR and FR-LSH can mean the difference between safe evacuation and not. We think that matters.',sp:['Finolex FR-LSH / Polycab ZHFR','Legrand Lexic DB','RCCB on all circuits','30mA earth leakage protection']},
   {t:'lux',b:'Luxury',n:'ZHFR Wires + Hager / Schneider DB + RCBO',br:'Havells ZHFR + Hager Volta · Schneider Acti9',
    d:'Zero-halogen wiring (Havells ZHFR — the same grade specified in hospitals and airports). Hager Volta or Schneider Acti9 DB with individual RCBO protection per circuit. Smart-home bus wiring (KNX or Modbus) laid for future automation. Briklay designs the DB layout so every circuit is labelled and documented.',
    w:'Briklay specifies Hager or Schneider at luxury grade because their DIN-certified breakers have 20,000+ cycle ratings and documented trip curves. We hand over a complete circuit directory with every panel — something most contractors never provide.',sp:['Havells ZHFR','Hager Volta / Schneider Acti9','RCBO per circuit','Smart-home bus wiring']}
  ]},
  {id:'switches', label:'Switches & sockets', items:[
   {t:'std',b:'Standard',n:'Anchor Roma / Havells Coral',br:'Anchor by Panasonic · Havells Coral Plus',
    d:'Anchor Roma is Panasonic-owned and carries consistent quality. Havells Coral Plus has a good tactile click and is widely serviced. Both are IS 3854 certified. Briklay specifies USB-A charging outlets in all bedrooms at standard grade.',
    w:'Briklay adds USB charging outlets as standard in bedrooms — a small addition during build that is expensive and disruptive to retrofit later.',sp:['Anchor / Havells','IS 3854 certified','USB-A in bedrooms','Wide service network']},
   {t:'pre',b:'Premium',n:'Legrand Arteor / Schneider Livia',br:'Legrand Arteor · Schneider Livia · Schneider Ulti',
    d:'Legrand Arteor — the most-specified premium switch range by Indian architects. Available in white, graphite, and pearl aluminium plates. Schneider Livia offers an ultra-slim profile with the same European engineering. Both include USB-A + USB-C charging outlets. Briklay specifies 6-module plates for clean, uncluttered wall faces.',
    w:'Briklay recommends Legrand Arteor as our preferred Premium switch because its plate finishes hold up better than most alternatives over 10 years of daily use. You touch your switches 20 times a day — quality here is noticed every single time.',sp:['Legrand Arteor / Schneider Livia','USB-A + USB-C outlets','Aluminium plate finish','6-module clean layout']},
   {t:'lux',b:'Luxury',n:'Legrand Arteor + Schneider Wiser Smart Switches',br:'Legrand MyHome Play · Schneider Wiser · Clipsal C-Bus',
    d:'Legrand Arteor premium plates throughout, with Schneider Wiser or Legrand MyHome WiFi smart switches on all lighting, fan, and AC circuits. App control, voice control (Alexa, Google Home), energy monitoring, and scene-setting. Briklay programs standard scenes (Morning, Evening, Away) before handover.',
    w:'Briklay designs smart home layouts before wiring begins — not as an afterthought. We pre-configure scenes and commission the system before handover so clients walk in on day one with a working smart home.',sp:['Legrand Arteor plates','Schneider Wiser / MyHome','Alexa + Google Home','Pre-programmed scenes']}
  ]},
  {id:'plumbing', label:'Plumbing pipes & pump', items:[
   {t:'std',b:'Standard',n:'uPVC (cold) + CPVC (hot)',br:'Astral Pipes · Supreme Industries · Prince Pipes',
    d:'Astral CPVC and uPVC are IS 4985 and IS 15778 certified respectively. Astral and Supreme are India\'s two most quality-consistent pipe brands. Prince Pipes is the third option in markets where Astral has supply constraints. Briklay uses only solvent cement from the same manufacturer as the pipe — cross-brand mixing causes joint failures.',
    w:'Briklay uses matching brand solvent cement — not whatever the plumber brings. Mismatched cement is one of the most common causes of joint leaks that appear 2–3 years after completion.',sp:['Astral / Supreme / Prince','IS certified CPVC + uPVC','Matching brand cement','No GI pipes']},
   {t:'pre',b:'Premium',n:'CPVC Pro throughout + VFD Pump',br:'Astral CPVC Pro · Supreme CPVC + Kirloskar VFD · Grundfos CM',
    d:'Astral CPVC Pro (hot and cold throughout) with a Kirloskar or Grundfos VFD hydropneumatic pump set. VFD pump maintains constant 2.5 bar at every outlet simultaneously — no pressure variation when multiple taps are running.',
    w:'Briklay recommends constant-pressure systems on all homes with more than 2 bathrooms. The daily difference — full pressure at every tap, always — is noticed immediately. Kirloskar and Grundfos are the two brands whose pump sets Briklay has found consistently reliable over years of installations.',sp:['Astral CPVC Pro','Kirloskar / Grundfos VFD','Constant 2.5 bar','All floors served equally']},
   {t:'lux',b:'Luxury',n:'PPR Fusion Pipes + Grundfos VFD',br:'Georg Fischer PPR · Aquatherm PPR + Grundfos Hydro MPC',
    d:'Polypropylene Random (PPR) pipes from Georg Fischer (Switzerland) or Aquatherm. Joints are heat-fusion welded into a single monolithic pipe — no solvent cement, no mechanical joint, no possible leak point. Grundfos Hydro MPC multi-pump VFD system for G+3 and above.',
    w:'Briklay specifies PPR fusion pipes on luxury projects because the welded joint system eliminates the single most common plumbing failure mode entirely. Georg Fischer is the global industry standard — the same pipe system used in hospitals and pharmaceutical plants.',sp:['Georg Fischer / Aquatherm PPR','Fusion-welded joints','Zero leak points','Grundfos Hydro MPC']}
  ]},
  {id:'windows', label:'Windows & glazing', items:[
   {t:'std',b:'Standard',n:'uPVC Sliding — 3-chamber',br:'Encraft · Veka · Kommerling · Local uPVC fabricators',
    d:'3-chamber uPVC profile (60mm system) with clear float glass. Encraft and Veka profiles are extruded to DIN standards. Briklay specifies IS 14828-certified hardware — not the cheaper zinc alloy fittings that corrode within 2 years.',
    w:'Briklay has moved entirely away from MS window frames on all projects. No more rust, no more repainting, and significantly better thermal and acoustic performance — all at a comparable installed cost.',sp:['Encraft / Veka / Kommerling','60mm system','IS 14828 hardware','Zero maintenance']},
   {t:'pre',b:'Premium',n:'uPVC 5-chamber + Saint-Gobain Solar Glass',br:'Fenesta · Rehau · Veka 70mm + Saint-Gobain Cool-Lite',
    d:'Fenesta or Rehau 70mm 5-chamber uPVC profile with Saint-Gobain Cool-Lite ST or SKN solar control glass. Blocks up to 65% of solar heat while maintaining natural light transmission above 60%. Independently tested to reduce indoor temperature by 4–6°C.',
    w:'Briklay recommends solar control glass as standard on all west-facing and south-facing windows. In Indian summer conditions, it reduces AC load measurably — most clients report electricity savings that recover the glass premium within 2–3 years.',sp:['Fenesta / Rehau 70mm','Saint-Gobain Cool-Lite','65% solar heat block','4-6°C indoor temperature reduction']},
   {t:'lux',b:'Luxury',n:'Aluminium DGU — Schüco / Alumil',br:'Schüco Germany · Alumil Greece + Saint-Gobain SGG Climaplus',
    d:'Schüco AWS 75 or Alumil M9600 slim aluminium framing system with 28mm double-glazed unit (DGU) — Saint-Gobain SGG Climaplus or equivalent. DGU provides STC 38dB sound attenuation and U-value of 1.4 W/m²K. Slim 60mm sightlines give an architectural, frameless appearance.',
    w:'Briklay specifies Schüco and Alumil as our two approved luxury window systems. Both are manufactured to German and European standards, and both have local fabricators trained and certified by the parent company. We do not accept uncertified Schüco lookalikes.',sp:['Schüco / Alumil system','28mm DGU','STC 38dB acoustic','U-value 1.4 W/m²K']}
  ]}
]},

{id:'lift', label:'Lift / Elevator', pg:'Lift', w:0,
 liftCosts:{std:0, pre:350000, lux:900000},
 groups:[
  {id:'lift', label:'Elevator / lift system', items:[
   {t:'std',b:'Standard',n:'Staircase only',br:'Granite / Kota treads · MS powder-coat handrail · SS pickets',
    d:'Staircase with granite or Kota stone treads, MS handrail powder-coated in a matching colour, and optional SS picket balustrade. Briklay designs all staircases to IS 875 ergonomic proportions — 175mm riser, 275mm tread — which makes a staircase used 20 times a day noticeably more comfortable than one built to whatever fits.',
    w:'Briklay does not build staircases to suit the mason\'s convenience. Correct riser-tread proportions are specified and verified on every flight. It is a detail most builders ignore and every homeowner notices.',sp:['Granite / Kota treads','IS 875 proportions','Powder-coat handrail','No lift cost'],addCost:0},
   {t:'pre',b:'Premium',n:'Home Lift — vacuum / hydraulic (3-stop)',br:'Nibav Home Lifts · Cibes Lift India · Pneumatic Vacuum Elevator',
    d:'Nibav (air-driven, no shaft, no pit, no machine room — installs in 2 days) or Cibes A5 (scissor-lift in glass enclosure). Both are CE certified, 2-person, 200kg capacity. Briklay coordinates any structural reinforcement needed and manages the full installation as part of the project.',
    w:'Briklay recommends planning for a home lift from the design stage on any G+2 project with elderly family members. Retrofitting costs 3–4× more than installing during construction. Nibav and Cibes are the two brands Briklay has the most installation experience with.',sp:['Nibav / Cibes','No pit or machine room','CE certified','2-person 200kg'],addCost:350000},
   {t:'lux',b:'Luxury',n:'MRL Traction Lift — Otis / Kone / Thyssenkrupp',br:'Otis Gen2 · Kone Monospace · Thyssenkrupp Evolution',
    d:'Machine-Room-Less traction elevator from Otis, Kone, or Thyssenkrupp — the three global lift manufacturers. Silent, energy-regenerative, and available with custom cabin finishes. Otis Gen2 flat belt drive requires no lubrication for 20 years. All three brands have AMC programmes with guaranteed response times.',
    w:'Briklay specifies only these three brands at luxury grade. Each has local service infrastructure with AMC programmes — a lift that cannot be serviced within 4 hours of a call is not fit for a family home.',sp:['Otis / Kone / Thyssenkrupp','Energy-regenerative','Custom cabin finish','Guaranteed AMC service'],addCost:900000}
  ]}
]}
];
