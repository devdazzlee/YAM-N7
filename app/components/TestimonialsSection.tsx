'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeader, Reveal, ease } from './motion/reveal';

interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  time: number;
  profile_photo_url?: string;
  store_name?: string;
}

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [overallRating, setOverallRating] = useState<number>(4.8);
  const [totalReviews, setTotalReviews] = useState<number>(500);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  // Cards per page based on screen (we'll use 3 for desktop grid, paginate by 3)
  const cardsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / cardsPerPage);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/google-reviews');
        const data = await res.json();
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
          if (data.rating) setOverallRating(data.rating);
          if (data.totalReviews) setTotalReviews(data.totalReviews);
        }
      } catch (error) {
        console.error('Failed to fetch Google reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (totalPages <= 1) return;
    const interval = setInterval(nextPage, 6000);
    return () => clearInterval(interval);
  }, [totalPages, nextPage]);

  // Get current page reviews
  const currentReviews = reviews.slice(
    currentPage * cardsPerPage,
    currentPage * cardsPerPage + cardsPerPage
  );

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 sm:w-[18px] sm:h-[18px] ${
            star <= rating
              ? 'fill-primary text-primary'
              : star - 0.5 <= rating
              ? 'fill-primary/50 text-primary'
              : 'fill-border text-border'
          }`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <section className="py-10 sm:py-12 md:py-14 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-border rounded w-48 mx-auto" />
              <div className="h-3 bg-border rounded w-36 mx-auto" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-44 bg-subtle-strong rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="luxury-section bg-background overflow-hidden">
      <div className="luxury-container">
        <SectionHeader
          title="What Our Customers Say"
          subtitle="Real reviews from our valued customers"
        />

        <Reveal className="text-center mb-6" delay={0.1}>
          <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5 sm:py-2 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-sm sm:text-base font-bold text-foreground">{overallRating.toFixed(1)}</span>
            {renderStars(overallRating)}
            <span className="text-[11px] sm:text-xs text-muted border-l border-border-strong pl-2">
              {totalReviews.toLocaleString()}+ reviews
            </span>
          </div>
        </Reveal>

        {/* Reviews Grid */}
        <div className="relative">
          {/* Navigation Arrows — kept inside bounds */}
          {totalPages > 1 && (
            <>
              <button
                onClick={prevPage}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 bg-card rounded-full flex items-center justify-center hover:bg-surface-elevated transition-colors border border-border/40 hover:border-primary"
                aria-label="Previous reviews"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={nextPage}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 bg-card rounded-full flex items-center justify-center hover:bg-surface-elevated transition-colors border border-border/40 hover:border-primary"
                aria-label="Next reviews"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </>
          )}

          {/* Cards Grid */}
          <div className="px-6 sm:px-14 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -24, filter: 'blur(8px)' }}
                transition={{ duration: 0.45, ease }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {currentReviews.map((review, index) => (
                  <motion.div
                    key={`${review.author_name}-${currentPage}-${index}`}
                    initial={{ opacity: 0, y: 28, scale: 0.96, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="bg-card rounded-xl p-4 sm:p-5 transition-all duration-300 flex flex-col h-full border border-border/40 hover:border-primary"
                  >
                    {/* Stars */}
                    <div className="mb-3">
                      {renderStars(review.rating)}
                    </div>

                    {/* Review Text */}
                    <p className="text-muted italic text-sm sm:text-[15px] leading-relaxed flex-grow mb-5 line-clamp-4">
                      &ldquo;{review.text}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/80 mt-auto">
                      <div className="flex items-center gap-2.5">
                        {review.profile_photo_url ? (
                          <img
                            src={review.profile_photo_url}
                            alt={review.author_name}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-border shadow-sm"
                          />
                        ) : (
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm ring-2 ring-primary/20 shadow-sm">
                            {review.author_name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-foreground text-sm sm:text-[15px] leading-tight">
                            {review.author_name}
                          </p>
                          {review.store_name && (
                            <p className="text-[11px] sm:text-xs text-primary mt-0.5">
                              {review.store_name}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] sm:text-xs text-muted-subtle whitespace-nowrap ml-2">
                        {review.relative_time_description}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-7">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentPage
                      ? 'bg-primary w-6'
                      : 'bg-border-strong hover:bg-muted-subtle w-2'
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
