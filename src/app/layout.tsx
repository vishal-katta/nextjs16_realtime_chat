import type { Metadata } from "next";
import {
  JetBrains_Mono,
  Architects_Daughter,
  DM_Sans,
  Space_Mono,
  Oxanium,
  Source_Code_Pro,
  Merriweather,
  Source_Serif_4,
  Outfit,
  Libre_Baskerville,
  Lora,
  IBM_Plex_Mono,
  Open_Sans,
  Antic,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";
import { Providers } from "@/context/providers";

// =======================
// GOOGLE FONT REGISTRY
// =======================

// handwriting / notebook
const architectsDaughter = Architects_Daughter({
  variable: "--font-architects-daughter",
  weight: "400",
  subsets: ["latin"],
});

// ui sans
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

// monospace themes
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

// serif themes
const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

// sans-serif themes
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const antic = Antic({
  variable: "--font-antic",
  weight: "400",
  subsets: ["latin"],
});

// monospace alternates
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

// already used in many themes
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// Next.js provides Geist Mono through Google Fonts
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// =======================

export const metadata: Metadata = {
  title: "Realtime Chat",
  description: "Realtime Chat with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={[
          jetbrainsMono.variable,
          architectsDaughter.variable,
          dmSans.variable,
          spaceMono.variable,
          oxanium.variable,
          sourceCodePro.variable,
          merriweather.variable,
          sourceSerif.variable,
          outfit.variable,
          libreBaskerville.variable,
          lora.variable,
          ibmPlexMono.variable,
          openSans.variable,
          antic.variable,
          geistMono.variable,
          "antialiased",
        ].join(" ")}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
