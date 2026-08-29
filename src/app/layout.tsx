import type { Metadata } from "next";
import {
  Fraunces,
  Playfair_Display,
  Cormorant_Garamond,
  Inter,
  Manrope,
} from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { StructuredData } from "@/components/StructuredData";
import { ThemeLab } from "@/components/ThemeLab";

// Display/heading serif candidates, all loaded so ThemeLab can preview any
// of them instantly — remove the two unused ones once a font is finalized.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Body/sans candidates.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

// Set NEXT_PUBLIC_SITE_URL once the site has a real domain — see .env.example.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const title = "La Praia — Ristorante Pizzeria, Bologna";
const description =
  "Pizza e cucina di mare ispirata alla Costiera Amalfitana, nel cuore di Bologna. Pizza and Amalfi Coast–inspired seafood in the heart of Bologna.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "La Praia",
    locale: "it_IT",
    alternateLocale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${fraunces.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} ${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-sand text-ink">
        <StructuredData />
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileActionBar />
        </LanguageProvider>
        <ThemeLab />
      </body>
    </html>
  );
}
