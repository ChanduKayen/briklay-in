import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://briklay.in"),
  title: "Briklay | Building Trust. Constructing Lives.",
  description:
    "Briklay Engineering builds homes and apartments in Kakinada. New website coming soon.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
