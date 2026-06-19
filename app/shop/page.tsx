'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import Services from '../components/Services';
import ProductBrowser from '../components/ProductBrowser';
import { Star, Gift, Zap, Sparkles } from 'lucide-react';

const SHOP_BUCKET = 'shop';

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="relative bg-gradient-to-r from-surface-elevated to-primary text-foreground py-8 sm:py-10 md:py-14 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-surface rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">Shop</h1>
            <p className="text-sm sm:text-base md:text-lg text-foreground/90">Discover our premium collection</p>
          </div>
        </div>
      </section>

      {/* Filters + product grid + pagination */}
      <ProductBrowser bucketKey={SHOP_BUCKET} />

      {/* Banner */}
      <section className="py-4 sm:py-6 bg-gradient-to-r from-primary-dark to-primary text-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-5">
            <div className="flex items-center space-x-3">
              <Gift className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0" />
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Special Offer!</h3>
                <p className="text-foreground/90 text-xs sm:text-sm">Get Rs. 500 off on orders above Rs. 2000</p>
              </div>
            </div>
            <button className="bg-card text-foreground px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-surface transition-colors shadow-xl w-full md:w-auto hover:scale-[1.05] active:scale-[0.95]">
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Why Shop With Us */}
      <section className="py-10 sm:py-14 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-10">
            <Sparkles className="w-8 h-8 sm:w-9 sm:h-9 text-primary-dark mx-auto mb-3" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">Why Shop With Us?</h2>
            <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto">
              Experience the difference with our premium service
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {[
              { icon: Zap, title: 'Fast Delivery', desc: 'Quick and reliable shipping' },
              { icon: Star, title: 'Premium Quality', desc: 'Handpicked products' },
              { icon: Gift, title: 'Best Prices', desc: 'Competitive pricing' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-gradient-to-br from-surface-muted to-background p-5 sm:p-7 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-surface-elevated rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted text-xs sm:text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Newsletter />
      <Services />
      <Footer />
    </div>
  );
}
