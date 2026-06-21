'use client';

import { useEffect } from 'react';
import ProductShowcaseSection from './ProductShowcaseSection';
import { useWebProductListStore } from '../../lib/store/webProductListStore';

const BUCKET_KEY = 'home:new-arrivals';

export default function NewArrivalsSection() {
  const bucket = useWebProductListStore((s) => s.buckets[BUCKET_KEY]);
  const setBucketPage = useWebProductListStore((s) => s.setPage);

  useEffect(() => {
    setBucketPage(BUCKET_KEY, { page: 1, limit: 8, sort: 'newest' });
  }, [setBucketPage]);

  const products = bucket?.items ?? [];
  const loading = bucket?.loading ?? !bucket;

  return (
    <ProductShowcaseSection
      id="new-arrivals"
      accent="Just Arrived"
      title="New Arrivals"
      subtitle="The latest additions to our fragrance house — fresh, exclusive, and ready to define your signature."
      products={products}
      loading={loading}
      viewAllHref="/new-arrivals"
      viewAllLabel="Shop New Arrivals"
    />
  );
}
