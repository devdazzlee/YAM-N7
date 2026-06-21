'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { WebProduct } from '../../lib/api/webApi';
import { SectionHeader, Stagger, StaggerChild, Reveal, SectionShell } from './motion/reveal';

interface ProductShowcaseSectionProps {
  accent?: string;
  title: string;
  subtitle?: string;
  products: WebProduct[];
  loading?: boolean;
  viewAllHref?: string;
  viewAllLabel?: string;
  dark?: boolean;
  id?: string;
}

function ProductSkeleton() {
  return (
    <div className="luxury-card overflow-hidden">
      <div className="aspect-[3/4] animate-pulse bg-gradient-to-br from-subtle-strong to-border" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-4/5 rounded bg-border animate-pulse" />
        <div className="h-5 w-2/5 rounded bg-border animate-pulse" />
      </div>
    </div>
  );
}

export default function ProductShowcaseSection({
  accent,
  title,
  subtitle,
  products,
  loading = false,
  viewAllHref = '/shop',
  viewAllLabel = 'View All',
  dark = false,
  id,
}: ProductShowcaseSectionProps) {
  return (
    <SectionShell id={id} dark={dark} className={dark ? '' : 'bg-gradient-to-b from-background via-surface/30 to-background'}>
      <SectionHeader accent={accent} title={title} subtitle={subtitle} />

      {loading && products.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductSkeleton key={`skel-${i}`} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <Reveal className="text-center py-16">
          <p className="text-muted font-light">No products available at the moment.</p>
        </Reveal>
      ) : (
        <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 items-stretch">
          {products.slice(0, 8).map((product) => (
            <StaggerChild key={product.id} className="h-full">
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.original_price}
                image={product.image || ''}
                category={product.category?.name}
                unitName={product.unit?.name}
                sales_rate_inc_dis_and_tax={product.price}
                sales_rate_exc_dis_and_tax={product.base_price}
                selling_price={product.price}
              />
            </StaggerChild>
          ))}
        </Stagger>
      )}

      {products.length > 0 && (
        <Reveal className="flex justify-center mt-12 sm:mt-14" delay={0.1}>
          <Link href={viewAllHref} className="luxury-btn-outline group">
            {viewAllLabel}
            <motion.span whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400 }}>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.span>
          </Link>
        </Reveal>
      )}
    </SectionShell>
  );
}
