import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";

import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Jost({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sarees & One-Gram Gold Jewellery Boutique",
    template: "%s | Vasthra Boutique",
  },
  description:
    "Handpicked sarees and one-gram gold jewellery for weddings, festivals and everyday elegance. Order easily on WhatsApp.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Vasthra Boutique",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
