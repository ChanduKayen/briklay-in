// All the words on the home page that are likely to change live here.

export const PRICE_FROM = "₹2,000";

export const WA_HELLO =
  "Hi Briklay, I am planning to build a home in Kakinada and would like to talk.";

export const WA_CHECKLIST =
  "Hi Briklay, please send me your full quality checklist for home construction.";

export const WA_PRIDE =
  "Hi Briklay, I would like details of the flats at Bhaskar's The Pride, Vaidya Nagar.";

export const WA_INTERIORS = "Hi, I would like to talk about interiors for my home.";

export const PROOF = [
  { value: "200,000+", label: "sq ft built" },
  { value: "700+", label: "quality checks" },
  { value: "10+ years", label: "warranty" },
];

/** What a low rate per sq ft tends to leave open, against what Briklay puts in writing. */
export const COMPARE = [
  {
    topic: "Materials",
    often: "A rate per sq ft, and nothing else. Brands get decided later, at site.",
    briklay: "Every material is named by brand and grade before you sign.",
  },
  {
    topic: "Concrete",
    often: "Mixed by eye and never tested.",
    briklay: "Cubes are cast from every pour and tested at 7 and 28 days.",
  },
  {
    topic: "Steel",
    often: "Whatever the supplier has that week.",
    briklay: "Fe 500D is the minimum we build with, on every home.",
  },
  {
    topic: "Checking",
    often: "The mason checks his own work.",
    briklay: "700+ checks through the build, recorded stage by stage.",
  },
  {
    topic: "Changes",
    often: "Extras turn up in the final bill.",
    briklay: "A change is priced and agreed in writing before the work is done.",
  },
  {
    topic: "After handover",
    often: "A spoken promise.",
    briklay: "A warranty of 10 years and more.",
  },
];

/** A sample of the checks, in the order a home is built. */
export const STAGES = [
  {
    name: "Foundation",
    checks: [
      "Footing size and depth measured against the drawing before concrete",
      "Steel diameter, spacing and cover checked before every pour",
      "Anti-termite treatment done before the plinth is filled",
    ],
  },
  {
    name: "Structure",
    checks: [
      "Concrete cubes cast from every pour, tested at 7 and 28 days",
      "Slab level and thickness checked before the pour begins",
      "Curing logged every day until it is complete",
    ],
  },
  {
    name: "Walls",
    checks: [
      "Bricks tested for water absorption, batch by batch",
      "Every wall checked for plumb and line",
      "Lintels and sills checked at each opening",
    ],
  },
  {
    name: "Waterproofing",
    checks: [
      "Terraces and bathrooms flooded for a ponding test before tiling",
      "Slopes to every drain checked with water, not by eye",
    ],
  },
  {
    name: "Electrical and plumbing",
    checks: [
      "Water lines pressure-tested before the walls are closed",
      "Wire size matched to the load on every circuit",
      "Earthing tested and recorded",
    ],
  },
  {
    name: "Finishes",
    checks: [
      "Tiles tapped for hollow spots before grouting",
      "Stair risers and treads measured on every flight",
      "Doors and windows checked for swing, gaps and locks",
    ],
  },
];

export const STEPS = [
  {
    title: "Tell us about your plot",
    text: "Size, location and what you want to build. We come back with a first cost range.",
  },
  {
    title: "Design and agreement",
    text: "Plans, materials by brand and a stage-by-stage payment schedule, all in writing.",
  },
  {
    title: "We build, you watch",
    text: "Our engineers run the site. Checks and photos reach your phone as the work moves.",
  },
  {
    title: "Handover and warranty",
    text: "A final walk-through with you, then the keys and your warranty papers.",
  },
];

export const FAQS = [
  {
    q: "What does the price depend on?",
    a: "Mostly on how much you build and what you build it with: plot size, number of floors, how parking is handled, and the grade of materials you choose. The cost estimator shows how each choice moves the total.",
  },
  {
    q: "What kind of homes do you build?",
    a: "Independent houses from a single ground floor up to G+4, and apartment buildings on stilts. Each one is designed for its plot.",
  },
  {
    q: "Can I choose my own materials and brands?",
    a: "Yes. Every item, from cement and steel to tiles and switches, comes in three grades with named brands. Upgrade only what matters to you.",
  },
  {
    q: "How do payments work?",
    a: "Payments are split into stages of the build and written into the agreement before work starts.",
  },
  {
    q: "Do you build outside Kakinada?",
    a: "Our sites are in and around Kakinada. If your plot is in a nearby town, message us and we will tell you plainly whether we can take it on.",
  },
  {
    q: "Do you also do interiors?",
    a: "Yes, through Zyrio Studio, our interior and architectural design studio. Ask us about it when we talk.",
  },
];
