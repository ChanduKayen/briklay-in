import type { Metadata, Viewport } from "next";
import Estimator from "./estimator";
import "./estimator.css";

export const metadata: Metadata = {
  title: "Home Construction Cost Estimator | Briklay",
  description:
    "Enter your plot size, choose your materials and see a live construction cost estimate for your home in Kakinada, from Briklay Engineering.",
  alternates: { canonical: "/costestimator" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1A1714",
};

export default function CostEstimatorPage() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* Fonts are only used by this route for now. */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
      />
      <Estimator />
    </>
  );
}
