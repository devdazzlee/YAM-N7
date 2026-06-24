'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Facebook, Instagram, ShieldCheck, Award, Truck, Mail, ArrowRight,
} from 'lucide-react';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.52-4.06-1.39-.79-.57-1.43-1.35-1.85-2.24-.04 2.82.02 5.64-.02 8.46-.1 1.74-.76 3.48-1.99 4.7-1.39 1.4-3.46 2.14-5.41 1.99-2.35-.14-4.64-1.49-5.78-3.56-1.36-2.4-.97-5.69 1.03-7.66 1.41-1.43 3.52-2.15 5.51-1.92v4.07c-1.07-.15-2.22.25-2.86 1.13-.77.99-.7 2.49.2 3.39.87.89 2.37.93 3.25.08.57-.52.88-1.28.87-2.06-.02-4.14-.01-8.28-.02-12.42z" />
  </svg>
);

const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.22 2.62 7.82 6.33 9.27-.1-.79-.2-2 .04-2.86.22-.77 1.4-5.96 1.4-5.96s-.36-.72-.36-1.78c0-1.66.96-2.9 2.16-2.9 1.02 0 1.51.77 1.51 1.68 0 1.03-.65 2.56-.99 3.98-.28 1.19.6 2.16 1.77 2.16 2.13 0 3.77-2.25 3.77-5.49 0-2.87-2.06-4.88-5.01-4.88-3.41 0-5.42 2.56-5.42 5.21 0 1.03.4 2.14.9 2.75.1.12.11.23.08.35-.09.37-.29 1.18-.33 1.34-.05.21-.17.26-.39.16-1.46-.68-2.37-2.82-2.37-4.54 0-3.69 2.68-7.09 7.74-7.09 4.06 0 7.22 2.89 7.22 6.77 0 4.04-2.54 7.29-6.07 7.29-1.19 0-2.3-.62-2.68-1.34l-.73 2.79c-.26 1.01-.98 2.28-1.46 3.07C10.74 21.84 11.36 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubmitted] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <footer
      style={{
        background: '#0A0A0A',
        color: '#FFFFFF',
        borderTop: '1px solid rgba(200, 164, 107, 0.2)',
        padding: '100px 24px 40px',
        position: 'relative',
        zIndex: 10,
        fontFamily: 'var(--font-body), Poppins, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* TOP ROW: Logo & Tagline AND Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{
            paddingBottom: '60px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
          className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-10"
        >
          {/* Logo & Tagline */}
          <div style={{ maxWidth: '420px' }}>
            <Link href="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
              <img
                src="/YAM-N7-Logo.png"
                alt="YAM-N7"
                style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
              />
            </Link>
            <p
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", serif',
                fontSize: '15px',
                fontStyle: 'italic',
                letterSpacing: '0.08em',
                color: '#C8A46B',
                margin: 0,
              }}
            >
              Minimal Outside. Infinite Within.
            </p>
          </div>

          {/* Newsletter Signup */}
          <div style={{ maxWidth: '480px', width: '100%' }}>
            <h4
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", serif',
                fontSize: '16px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                margin: '0 0 12px',
                fontWeight: 500,
              }}
            >
              Sign Up For Insights
            </h4>
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.6,
                margin: '0 0 20px',
              }}
            >
              Subscribe to receive private invitations, fragrance collections, and priority updates.
            </p>
            {subscribed ? (
              <div style={{ color: '#C8A46B', fontSize: '13px', fontWeight: 500, textAlign: 'left' }}>
                Thank you. You have joined the inner circle.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', position: 'relative', width: '100%' }}>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    border: 'none',
                    borderBottom: isInputFocused ? '1px solid #C8A46B' : '1px solid rgba(255, 255, 255, 0.25)',
                    padding: '12px 48px 12px 0',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontFamily: 'var(--font-body), Poppins, sans-serif',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#C8A46B',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ArrowRight size={18} strokeWidth={1.5} />
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* MIDDLE ROW: The 4 link columns */}
        <div
          style={{
            padding: '60px 0',
            display: 'grid',
            gap: '40px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
          className="grid-cols-2 md:grid-cols-4"
        >
          {/* Column 1: Shop */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: 0, ease: [0.22, 1, 0.36, 1] }}
          >
            <h5 style={columnHeaderStyle}>Shop</h5>
            <ul style={linkListStyle}>
              {[
                { name: "Men's Collection", href: '/categories/mens-collection' },
                { name: "Women's Collection", href: '/categories/womens-collection' },
                { name: 'Unisex Collection', href: '/categories/unisex-collection' },
                { name: 'Attars', href: '/categories/attars' },
                { name: 'Oud Collection', href: '/categories/oud-collection' },
                { name: 'Limited Editions', href: '/categories/limited-editions' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} style={linkStyle}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 2: Collections */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h5 style={columnHeaderStyle}>Collections</h5>
            <ul style={linkListStyle}>
              {[
                { name: 'The Identity Series', href: '/identity-series' },
                { name: 'Best Sellers', href: '/best-sellers' },
                { name: "What's Hot", href: '/whats-hot' },
                { name: 'New Arrivals', href: '/new-arrivals' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} style={linkStyle}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Customer Care */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h5 style={columnHeaderStyle}>Customer Care</h5>
            <ul style={linkListStyle}>
              {[
                { name: 'Shipping Info', href: '/shipping-returns' },
                { name: 'Returns', href: '/shipping-returns' },
                { name: 'Track Order', href: '/account/orders' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Contact Us', href: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} style={linkStyle}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Company */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <h5 style={columnHeaderStyle}>Company</h5>
            <ul style={linkListStyle}>
              {[
                { name: 'About', href: '/about' },
                { name: 'Journal', href: '/journal' },
                { name: 'Careers', href: '/careers' },
                { name: 'Press', href: '/press' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} style={linkStyle}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* DETAILS ROW: Trust Badges & Social Media Icons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            padding: '40px 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
          className="flex flex-col md:flex-row md:justify-between md:items-center gap-8"
        >
          {/* Trust Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 32px' }}>
            {[
              { icon: ShieldCheck, text: 'Secure Payment' },
              { icon: Award, text: 'Authentic Products' },
              { icon: Truck, text: 'Fast Delivery' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} style={{ color: '#C8A46B' }} strokeWidth={1.5} />
                <span style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}>
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Socials */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginRight: '8px' }}>
              Follow
            </span>
            {[
              { href: 'https://instagram.com/yamn7', icon: Instagram, label: 'Instagram' },
              { href: 'https://facebook.com/yamn7', icon: Facebook, label: 'Facebook' },
              { href: 'https://tiktok.com', icon: TikTokIcon, label: 'TikTok' },
              { href: 'https://pinterest.com', icon: PinterestIcon, label: 'Pinterest' },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(200, 164, 107, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C8A46B',
                  background: 'transparent',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'scale(1.12)';
                  el.style.color = '#D8C4A0';
                  el.style.borderColor = '#D8C4A0';
                  el.style.boxShadow = '0 0 10px rgba(216, 196, 160, 0.4)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'scale(1)';
                  el.style.color = '#C8A46B';
                  el.style.borderColor = 'rgba(200, 164, 107, 0.25)';
                  el.style.boxShadow = 'none';
                }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </motion.div>

        {/* PAYMENT & SHIPPING INFO ROW */}
        <div
          style={{
            padding: '40px 0 20px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.45)',
          }}
          className="flex flex-col md:flex-row md:justify-between md:items-center gap-6"
        >
          {/* Shipping information details */}
          <div style={{ maxWidth: '640px', lineHeight: 1.8 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: '#C8A46B' }}>Shipping Information:</strong> Free nationwide shipping on all orders over PKR 5,000. Reliable domestic and international shipping with complete customs clearances and active transit tracking alerts.
            </p>
          </div>

          {/* Payment Methods */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)' }}>
              We Accept
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Visa', 'Mastercard', 'EasyPaisa', 'JazzCash', 'Cash on Delivery'].map((method) => (
                <span
                  key={method}
                  style={{
                    fontSize: '10px',
                    padding: '4px 8px',
                    border: '1px solid rgba(200, 164, 107, 0.2)',
                    color: '#C8A46B',
                    borderRadius: '2px',
                    background: 'rgba(200, 164, 107, 0.02)',
                    fontWeight: 500,
                  }}
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          }}
          className="flex flex-col md:flex-row md:justify-between items-center gap-4 text-[11px] text-white/40"
        >
          <div>
            <span>© 2024 YAM-N7. All Rights Reserved.</span>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/privacy-policy" style={bottomLinkStyle}>Privacy Policy</Link>
            <Link href="/terms-conditions" style={bottomLinkStyle}>Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

/* Inline Styles definitions to guarantee consistency */
const columnHeaderStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display), "Playfair Display", serif',
  fontSize: '12px',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#C8A46B',
  marginBottom: '20px',
  fontWeight: 600,
};

const linkListStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const linkStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'rgba(255, 255, 255, 0.6)',
  textDecoration: 'none',
  transition: 'color 0.2s ease',
};

const bottomLinkStyle: React.CSSProperties = {
  color: 'rgba(255, 255, 255, 0.35)',
  textDecoration: 'none',
  transition: 'color 0.2s ease',
};

// Add standard hover effect styles inside JavaScript boundary on render
if (typeof window !== 'undefined') {
  const styles = `
    footer a:hover {
      color: #C8A46B !important;
    }
  `;
  const sheet = document.createElement('style');
  sheet.innerText = styles;
  document.head.appendChild(sheet);
}
