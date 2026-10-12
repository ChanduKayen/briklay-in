"use client";

import { useEffect, useState } from "react";
import { PHONE_TEL, waLink } from "../_lib/contact";
import { WA_HELLO } from "./content";
import { PhoneIcon, WhatsAppIcon } from "./icons";

/**
 * WhatsApp and call, pinned to the bottom of the phone screen.
 * Stays away while the hero or the closing section is on screen,
 * since both already carry the same buttons.
 */
export default function StickyBar() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const talk = document.getElementById("talk");
    if (!hero || !talk) return;
    const seen = new Map<Element, boolean>([
      [hero, true],
      [talk, false],
    ]);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target, e.isIntersecting));
      setOn(!seen.get(hero) && !seen.get(talk));
    });
    io.observe(hero);
    io.observe(talk);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`bar${on ? " is-on" : ""}`} inert={!on}>
      <a className="btn btn-wa" href={waLink(WA_HELLO)} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon />
        Chat on WhatsApp
      </a>
      <a className="btn btn-line" href={`tel:${PHONE_TEL}`}>
        <PhoneIcon />
        Call
      </a>
    </div>
  );
}
