import { create } from 'zustand';
import { webApi, WebHomePayload } from '../api/webApi';

// Stores the bundled /web/home payload. One request per (featured/best/category limits)
// signature, deduped + TTL-cached so revisiting Home does not refetch.

const TTL_MS = 5 * 60 * 1000;

interface HomeState {
  data: WebHomePayload | null;
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  signature: string | null;
  fetch: (opts?: { featuredLimit?: number; bestLimit?: number; categoriesLimit?: number; force?: boolean }) => Promise<WebHomePayload>;
  reset: () => void;
}

let inFlight: Promise<WebHomePayload> | null = null;

const sig = (o: { featuredLimit?: number; bestLimit?: number; categoriesLimit?: number }) =>
  `f${o.featuredLimit ?? 8}:b${o.bestLimit ?? 8}:c${o.categoriesLimit ?? 6}`;

export const useWebHomeStore = create<HomeState>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  lastFetch: null,
  signature: null,

  fetch: async (opts = {}) => {
    const signature = sig(opts);
    const state = get();
    const fresh = state.lastFetch && Date.now() - state.lastFetch < TTL_MS;

    if (!opts.force && state.data && state.signature === signature && fresh) {
      return state.data;
    }

    if (inFlight) return inFlight;

    set({ loading: true, error: null });

    inFlight = webApi
      .getHome({
        featuredLimit: opts.featuredLimit ?? 8,
        bestLimit: opts.bestLimit ?? 8,
        categoriesLimit: opts.categoriesLimit ?? 6,
      })
      .then((data) => {
        set({ data, signature, lastFetch: Date.now(), loading: false });
        return data;
      })
      .catch((err) => {
        set({ loading: false, error: err?.message || 'Failed to load home data' });
        throw err;
      })
      .finally(() => {
        inFlight = null;
      });

    return inFlight;
  },

  reset: () => set({ data: null, loading: false, error: null, lastFetch: null, signature: null }),
}));
