'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Services from '../components/Services';
import Link from 'next/link';
import { Map as SitemapIcon } from 'lucide-react';
import { useCategoryStore } from '../../lib/store/categoryStore';
import { Category } from '../../lib/api/categoryApi';

const staticSections = [
  {
    title: 'Main Pages',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Shop', href: '/shop' },
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Account',
    links: [
      { name: 'Login', href: '/login' },
      { name: 'Register', href: '/register' },
      { name: 'My Account', href: '/account' },
      { name: 'My Orders', href: '/account/orders' },
      { name: 'Wishlist', href: '/wishlist' },
    ],
  },
  {
    title: 'Information',
    links: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Shipping & Returns', href: '/shipping-returns' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms & Conditions', href: '/terms-conditions' },
    ],
  },
];

export default function SitemapPage() {
  const [categoryLinks, setCategoryLinks] = useState<{ name: string; href: string }[]>([]);
  const { getCategories } = useCategoryStore();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setCategoryLinks(
          categories
            .filter((c: Category) => c.is_active)
            .map((c: Category) => ({ name: c.name, href: `/categories/${c.slug}` }))
        );
      } catch {
        setCategoryLinks([]);
      }
    };
    fetchCategories();
  }, [getCategories]);

  const allSections = [
    staticSections[0],
    {
      title: 'Categories',
      links: categoryLinks.length > 0
        ? categoryLinks
        : [{ name: 'All Products', href: '/shop' }],
    },
    ...staticSections.slice(1),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="page-banner text-foreground page-offset py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <SitemapIcon className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Sitemap</h1>
            </div>
            <p className="text-xl text-foreground/90">Find all pages on our website</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {allSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-surface-muted rounded-2xl p-6"
              >
                <h2 className="text-xl font-bold text-foreground mb-4">{section.title}</h2>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-muted hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Services />
      <Footer />
    </div>
  );
}
