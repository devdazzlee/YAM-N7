'use client';

import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import Services from '../components/Services';
import { Award, Users, Heart, TrendingUp, Shield, Star, Gift, CheckCircle, Target, Eye, Sprout, Globe, Package } from 'lucide-react';
import Link from 'next/link';
import PageHero from '../components/pages/PageHero';
import PageCTA from '../components/pages/PageCTA';
import TrustStrip from '../components/pages/TrustStrip';
import PageFAQ from '../components/pages/PageFAQ';
import FragranceNotesSection from '../components/FragranceNotesSection';
import LuxuryCollectionsSection from '../components/LuxuryCollectionsSection';

export default function AboutPage() {
  const stats = [
    { icon: Award, number: '25+', label: 'Years of Excellence' },
    { icon: Users, number: '10K+', label: 'Happy Customers' },
    { icon: Heart, number: '1400+', label: 'Products Available' },
    { icon: TrendingUp, number: '98%', label: 'Satisfaction Rate' },
  ];

  const milestones = [
    {
      year: '2000',
      badge: 'The First Note',
      title: 'Our Humble Beginnings',
      description: 'YAM-N7 began as a dedicated perfume store with a simple mission: to bring authentic attars and luxury fragrances to customers across Pakistan.',
      icon: Sprout,
    },
    {
      year: '2005',
      badge: 'Building the Collection',
      title: 'Expanding to 200+ Scents',
      description: 'As word of our quality spread, we expanded our collection to include rare oud blends, designer-inspired fragrances, and traditional attars loved across Pakistan.',
      icon: Package,
    },
    {
      year: '2012',
      badge: 'Mastery of Sourcing',
      title: 'Direct from the Origin',
      description: 'To ensure the YAM-N7 standard, we began sourcing premium oud, essential oils, and fragrance compounds directly from trusted international suppliers.',
      icon: Globe,
    },
    {
      year: '2018',
      badge: 'A Signature Name',
      title: 'Serving 500+ Fragrances',
      description: 'By 2018, our catalog grew to over 500 fragrances. Every perfume was tested for longevity, projection, and authenticity under our strict Zero Compromise quality policy.',
      icon: Star,
    },
    {
      year: '2020',
      badge: 'The Digital Transition',
      title: 'Nationwide Delivery',
      description: 'Recognizing demand from customers across Pakistan and abroad, we expanded our online perfume store — bringing 25 years of fragrance expertise to doorsteps nationwide.',
      icon: TrendingUp,
    },
    {
      year: '2026',
      badge: 'Today & Tomorrow',
      title: '1400+ Fragrances & Counting',
      description: 'Today, YAM-N7 stands as a leader in premium perfumes and attars. With over 1400 fragrances and a quarter-century of history, we remain committed to the elegance that started it all.',
      icon: Award,
    },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Quality First',
      description: 'We never compromise. Every fragrance is carefully selected and tested to meet the rigorous YAM-N7 standards for longevity and authenticity.',
    },
    {
      icon: Heart,
      title: 'Customer Trust',
      description: 'Building long-term relationships through honesty and transparency is the foundation of our 25-year fragrance legacy.',
    },
    {
      icon: Award,
      title: 'Authenticity',
      description: 'We source exclusively from trusted suppliers, ensuring you receive genuine perfumes, attars, and oud blends every time.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <PageHero
        label="Our Heritage"
        title="About YAM-N7"
        subtitle="Your trusted destination for luxury perfumes, attars, and exclusive fragrances — crafting memorable scents since 2000."
        image="/banners/New-Banner.jpg"
        imageAlt="YAM-N7 heritage"
      >
        <Link href="/shop" className="luxury-btn-primary">
          Explore Collection
        </Link>
      </PageHero>

      <TrustStrip
        items={[
          { icon: Award, label: 'Established', value: '2000' },
          { icon: Users, label: 'Customers', value: '10K+' },
          { icon: Heart, label: 'Fragrances', value: '1400+' },
          { icon: TrendingUp, label: 'Satisfaction', value: '98%' },
        ]}
      />

      {/* Stats Section */}
      <section className="py-10 sm:py-14 md:py-16 bg-gradient-to-b from-background to-surface-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="text-center p-5 sm:p-7 luxury-card luxury-card-hover"
                >
                  <div className="luxury-icon-box-md mx-auto mb-3">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl text-foreground mb-1">{stat.number}</h3>
                  <p className="text-muted font-medium text-xs sm:text-sm">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-14 sm:py-18 md:py-24 bg-card relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 sm:mb-14"
            >
              <span className="inline-block text-primary-dark font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">
                Since 2000
              </span>
              <h2 className="font-display tracking-luxury uppercase text-2xl sm:text-3xl md:text-4xl text-foreground mb-4">
                Our Story
              </h2>
              <div className="flex items-center justify-center gap-2">
                <div className="w-10 h-0.5 bg-primary rounded-full"></div>
                <div className="w-12 h-0.5 bg-primary-dark rounded-full"></div>
              </div>
            </motion.div>

            {/* Main content grid */}
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-start">
              {/* Left — Large year visual */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="lg:col-span-2 relative"
              >
                <div className="relative rounded-2xl overflow-hidden border border-border bg-surface-muted/50">
                  <div className="p-8 sm:p-10 text-center">

                    <motion.div
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <p className="text-7xl sm:text-8xl font-bold text-foreground/10 leading-none select-none">25</p>
                      <p className="text-2xl sm:text-3xl font-bold text-foreground -mt-4 relative z-10">25+ Years</p>
                      <div className="w-10 h-0.5 bg-primary-dark rounded-full mx-auto mt-4 mb-4"></div>
                      <p className="text-foreground/70 text-sm sm:text-base leading-relaxed">
                        Of excellence, trust &amp; heritage in Karachi
                      </p>
                    </motion.div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-foreground/10">
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-primary-dark">1400+</p>
                        <p className="text-foreground/60 text-xs sm:text-sm mt-0.5">Products</p>
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-primary-light">10K+</p>
                        <p className="text-foreground/60 text-xs sm:text-sm mt-0.5">Happy Customers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right — Story text */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="lg:col-span-3 space-y-5"
              >
                {/* Quote */}
                <div className="relative pl-5 border-l-3 border-primary-dark">
                  <p className="text-lg sm:text-xl md:text-2xl text-foreground font-medium italic leading-relaxed">
                    &ldquo;What started as a passion for fine fragrances has grown into one of Pakistan&apos;s most trusted online perfume stores.&rdquo;
                  </p>
                </div>

                {/* Main paragraphs */}
                <p className="text-sm sm:text-base text-muted leading-relaxed">
                  YAM-N7 was established in <span className="font-semibold text-foreground">2000</span> in Karachi.
                  What began as a humble mission to bring authentic attars and fine fragrances to our community
                  has blossomed into a legacy spanning over two decades.
                </p>

                <p className="text-sm sm:text-base text-muted leading-relaxed">
                  Our unwavering commitment to <span className="font-semibold text-foreground">quality, authenticity, and customer satisfaction</span> has
                  been the cornerstone of our growth. We carefully source every fragrance — from rare oud blends
                  to designer-inspired perfumes — directly from the finest suppliers worldwide.
                </p>

                <p className="text-sm sm:text-base text-muted leading-relaxed">
                  Today, with <span className="font-semibold text-foreground">1400+ fragrances</span> available online, we continue to serve customers across Pakistan with the same passion and &ldquo;Zero Compromise&rdquo; approach to
                  quality that we started with.
                </p>

                {/* Highlight cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  <div className="flex items-center gap-3 bg-surface-muted/50 rounded-xl p-4 border border-border">
                    <div className="luxury-icon-box w-10 h-10 flex-shrink-0">
                      <Shield className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">Zero Compromise</p>
                      <p className="text-xs text-muted">On scent & quality</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-surface-muted/50 rounded-xl p-4 border border-border">
                    <div className="luxury-icon-box w-10 h-10 flex-shrink-0">
                      <Heart className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">Family Values</p>
                      <p className="text-xs text-muted">Built on trust</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-surface-muted/50 rounded-xl p-4 border border-border">
                    <div className="luxury-icon-box w-10 h-10 flex-shrink-0">
                      <Award className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">Heritage Brand</p>
                      <p className="text-xs text-muted">Since 2000</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey / Timeline Section */}
      <section className="py-14 sm:py-18 md:py-24 bg-gradient-to-b from-surface-muted/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="font-display tracking-luxury uppercase text-2xl sm:text-3xl md:text-4xl text-foreground mb-3">
              A Legacy of Fragrance: Our Journey
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted max-w-xl mx-auto mb-4">
              Milestones that define 25 years of fragrance excellence
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-10 h-0.5 bg-primary rounded-full"></div>
              <div className="w-12 h-0.5 bg-primary-dark rounded-full"></div>
            </div>
          </motion.div>

          {/* Clean Grid Timeline */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="group"
                >
                  <div className="luxury-card luxury-card-hover p-5 sm:p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="luxury-icon-box-sm flex-shrink-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" strokeWidth={1.5} />
                      </div>
                      <div>
                        <span className="inline-block text-xs font-semibold text-primary-foreground bg-primary px-2.5 py-0.5 rounded-full">
                          {milestone.year}
                        </span>
                        <p className="text-[11px] sm:text-xs text-muted-subtle font-medium mt-1 uppercase tracking-wide">
                          {milestone.badge}
                        </p>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">
                      {milestone.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-[15px] text-muted leading-relaxed flex-grow">
                      {milestone.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-14 sm:py-18 md:py-24 bg-gradient-to-b from-background to-surface-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="font-display tracking-luxury uppercase text-2xl sm:text-3xl md:text-4xl text-foreground mb-3">Our Values</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted max-w-lg mx-auto mb-4">
              The principles that guide our product selections.
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-10 h-0.5 bg-primary rounded-full"></div>
              <div className="w-12 h-0.5 bg-primary-dark rounded-full"></div>
            </div>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="luxury-card luxury-card-hover p-6 sm:p-8 text-center"
                >
                  <div className="luxury-icon-box-md mx-auto mb-4">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm sm:text-base text-muted leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-14 sm:py-18 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="font-display tracking-luxury uppercase text-2xl sm:text-3xl md:text-4xl text-foreground mb-3">Mission & Vision</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted max-w-lg mx-auto mb-4">
              Aligning your goals with community health and premium standards.
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-10 h-0.5 bg-primary rounded-full"></div>
              <div className="w-12 h-0.5 bg-primary-dark rounded-full"></div>
            </div>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="luxury-card luxury-card-hover p-6 sm:p-8"
            >
              <div className="luxury-icon-box-md mb-4">
                <Target className="w-7 h-7 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-xl sm:text-2xl text-foreground mb-3">Our Mission</h3>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                To enrich lives through the art of fragrance — providing access to the finest perfumes, attars, 
                and oud blends. We are committed to making luxury scents accessible to everyone through excellence and transparency.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="luxury-card luxury-card-hover p-6 sm:p-8"
            >
              <div className="luxury-icon-box-md mb-4">
                <Eye className="w-7 h-7 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-xl sm:text-2xl text-foreground mb-3">Our Vision</h3>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                To be Pakistan&apos;s leading perfume house, recognized for our unwavering 
                commitment to quality and elegance. We envision a future where everyone can 
                discover their signature scent with confidence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Trust Us Section */}
      <section className="py-14 sm:py-18 md:py-24 bg-gradient-to-b from-surface-muted/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="font-display tracking-luxury uppercase text-2xl sm:text-3xl md:text-4xl text-foreground mb-3">Why Trust Us?</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted max-w-lg mx-auto">
              We have earned the trust of thousands of customers through our commitment to excellence.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {[
              { icon: CheckCircle, title: 'Authentic Products', desc: '100% genuine items from verified, trusted sources.' },
              { icon: Star, title: 'Premium Quality', desc: 'Every item in our 700+ catalog is handpicked and thoroughly tested.' },
              { icon: Gift, title: 'Best Prices', desc: 'Competitive pricing guaranteed for the finest luxury fragrances.' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="luxury-card luxury-card-hover p-6 sm:p-8 text-center"
                >
                  <div className="luxury-icon-box-md mx-auto mb-4">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <FragranceNotesSection />
      <LuxuryCollectionsSection />

      <PageFAQ
        accent="About YAM-N7"
        title="Frequently Asked"
        items={[
          {
            q: 'Where is YAM-N7 based?',
            a: 'YAM-N7 was founded in Karachi, Pakistan in 2000. Today we serve customers nationwide through our online store with secure delivery across the country.',
          },
          {
            q: 'What makes YAM-N7 different?',
            a: 'Our Zero Compromise policy means every fragrance is tested for authenticity, longevity, and projection before it enters our catalog. With 25+ years of expertise, we curate rather than simply stock.',
          },
          {
            q: 'Do you sell original perfumes and attars?',
            a: 'Yes. We source exclusively from verified suppliers and stand behind the authenticity of every product we sell.',
          },
          {
            q: 'Can I visit a physical store?',
            a: 'We operate primarily as an online perfume destination. Contact us via WhatsApp or phone for product availability and personalised recommendations.',
          },
        ]}
      />

      <PageCTA
        title="Experience YAM-N7"
        subtitle="Discover over 1,400 fragrances curated with the same passion that started our journey in 2000."
        primaryHref="/shop"
        primaryLabel="Shop Fragrances"
        secondaryHref="/contact"
        secondaryLabel="Contact Us"
      />

      <Newsletter />
      <Services />
      <Footer />
    </div>
  );
}
