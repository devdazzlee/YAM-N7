'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Phone, Mail } from 'lucide-react';
import { useWebCategoryStore } from '../../lib/store/webCategoryStore';
import { WebCategory } from '../../lib/api/webApi';
import { CONTACT } from '../../config/storeInfo';

export default function Footer() {
  const fetchAll = useWebCategoryStore((s) => s.fetchAll);
  const [categories, setCategories] = useState<WebCategory[]>([]);

  // Pulls from the shared store; if Header already fetched it, this is a no-op.
  useEffect(() => {
    let cancelled = false;
    fetchAll()
      .then((all) => {
        if (!cancelled) setCategories(all.filter((c) => c.is_active).slice(0, 8));
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchAll]);

  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">

        {/* Top: Logo + Description + Social */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 sm:gap-8 mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-white/10">
          <div className="max-w-lg">
            <img
              src="/YAM-N7-Logo.png"
              alt="YAM-N7"
              className="h-16 sm:h-20 w-auto max-w-[220px] object-contain mb-3"
              width={220}
              height={80}
            />
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3">
              Your destination for premium perfumes, attars, and luxury fragrances. Crafted with elegance since 2000.
            </p>
            <div className="flex items-center gap-4">
              <a href={`tel:${CONTACT.phoneTel}`} className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                <Phone className="w-3.5 h-3.5" />
                <span>{CONTACT.phoneDisplay}</span>
              </a>
              <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                <Mail className="w-3.5 h-3.5" />
                <span>{CONTACT.email}</span>
              </a>
            </div>
          </div>
          {/* Social Icons */}
          <div className="flex items-center gap-2.5">
            <span className="text-gray-500 text-xs mr-1 hidden sm:inline">Follow us</span>
            <a
              href="https://www.facebook.com/yamn7/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#C5A059] transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/yamn7official/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#C5A059] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Links: 3 columns on mobile (compact), 4 columns on lg with contact */}
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Shop - Dynamic from API */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-2 sm:mb-3">Shop</h3>
            <ul className="space-y-1 sm:space-y-1.5">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/categories/${cat.slug}`} className="text-gray-400 hover:text-[#F5EDD8] transition-colors text-[11px] sm:text-sm">
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link href="/shop" className="text-gray-400 hover:text-[#F5EDD8] transition-colors text-[11px] sm:text-sm">
                    All Products
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-2 sm:mb-3">Info</h3>
            <ul className="space-y-1 sm:space-y-1.5">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Shipping', href: '/shipping-returns' },
                { name: 'Privacy', href: '/privacy-policy' },
                { name: 'Terms', href: '/terms-conditions' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#F5EDD8] transition-colors text-[11px] sm:text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-2 sm:mb-3">Account</h3>
            <ul className="space-y-1 sm:space-y-1.5">
              {[
                { name: 'My Account', href: '/login' },
                { name: 'Orders', href: '/orders' },
                { name: 'Returns', href: '/shipping-returns' },
                { name: 'Support', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#F5EDD8] transition-colors text-[11px] sm:text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — desktop only full column */}
          <div className="hidden lg:block">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Contact Us</h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                <a href={`tel:${CONTACT.phoneTel}`} className="text-gray-400 hover:text-[#F5EDD8] transition-colors text-sm">
                  {CONTACT.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="text-gray-400 hover:text-[#F5EDD8] transition-colors text-sm">
                  {CONTACT.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only contact row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 lg:hidden text-[11px] sm:text-xs text-gray-400">
          <a href={`tel:${CONTACT.phoneTel}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
            {CONTACT.phoneDisplay}
          </a>
          <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
            {CONTACT.email}
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
            <p className="text-gray-500 text-[10px] sm:text-xs">
              © {new Date().getFullYear()} YAM-N7 Perfumes. All rights reserved.
            </p>
            <div className="flex gap-4 text-[10px] sm:text-xs text-gray-500">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms-conditions" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
