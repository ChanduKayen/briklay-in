import Link from "next/link";
import { PHONE_DISPLAY, PHONE_TEL, waLink } from "./_lib/contact";
import {
  COMPARE,
  FAQS,
  PRICE_FROM,
  PROOF,
  STAGES,
  STEPS,
  WA_CHECKLIST,
  WA_HELLO,
  WA_INTERIORS,
  WA_PRIDE,
} from "./_home/content";
import HeroDrawing from "./_home/hero-drawing";
import { ArchMark, Cross, PhoneIcon, Tick, WhatsAppIcon } from "./_home/icons";
import QuickEstimate from "./_home/quick-estimate";
import StickyBar from "./_home/sticky-bar";
import "./_home/home.css";

const BUSINESS = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: "Briklay Engineering",
  url: "https://briklay.in",
  telephone: PHONE_TEL,
  slogan: "Building Trust. Constructing Lives.",
  areaServed: "Kakinada, Andhra Pradesh",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kakinada",
    addressRegion: "Andhra Pradesh",
    addressCountry: "IN",
  },
};

function WhatsAppButton({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <a className="btn btn-wa" href={waLink(text)} target="_blank" rel="noopener noreferrer">
      <WhatsAppIcon />
      {children}
    </a>
  );
}

function Yes() {
  return (
    <span className="mark mark-yes">
      <Tick />
    </span>
  );
}

function No() {
  return (
    <span className="mark mark-no">
      <Cross />
    </span>
  );
}

export default function Home() {
  return (
    <div className="home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BUSINESS) }} />

      <header className="hdr">
        <div className="wrap">
          <Link className="brand" href="/" aria-label="Briklay, home">
            <ArchMark />
            Briklay
          </Link>
          <Link className="hdr-link" href="/costestimator">
            Cost estimator
          </Link>
        </div>
      </header>

      <main>
        {/* ── hero ── */}
        <section className="hero band-teal" id="top">
          <div className="wrap">
            <div className="hero-copy">
              <h1>Build your home with nothing hidden.</h1>
              <p className="hero-sub">
                Briklay designs and builds custom homes in Kakinada, with 700+ quality checks, a 10+
                year warranty and site updates on your phone. <strong>From {PRICE_FROM} per sq ft*</strong>
              </p>
              <div className="hero-cta">
                <WhatsAppButton text={WA_HELLO}>Chat on WhatsApp</WhatsAppButton>
                <a className="btn btn-line" href="#cost">
                  Estimate my cost
                </a>
              </div>
            </div>
            <div className="hero-art">
              <HeroDrawing />
            </div>
            <ul className="proof">
              {PROOF.map((p) => (
                <li key={p.label}>
                  <strong>{p.value}</strong>
                  <span>{p.label}</span>
                </li>
              ))}
            </ul>
            <p className="hero-fine">
              *Starting rate with standard materials. Your rate depends on the plot, the plan and the
              materials you choose.
            </p>
          </div>
        </section>

        {/* ── cost ── */}
        <section className="sec band-cream" id="cost">
          <div className="wrap">
            <div className="sec-head">
              <h2>What will your home cost?</h2>
              <p>Pick your plot size and the number of floors. The figure changes as you do.</p>
            </div>
            <QuickEstimate />
          </div>
        </section>

        {/* ── quotes ── */}
        <section className="sec sec-tight band-cream" id="quotes">
          <div className="wrap">
            <div className="sec-head">
              <h2>What a low rate per sq ft leaves out</h2>
              <p>
                Two quotes can show the same rate and build two very different homes. Ask any
                builder these questions, us included.
              </p>
            </div>
            <div className="cmp-key">
              <span>
                <No /> What often happens
              </span>
              <span>
                <Yes /> What Briklay does
              </span>
            </div>
            <div className="cmp">
              <div className="cmp-row cmp-head" aria-hidden="true">
                <span />
                <span>What often happens</span>
                <span>What Briklay does</span>
              </div>
              {COMPARE.map((row) => (
                <div className="cmp-row" key={row.topic}>
                  <h3 className="cmp-topic">{row.topic}</h3>
                  <div className="cmp-cell cmp-often">
                    <No />
                    <p>{row.often}</p>
                  </div>
                  <div className="cmp-cell cmp-us">
                    <Yes />
                    <p>{row.briklay}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── checks ── */}
        <section className="sec band-teal" id="checks">
          <div className="wrap">
            <div className="sec-head">
              <h2>700+ checks before we call it built</h2>
              <p>Here are a few of them, in the order your home goes up.</p>
            </div>
            <ol className="stages">
              {STAGES.map((stage) => (
                <li className="stage" key={stage.name}>
                  <h3>{stage.name}</h3>
                  <ul>
                    {stage.checks.map((c) => (
                      <li key={c}>
                        <Tick className="tick" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <div className="checks-more">
              <p>The full list runs to more than 700 lines. Ask for it and read it before you decide.</p>
              <div className="hero-cta" style={{ marginTop: 0 }}>
                <WhatsAppButton text={WA_CHECKLIST}>Get the full checklist on WhatsApp</WhatsAppButton>
              </div>
            </div>
          </div>
        </section>

        {/* ── on your phone ── */}
        <section className="sec band-deep" id="updates">
          <div className="wrap onphone">
            <div>
              <div className="sec-head" style={{ marginBottom: 0 }}>
                <h2>Your site, on your phone</h2>
                <p>
                  You should not have to drive to the site to know what happened today. The work,
                  the photos and the checks come to you.
                </p>
              </div>
              <ul className="onphone-points">
                <li>
                  <Tick className="tick" />
                  <span>What was done today, and what comes next</span>
                </li>
                <li>
                  <Tick className="tick" />
                  <span>Photos from the site</span>
                </li>
                <li>
                  <Tick className="tick" />
                  <span>Which checks were passed, stage by stage</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="phone" aria-hidden="true">
                <div className="phone-screen">
                  <p className="ph-day">Today</p>
                  <p className="ph-title">First floor slab</p>
                  <div className="ph-block">
                    <h4>Steel checked before the pour</h4>
                    <ul className="ph-checks">
                      {["Bar size and spacing", "Cover blocks in place", "Lap lengths"].map((c) => (
                        <li key={c}>
                          <Yes />
                          {c}
                        </li>
                      ))}
                    </ul>
                    <p className="ph-count">18 of 18 checks passed</p>
                    <div className="xbox ph-photo">
                      <span>Site photo</span>
                    </div>
                  </div>
                  <div className="ph-block">
                    <h4>Tomorrow</h4>
                    <p>Slab concrete at 7 am. Cube samples will be taken.</p>
                  </div>
                  <div className="ph-block">
                    <h4>Stage 4 of 9</h4>
                    <div className="ph-progress">
                      <i />
                    </div>
                  </div>
                </div>
              </div>
              <p className="phone-cap">An example of a day&apos;s update.</p>
            </div>
          </div>
        </section>

        {/* ── how it works ── */}
        <section className="sec band-cream" id="how">
          <div className="wrap">
            <div className="sec-head">
              <h2>How building with us works</h2>
            </div>
            <ol className="steps">
              {STEPS.map((s) => (
                <li key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── homes ── */}
        <section className="sec sec-tight band-cream" id="homes">
          <div className="wrap">
            <div className="sec-head">
              <h2>Homes we have built</h2>
            </div>
            <ul className="gal">
              {[1, 2, 3, 4].map((i) => (
                <li key={i}>
                  <div className="xbox">
                    <span>Photo to be added</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── questions ── */}
        <section className="sec sec-tight band-cream" id="questions">
          <div className="wrap faq-grid">
            <div className="sec-head">
              <h2>Questions people ask us</h2>
            </div>
            <div className="faq">
              {FAQS.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── talk ── */}
        <section className="sec band-teal talk" id="talk">
          <ArchMark className="talk-mark" />
          <div className="wrap">
            <h2>Have a plot? Tell us about it.</h2>
            <p>
              Send us the size and where it is. We will tell you what it takes to build on it, and
              what it is likely to cost.
            </p>
            <div className="talk-cta">
              <WhatsAppButton text={WA_HELLO}>Chat on WhatsApp</WhatsAppButton>
              <a className="btn btn-line" href={`tel:${PHONE_TEL}`}>
                <PhoneIcon />
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="ftr band-deep">
        <div className="wrap">
          <div className="brand">
            <ArchMark />
            Briklay
          </div>
          <p className="ftr-tag">Building Trust. Constructing Lives.</p>
          <nav className="ftr-links" aria-label="More from Briklay">
            <Link href="/costestimator">
              Cost estimator <small>Choose materials, see the cost</small>
            </Link>
            <a href={waLink(WA_PRIDE)} target="_blank" rel="noopener noreferrer">
              Flats at The Pride <small>3 BHK, ready to move, Vaidya Nagar</small>
            </a>
            <a href={waLink(WA_INTERIORS)} target="_blank" rel="noopener noreferrer">
              Interiors <small>By Zyrio Studio</small>
            </a>
            <a href="https://briklay.app" target="_blank" rel="noopener noreferrer">
              For builders <small>Site software at briklay.app</small>
            </a>
          </nav>
          <p className="ftr-legal">Briklay Engineering, Kakinada, Andhra Pradesh.</p>
        </div>
      </footer>

      <StickyBar />
    </div>
  );
}
