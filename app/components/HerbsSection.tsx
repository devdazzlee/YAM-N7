'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
interface HerbsCategoryLike {
  name: string;
  slug?: string;
}

interface HerbsSectionProps {
  categories: HerbsCategoryLike[];
}

// Pick a featured category to highlight – prefer perfume-related categories
function getFeaturedCategory(categories: HerbsCategoryLike[]): HerbsCategoryLike | null {
  if (!categories || categories.length === 0) return null;

  const preferred = ['perfume', 'perfumes', 'attar', 'attars', 'oud', 'fragrance', 'body mist', 'scent'];
  for (const name of preferred) {
    const found = categories.find((c) => c.name.toLowerCase() === name);
    if (found) return found;
  }
  // Fallback: first category
  return categories[0];
}

function getCategorySlug(cat: HerbsCategoryLike): string {
  return cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
}

export default function HerbsSection({ categories }: HerbsSectionProps) {
  const featured = getFeaturedCategory(categories);

  if (!featured) return null; // Nothing to show if no categories loaded

  return (
    <section className="py-10 sm:py-12 md:py-14 bg-gradient-to-r from-[#1A1A1A] to-[#C5A059] text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#F5EDD8] mx-auto" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Explore {featured.name}
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl mx-auto">
              Discover our curated collection of luxury perfumes and attars. From bold oud blends to elegant everyday fragrances, find your signature scent at YAM-N7.
            </p>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="pt-2"
            >
              <Link
                href={`/categories/${getCategorySlug(featured)}`}
                className="inline-flex items-center space-x-2 bg-[#F5EDD8] hover:bg-white text-[#1A1A1A] px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg"
              >
                <span>Explore {featured.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
