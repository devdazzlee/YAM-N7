import { create } from 'zustand';
import { webApi, WebProductDetail } from '../api/webApi';

// LRU-ish product detail cache. We cap to MAX entries so a long browsing session
// can't grow memory unbounded.

const MAX_CACHED = 50;
const TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  product: WebProductDetail;
  fetchedAt: number;
}

interface State {
  cache: Record<string, CacheEntry>;
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  getOrFetch: (id: string) => Promise<WebProductDetail>;
  prefetch: (id: string) => Promise<void>;
  invalidate: (id: string) => void;
}

const inFlight = new Map<string, Promise<WebProductDetail>>();

function evictIfFull(cache: Record<string, CacheEntry>): Record<string, CacheEntry> {
  const keys = Object.keys(cache);
  if (keys.length <= MAX_CACHED) return cache;
  const sorted = keys
    .map((k) => ({ k, t: cache[k].fetchedAt }))
    .sort((a, b) => a.t - b.t);
  const drop = sorted.slice(0, keys.length - MAX_CACHED).map((e) => e.k);
  const next = { ...cache };
  for (const k of drop) delete next[k];
  return next;
}

export const useWebProductDetailStore = create<State>((set, get) => ({
  cache: {},
  loading: {},
  errors: {},

  getOrFetch: async (id: string) => {
    const cached = get().cache[id];
    if (cached && Date.now() - cached.fetchedAt < TTL_MS) {
      return cached.product;
    }
    if (inFlight.has(id)) return inFlight.get(id)!;

    set((s) => ({ loading: { ...s.loading, [id]: true }, errors: { ...s.errors, [id]: null } }));

    const promise = webApi
      .getProductById(id)
      .then((product) => {
        set((s) => ({
          cache: evictIfFull({ ...s.cache, [id]: { product, fetchedAt: Date.now() } }),
          loading: { ...s.loading, [id]: false },
        }));
        return product;
      })
      .catch((err) => {
        set((s) => ({
          loading: { ...s.loading, [id]: false },
          errors: { ...s.errors, [id]: err?.message || 'Failed to load product' },
        }));
        throw err;
      })
      .finally(() => {
        inFlight.delete(id);
      });

    inFlight.set(id, promise);
    return promise;
  },

  prefetch: async (id: string) => {
    if (get().cache[id] || inFlight.has(id)) return;
    try {
      await get().getOrFetch(id);
    } catch {
      // Prefetch is best-effort
    }
  },

  invalidate: (id: string) =>
    set((s) => {
      const next = { ...s.cache };
      delete next[id];
      return { cache: next };
    }),
}));
