import { NextResponse } from 'next/server';

// Cache reviews for 1 hour to avoid hitting API limits
let cachedData: { reviews: GoogleReview[]; rating: number; totalReviews: number; stores: StoreInfo[] } | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  time: number;
  profile_photo_url?: string;
  store_name?: string; // Which store this review is from
}

interface StoreInfo {
  name: string;
  rating: number;
  totalReviews: number;
  placeId: string;
}

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    // Support multiple stores: comma-separated Place IDs with optional names
    // Format: "PlaceID1:Store Name 1,PlaceID2:Store Name 2"
    // Or simple: "PlaceID1,PlaceID2"
    const placeIdsRaw = process.env.GOOGLE_PLACE_IDS || process.env.GOOGLE_PLACE_ID || '';

    // Return cached data if still valid
    if (cachedData && Date.now() - cacheTimestamp < CACHE_DURATION) {
      return NextResponse.json({
        ...cachedData,
        source: 'cache',
      });
    }

    // If no API key or Place IDs, return fallback reviews
    if (!apiKey || !placeIdsRaw) {
      console.warn('Google Places API key or Place IDs not configured. Using fallback reviews.');
      return NextResponse.json({
        reviews: getFallbackReviews(),
        rating: 4.8,
        totalReviews: 500,
        stores: [],
        source: 'fallback',
      });
    }

    // Parse place IDs — supports "PlaceID:Name" or just "PlaceID"
    const placeEntries = placeIdsRaw.split(',').map((entry) => {
      const trimmed = entry.trim();
      if (trimmed.includes(':')) {
        const [id, ...nameParts] = trimmed.split(':');
        return { placeId: id.trim(), name: nameParts.join(':').trim() };
      }
      return { placeId: trimmed, name: '' };
    }).filter((e) => e.placeId);

    // Fetch reviews from all stores in parallel
    const storeResults = await Promise.allSettled(
      placeEntries.map(async ({ placeId, name }) => {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&key=${apiKey}`;
        const response = await fetch(url, { next: { revalidate: 3600 } });
        const data = await response.json();

        if (data.status !== 'OK' || !data.result) {
          console.error(`Google Places API error for ${placeId}:`, data.status, data.error_message);
          return null;
        }

        const storeName = name || data.result.name || 'YAM-N7';

        const reviews: GoogleReview[] = (data.result.reviews || []).map((review: GoogleReview) => ({
          author_name: review.author_name,
          rating: review.rating,
          text: review.text,
          relative_time_description: review.relative_time_description,
          time: review.time,
          profile_photo_url: review.profile_photo_url,
          store_name: storeName,
        }));

        return {
          storeName,
          reviews,
          rating: data.result.rating as number,
          totalReviews: data.result.user_ratings_total as number,
          placeId,
        };
      })
    );

    // Collect all reviews and calculate combined stats
    const allReviews: GoogleReview[] = [];
    const stores: StoreInfo[] = [];
    let totalRatingSum = 0;
    let totalReviewCount = 0;
    let storeCount = 0;

    for (const result of storeResults) {
      if (result.status === 'fulfilled' && result.value) {
        const store = result.value;
        allReviews.push(...store.reviews);
        stores.push({
          name: store.storeName,
          rating: store.rating,
          totalReviews: store.totalReviews,
          placeId: store.placeId,
        });
        totalRatingSum += store.rating * store.totalReviews;
        totalReviewCount += store.totalReviews;
        storeCount++;
      }
    }

    // If no stores returned data, use fallback
    if (storeCount === 0) {
      return NextResponse.json({
        reviews: getFallbackReviews(),
        rating: 4.8,
        totalReviews: 500,
        stores: [],
        source: 'fallback',
      });
    }

    // Sort all reviews by time (newest first)
    allReviews.sort((a, b) => b.time - a.time);

    // Calculate weighted average rating across all stores
    const combinedRating = totalReviewCount > 0 ? totalRatingSum / totalReviewCount : 0;

    // Cache the results
    cachedData = {
      reviews: allReviews,
      rating: Math.round(combinedRating * 10) / 10,
      totalReviews: totalReviewCount,
      stores,
    };
    cacheTimestamp = Date.now();

    return NextResponse.json({
      ...cachedData,
      source: 'google',
    });
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json({
      reviews: getFallbackReviews(),
      rating: 4.8,
      totalReviews: 500,
      stores: [],
      source: 'fallback',
    });
  }
}

function getFallbackReviews(): GoogleReview[] {
  return [
    {
      author_name: 'Ahmed Khan',
      rating: 5,
      text: 'Best quality perfumes online! I have been buying from YAM-N7 for over 10 years. Amazing variety and the oud collection is absolutely top-notch.',
      relative_time_description: '2 months ago',
      time: Date.now() / 1000 - 60 * 60 * 24 * 60,
      store_name: 'YAM-N7 Perfume Store',
    },
    {
      author_name: 'Fatima Ali',
      rating: 5,
      text: 'Love their attar and body mist collection. Long-lasting, elegant, and authentic. Fast delivery and great customer support. Highly recommended!',
      relative_time_description: '3 months ago',
      time: Date.now() / 1000 - 60 * 60 * 24 * 90,
      store_name: 'YAM-N7 Perfume Store',
    },
    {
      author_name: 'Hassan Malik',
      rating: 5,
      text: '25+ years of trust. YAM-N7 never disappoints! Their perfumes are the finest. Great prices and excellent service every single time.',
      relative_time_description: '1 month ago',
      time: Date.now() / 1000 - 60 * 60 * 24 * 30,
      store_name: 'YAM-N7 Perfume Store',
    },
    {
      author_name: 'Sana Rizvi',
      rating: 5,
      text: 'Amazing perfume store with incredible variety. Their exclusive fragrance collection is unmatched. Ordering online is easy and delivery is always on time.',
      relative_time_description: '2 weeks ago',
      time: Date.now() / 1000 - 60 * 60 * 24 * 14,
      store_name: 'YAM-N7 Perfume Store',
    },
    {
      author_name: 'Muhammad Usman',
      rating: 4,
      text: 'Great selection of perfumes and attars. Every scent lasts beautifully. Prices are competitive and the packaging is always secure. Will keep coming back.',
      relative_time_description: '3 weeks ago',
      time: Date.now() / 1000 - 60 * 60 * 24 * 21,
      store_name: 'YAM-N7 Perfume Store',
    },
  ];
}
