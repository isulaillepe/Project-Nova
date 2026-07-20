import type { Metadata, Viewport } from "next";
import { Poppins, Space_Grotesk, Cormorant_Garamond, Cinzel, Orbitron } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConstellationCanvas } from "@/components/fx/ConstellationCanvas";
import { SystemPreloader } from "@/components/fx/SystemPreloader";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Cinzel — the inscription-style display serif carrying the Olympus identity
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://projectnova.lk"),
  title: "Project Nova - Innovation Meets Opportunity",
  description: "Sri Lanka's premier inter-university tech innovation competition. LKR 255,000 prize pool. Organized by AIESEC in University of Sri Jayewardenepura.",
  keywords: ["Project Nova", "AIESEC", "Sri Jayewardenepura", "tech competition", "student innovation", "youth leadership", "Sri Lanka tech event", "startup competition", "hackathon"],
  authors: [{ name: "AIESEC in University of Sri Jayewardenepura" }],
  creator: "AIESEC in University of Sri Jayewardenepura",
  publisher: "Project Nova",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://projectnova.lk",
    title: "Project Nova - Innovation Meets Opportunity",
    description: "Sri Lanka's premier inter-university tech innovation competition connecting passionate young minds with forward-thinking organizations.",
    siteName: "Project Nova",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Project Nova - AIESEC in University of Sri Jayewardenepura",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Nova - Innovation Meets Opportunity",
    description: "Sri Lanka's premier inter-university tech innovation competition connecting passionate young minds with forward-thinking organizations.",
    images: ["/og-image.png"],
    creator: "@aiesec_usj",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${spaceGrotesk.variable} ${cormorantGaramond.variable} ${cinzel.variable} ${orbitron.variable} min-h-screen antialiased`}>
      <body className="relative min-h-screen flex flex-col bg-[var(--nova-deep)] text-[var(--nova-linen)]">
        {/* Cinematic Olympus night sky — drifting golden constellations */}
        <ConstellationCanvas />
        {/* Boot sequence — establishing the divine link */}
        <SystemPreloader />
        <Header />
        <main className="relative z-[1] flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}