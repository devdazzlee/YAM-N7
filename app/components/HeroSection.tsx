'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#1A1A1A]">
      <Link href="/shop" className="block w-full" aria-label="Shop YAM-N7 collection">
        <img
          src="/banners/New-Banner.jpg"
          alt="YAM-N7 - Luxury Perfumes & Fragrances Since 2000."
          className="w-full h-auto block object-cover"
        />
      </Link>
    </section>
  );
}
