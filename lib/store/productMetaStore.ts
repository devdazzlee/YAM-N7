import { create } from 'zustand';
import { productApi } from '../api/productApi';

interface ProductMetaState {
  productCount: number | null;
  loading: boolean;
  lastFetch: number | null;
  cacheExpiry: number;
  getProductCount: (forceRefresh?: boolean) => Promise<number>;
}

let inFlightProductCountRequest: Promise<number> | null = null;

export const useProductMetaStore = create<ProductMetaState>()((set, get) => ({
  productCount: null,
  loading: false,
  lastFetch: null,
  cacheExpiry: 5 * 60 * 1000,

  getProductCount: async (forceRefresh = false) => {
    const state = get();

    if (!forceRefresh && state.productCount !== null && state.lastFetch) {
      const isExpired = Date.now() - state.lastFetch > state.cacheExpiry;
      if (!isExpired) {
        return state.productCount;
      }
    }

    if (inFlightProductCountRequest) {
      return inFlightProductCountRequest;
    }

    set({ loading: true });

    inFlightProductCountRequest = productApi
      .listProducts({ fetch_all: true, search: '' })
      .then((result) => {
        const count = typeof result.meta?.total === 'number' ? result.meta.total : result.data.length;
        set({
          productCount: count,
          lastFetch: Date.now(),
        });
        return count;
      })
      .catch((error) => {
        console.error('Error fetching product count:', error);
        if (state.productCount !== null) {
          return state.productCount;
        }
        throw error;
      })
      .finally(() => {
        inFlightProductCountRequest = null;
        set({ loading: false });
      });

    return inFlightProductCountRequest;
  },
}));
