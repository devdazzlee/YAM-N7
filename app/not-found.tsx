'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="py-32 bg-gradient-to-b from-surface-muted to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-9xl font-bold text-foreground mb-4">404</h1>
            <h2 className="text-4xl font-bold text-foreground mb-4">Page Not Found</h2>
            <p className="text-xl text-muted mb-8">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-4 rounded-full font-semibold transition-colors flex items-center space-x-2"
                >
                  <Home className="w-5 h-5" />
                  <span>Go Home</span>
                </motion.button>
              </Link>
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-card hover:bg-surface text-foreground px-8 py-4 rounded-full font-semibold transition-colors flex items-center space-x-2 border-2 border-surface-elevated"
                >
                  <Search className="w-5 h-5" />
                  <span>Browse Shop</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

