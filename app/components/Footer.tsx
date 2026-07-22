'use client';

import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.52-4.06-1.39-.79-.57-1.43-1.35-1.85-2.24-.04 2.82.02 5.64-.02 8.46-.1 1.74-.76 3.48-1.99 4.7-1.39 1.4-3.46 2.14-5.41 1.99-2.35-.14-4.64-1.49-5.78-3.56-1.36-2.4-.97-5.69 1.03-7.66 1.41-1.43 3.52-2.15 5.51-1.92v4.07c-1.07-.15-2.22.25-2.86 1.13-.77.99-.7 2.49.2 3.39.87.89 2.37.93 3.25.08.57-.52.88-1.28.87-2.06-.02-4.14-.01-8.28-.02-12.42z" />
  </svg>
);

const NAV_LINKS = [
  { name: 'Shop', href: '/shop' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Shipping', href: '/shipping-returns' },
];

const SOCIALS = [
  { href: 'https://instagram.com/yamn7', icon: Instagram, label: 'Instagram' },
  { href: 'https://facebook.com/yamn7', icon: Facebook, label: 'Facebook' },
  { href: 'https://tiktok.com', icon: TikTokIcon, label: 'TikTok' },
];

export default function Footer() {
  /* Warm charcoal — grounds the yellow page, avoids cool navy / flat white / brand yellow */
  return (
    <footer
      className="relative z-10"
      style={{ background: '#1C1917', color: '#F5F0E8' }}
    >
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-14">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div className="max-w-xs">
            <Link href="/" className="inline-block">
              <img
                src="/YAM-N7-Logo.png"
                alt="YAM-N7"
                className="mx-auto h-10 w-auto object-contain md:mx-0 brightness-0 invert"
              />
            </Link>
            <p className="mt-3 text-sm italic tracking-wide" style={{ color: '#EA580C' }}>
              Minimal Outside. Infinite Within.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-end">
              {NAV_LINKS.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors hover:text-[#EA580C]"
                    style={{ color: 'rgba(245,240,232,0.7)' }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {SOCIALS.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:border-[#EA580C] hover:text-[#EA580C]"
                style={{
                  border: '1px solid rgba(245,240,232,0.2)',
                  color: 'rgba(245,240,232,0.7)',
                }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div
          className="mt-10 flex flex-col items-center justify-between gap-3 pt-6 text-xs md:flex-row"
          style={{ borderTop: '1px solid rgba(245,240,232,0.12)', color: 'rgba(245,240,232,0.45)' }}
        >
          <span>© {new Date().getFullYear()} YAM-N7. All Rights Reserved.</span>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="transition-colors hover:text-[#EA580C]">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="transition-colors hover:text-[#EA580C]">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
