'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Truck } from 'lucide-react';

export default function SpecialOfferBanner() {
  return (
    <section className="py-4 sm:py-5 bg-gradient-brand-h text-foreground">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4"
        >
          <div className="flex items-center space-x-3">
            <Truck className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
            <div>
              <h3 className="text-base sm:text-lg font-bold">Free Nationwide Shipping!</h3>
              <p className="text-foreground/90 text-xs sm:text-sm">Enjoy Free Shipping When You Spend Rs. 5,000 or More</p>
            </div>
          </div>
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-card text-foreground px-5 py-2 rounded-full font-semibold text-sm hover:bg-surface transition-colors shadow-md w-full sm:w-auto"
            >
              Shop Now
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
