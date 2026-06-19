'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import Services from '../components/Services';
import Loader from '../components/Loader';
import { Star, Verified, MapPin } from 'lucide-react';

interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  time: number;
  profile_photo_url?: string;
  store_name?: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [overallRating, setOverallRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/google-reviews');
        const data = await res.json();
        setReviews(data.reviews || []);
        setOverallRating(data.rating || 0);
        setTotalReviews(data.totalReviews || 0);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-gradient-to-r from-surface-elevated to-primary text-foreground py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Customer Reviews</h1>
            <p className="text-xl text-foreground/90">See what our customers are saying</p>
            {overallRating > 0 && (
              <div className="mt-6 flex items-center justify-center space-x-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.round(overallRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-foreground/40'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold">{overallRating}</span>
                <span className="text-foreground/80">({totalReviews.toLocaleString()} reviews)</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-card">
        <div className="container mx-auto px-4 max-w-4xl">
          {loading ? (
            <Loader size="lg" text="Loading reviews..." />
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted text-lg">No reviews available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={`${review.author_name}-${review.time}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {review.profile_photo_url ? (
                        <img
                          src={review.profile_photo_url}
                          alt={review.author_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-foreground font-bold">
                          {review.author_name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-foreground">{review.author_name}</h3>
                          <Verified className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted">
                          <span>{review.relative_time_description}</span>
                          {review.store_name && (
                            <>
                              <span>·</span>
                              <span className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{review.store_name}</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating
                              ? 'fill-primary-dark text-primary-dark'
                              : 'text-muted-subtle'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Newsletter />
      <Services />
      <Footer />
    </div>
  );
}
