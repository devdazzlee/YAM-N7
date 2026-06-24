import type { Metadata } from "next";
import { Poppins, Cormorant_Garamond, Playfair_Display } from "next/font/google";
import "./globals.css";
import CartToast from "./components/CartToast";
import PageTransition from "./components/PageTransition";
import AnnouncementBar from "./components/AnnouncementBar";
import BrandPreloader from "./components/BrandPreloader";
import CustomCursor from "./components/CustomCursor";
import GoldParticles from "./components/GoldParticles";
import GlobalScrollReveal from "./components/GlobalScrollReveal";

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "YAM-N7 — Luxury Perfumes, Attars & Fragrances",
  description:
    "Discover curated luxury perfumes, rare attars, and exclusive oud blends. YAM-N7 — twenty-five years of fragrance excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${cormorant.variable} ${playfair.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <CustomCursor />
        <GoldParticles />
        <GlobalScrollReveal />
        <BrandPreloader />
        <AnnouncementBar />
        <PageTransition />
        {children}
        <CartToast />
      </body>
    </html>
  );
}

