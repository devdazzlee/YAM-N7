import { create } from 'zustand';
import { webApi, WebProduct, WebMeta, ProductListParams } from '../api/webApi';

// Paged product list store, signature-keyed.
// Multiple pages (shop, category, search, "load more featured" on home) can each
// hold their own bucket without colliding by passing a unique `key`.

const TTL_MS = 2 * 60 * 1000;

interface Bucket {
  items: WebProduct[];          // for "Load more" pages (accumulated)
  page: WebProduct[];           // current page items (for grid pagination)
  meta: WebMeta | null;
  params: ProductListParams;    // last fetched params (without `page`)
  loading: boolean;
  error: string | null;
  fetchedAt: number;
}

interface State {
  buckets: Record<string, Bucket>;

  // Replace mode: used by Shop where the grid shows ONE page at a time (?page=N).
  setPage: (key: string, params: ProductListParams) => Promise<void>;

  // Append mode: used by "Load More" UIs (Home featured, Category, Search).
  loadFirstPage: (key: string, params: ProductListParams) => Promise<void>;
  loadNextPage: (key: string) => Promise<void>;

  // Read-only selectors
  getBucket: (key: string) => Bucket | undefined;
  resetBucket: (key: string) => void;
}

const inFlight = new Map<string, Promise<void>>();

const stripPage = (p: ProductListParams): ProductListParams => {
  const { page: _omit, ...rest } = p;
  return rest;
};

const sameFilters = (a: ProductListParams, b: ProductListParams) =>
  JSON.stringify(stripPage(a)) === JSON.stringify(stripPage(b));

const emptyBucket = (params: ProductListParams): Bucket => ({
  items: [],
  page: [],
  meta: null,
  params: stripPage(params),
  loading: false,
  error: null,
  fetchedAt: 0,
});

export const useWebProductListStore = create<State>((set, get) => ({
  buckets: {},

  setPage: async (key, params) => {
    const flightKey = `${key}:set:${JSON.stringify(params)}`;
    if (inFlight.has(flightKey)) return inFlight.get(flightKey)!;

    const existing = get().buckets[key];
    if (
      existing &&
      sameFilters(existing.params, params) &&
      existing.meta?.page === (params.page ?? 1) &&
      Date.now() - existing.fetchedAt < TTL_MS
    ) {
      // Cache hit, no-op
      return;
    }

    set((s) => ({
      buckets: {
        ...s.buckets,
        [key]: { ...(s.buckets[key] ?? emptyBucket(params)), loading: true, error: null, params: stripPage(params) },
      },
    }));

    const promise = webApi
      .listProducts(params)
      .then(({ data, meta }) => {
        set((s) => ({
          buckets: {
            ...s.buckets,
            [key]: {
              items: data,
              page: data,
              meta,
              params: stripPage(params),
              loading: false,
              error: null,
              fetchedAt: Date.now(),
            },
          },
        }));
      })
      .catch((err) => {
        set((s) => ({
          buckets: {
            ...s.buckets,
            [key]: {
              ...(s.buckets[key] ?? emptyBucket(params)),
              loading: false,
              error: err?.message || 'Failed to load products',
            },
          },
        }));
      })
      .finally(() => {
        inFlight.delete(flightKey);
      });

    inFlight.set(flightKey, promise);
    return promise;
  },

  loadFirstPage: async (key, params) => {
    const flightKey = `${key}:first:${JSON.stringify(stripPage(params))}`;
    if (inFlight.has(flightKey)) return inFlight.get(flightKey)!;

    const existing = get().buckets[key];
    if (
      existing &&
      sameFilters(existing.params, params) &&
      existing.items.length > 0 &&
      Date.now() - existing.fetchedAt < TTL_MS
    ) {
      return;
    }

    const firstParams: ProductListParams = { ...params, page: 1 };

    set((s) => ({
      buckets: {
        ...s.buckets,
        [key]: { ...(s.buckets[key] ?? emptyBucket(params)), loading: true, error: null, params: stripPage(params) },
      },
    }));

    const promise = webApi
      .listProducts(firstParams)
      .then(({ data, meta }) => {
        set((s) => ({
          buckets: {
            ...s.buckets,
            [key]: {
              items: data,
              page: data,
              meta,
              params: stripPage(params),
              loading: false,
              error: null,
              fetchedAt: Date.now(),
            },
          },
        }));
      })
      .catch((err) => {
        set((s) => ({
          buckets: {
            ...s.buckets,
            [key]: {
              ...(s.buckets[key] ?? emptyBucket(params)),
              loading: false,
              error: err?.message || 'Failed to load products',
            },
          },
        }));
      })
      .finally(() => {
        inFlight.delete(flightKey);
      });

    inFlight.set(flightKey, promise);
    return promise;
  },

  loadNextPage: async (key) => {
    const bucket = get().buckets[key];
    if (!bucket || !bucket.meta) return;
    if (bucket.meta.page >= bucket.meta.totalPages) return;

    const flightKey = `${key}:next:${bucket.meta.page + 1}`;
    if (inFlight.has(flightKey)) return inFlight.get(flightKey)!;

    const nextParams: ProductListParams = {
      ...bucket.params,
      page: bucket.meta.page + 1,
      limit: bucket.meta.limit,
    };

    set((s) => ({
      buckets: {
        ...s.buckets,
        [key]: { ...s.buckets[key], loading: true, error: null },
      },
    }));

    const promise = webApi
      .listProducts(nextParams)
      .then(({ data, meta }) => {
        set((s) => {
          const current = s.buckets[key];
          const seen = new Set(current.items.map((p) => p.id));
          const merged = [...current.items, ...data.filter((p) => !seen.has(p.id))];
          return {
            buckets: {
              ...s.buckets,
              [key]: {
                ...current,
                items: merged,
                page: data,
                meta,
                loading: false,
                error: null,
                fetchedAt: Date.now(),
              },
            },
          };
        });
      })
      .catch((err) => {
        set((s) => ({
          buckets: {
            ...s.buckets,
            [key]: { ...s.buckets[key], loading: false, error: err?.message || 'Failed to load more' },
          },
        }));
      })
      .finally(() => {
        inFlight.delete(flightKey);
      });

    inFlight.set(flightKey, promise);
    return promise;
  },

  getBucket: (key) => get().buckets[key],

  resetBucket: (key) =>
    set((s) => {
      const next = { ...s.buckets };
      delete next[key];
      return { buckets: next };
    }),
}));
