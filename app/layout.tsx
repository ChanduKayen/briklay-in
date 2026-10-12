import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://briklay.in"),
  title: "Briklay | Home builders in Kakinada",
  description:
    "Briklay designs and builds homes in Kakinada. Every material is named and every stage is checked: 700+ quality checks, a 10+ year warranty, from ₹2,000 per sq ft.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Briklay | Your home, built right",
    description:
      "Homes in Kakinada with 700+ quality checks and a 10+ year warranty. From ₹2,000 per sq ft.",
    url: "https://briklay.in",
    siteName: "Briklay",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
