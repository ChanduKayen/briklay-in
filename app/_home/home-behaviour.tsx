"use client";

import { useEffect } from "react";
import { startHome } from "./behaviour";

/** Starts the home page's behaviour once the markup is on screen. Renders nothing. */
export default function HomeBehaviour() {
  useEffect(() => {
    startHome();
  }, []);
  return null;
}
