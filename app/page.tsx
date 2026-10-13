import type { Viewport } from "next";
import { PHONE_TEL } from "./_lib/contact";
import HomeBehaviour from "./_home/home-behaviour";
import { MARKUP } from "./_home/markup";
import "./_home/home.css";

export const viewport: Viewport = { themeColor: "#0e3b3c" };

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

export default function Home() {
  return (
    <>
      <link rel="preload" as="font" type="font/woff2" href="/fonts/geist-latin.woff2" crossOrigin="anonymous" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BUSINESS) }} />
      <div className="pg" id="pg" dangerouslySetInnerHTML={{ __html: MARKUP }} />
      <HomeBehaviour />
    </>
  );
}
