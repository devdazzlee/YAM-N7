import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CartToast from "./components/CartToast";
import PageTransition from "./components/PageTransition";
import AnnouncementBar from "./components/AnnouncementBar";
import CustomCursor from "./components/CustomCursor";
import GlobalScrollReveal from "./components/GlobalScrollReveal";
import RouteThemeFlag from "./components/RouteThemeFlag";

/* Same font family as the home (Fizzi) page — applied site-wide */
const alpino = localFont({
  src: [
    {
      path: "../public/fonts/Alpino-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-alpino",
  display: "swap",
});

export const metadata: Metadata = {
  title: "YAM-N7 - Luxury Perfumes, Attars & Fragrances",
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
        className={`${alpino.variable} ${alpino.className} antialiased`}
        suppressHydrationWarning
      >
        <RouteThemeFlag />
        <CustomCursor />
        <GlobalScrollReveal />
        <AnnouncementBar />
        <PageTransition />
        {children}
        <CartToast />
      </body>
    </html>
  );
}
