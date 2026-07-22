'use client';

import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Services from '../components/Services';
import { FlaskConical, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CustomFormulasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="page-banner text-foreground page-offset py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <FlaskConical className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Custom Blends</h1>
            </div>
            <p className="text-xl text-foreground/90">
              Create personalized fragrance blends tailored to your unique style
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-surface-muted rounded-2xl p-8 md:p-12 space-y-8"
          >
            <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
            <div className="space-y-6 text-muted">
              <p>
                At YAM-N7, we understand that every individual has a unique scent profile.
                That&apos;s why we offer custom fragrance blends created specifically for you.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Consultation</h3>
                    <p>Discuss your scent preferences and occasion needs with our fragrance experts.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Custom Formula</h3>
                    <p>We create a personalized blend using our curated collection of premium oils and notes.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Preparation</h3>
                    <p>Your custom formula is carefully prepared and packaged.</p>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-4 rounded-full font-semibold transition-colors flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
      <Services />
      <Footer />
    </div>
  );
}

