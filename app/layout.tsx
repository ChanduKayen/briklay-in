import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({
  src: "./fonts/young-serif-latin-400.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-young",
});

const sans = localFont({
  src: "./fonts/archivo-latin-variable.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://briklay.in"),
  title: "Briklay | Home builders in Kakinada",
  description:
    "Briklay designs and builds custom homes in Kakinada. 700+ quality checks, a 10+ year warranty and site updates on your phone. From ₹2,000 per sq ft.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Briklay | Home builders in Kakinada",
    description:
      "Custom homes in Kakinada with 700+ quality checks and a 10+ year warranty. From ₹2,000 per sq ft.",
    url: "https://briklay.in",
    siteName: "Briklay",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
