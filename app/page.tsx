import type { Viewport } from "next";
import { PHONE_TEL } from "./_lib/contact";
import HomeBehaviour from "./_home/home-behaviour";
import { MARKUP } from "./_home/markup";
import "./_home/home.css";

export const viewport: Viewport = { themeColor: "#f8f4ec" };

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
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..500,0..100,0..1&family=Inter:wght@300;400;500;600&display=swap"
        precedence="default"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BUSINESS) }} />
      <div className="pg" id="pg" dangerouslySetInnerHTML={{ __html: MARKUP }} />
      <HomeBehaviour />
    </>
  );
}
