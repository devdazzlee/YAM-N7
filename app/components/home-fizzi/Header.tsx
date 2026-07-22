'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Logo } from './Logo';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'Identity Series', href: '/identity-series' },
  { label: 'Best Sellers', href: '/best-sellers' },
  { label: "What's Hot", href: '/whats-hot' },
  { label: 'Journal', href: '/journal' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [open, setOpen] = useState(false);

  return (
    <header
      className={clsx(
        'relative z-[110] flex items-center justify-between px-4 py-4 md:px-8',
        isHome ? '-mb-28' : 'bg-yellow-300',
      )}
    >
      <Link href="/" className="z-10" onClick={() => setOpen(false)}>
        <Logo className="h-14 cursor-pointer text-sky-800 md:h-20" />
      </Link>

      <nav className="hidden items-center gap-4 lg:gap-6 md:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm lg:text-base font-bold uppercase tracking-wide text-sky-950 transition-colors hover:text-orange-600"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className="z-10 flex flex-col gap-1.5 md:hidden"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span
          className={clsx('h-0.5 w-7 bg-sky-950 transition-transform', open && 'translate-y-2 rotate-45')}
        />
        <span className={clsx('h-0.5 w-7 bg-sky-950 transition-opacity', open && 'opacity-0')} />
        <span
          className={clsx(
            'h-0.5 w-7 bg-sky-950 transition-transform',
            open && '-translate-y-2 -rotate-45',
          )}
        />
      </button>

      {open && (
        <nav className="absolute left-0 right-0 top-full flex flex-col items-center gap-6 bg-yellow-300 py-8 shadow-lg md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-2xl font-bold uppercase tracking-wide text-sky-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
