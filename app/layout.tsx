import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import CartToast from "./components/CartToast";
import PageTransition from "./components/PageTransition";

const dmSans = DM_Sans({
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
        className={`${dmSans.variable} ${cormorant.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <PageTransition />
        {children}
        <CartToast />
      </body>
    </html>
  );
}
