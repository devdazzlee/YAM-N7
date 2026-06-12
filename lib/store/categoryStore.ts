import { create } from 'zustand';
import { Category } from '../api/categoryApi';
import { categoryApi } from '../api/categoryApi';

let inFlightCategoriesRequest: Promise<Category[]> | null = null;

interface CategoryState {
  // Cache for categories
  categoriesCache: Category[] | null;
  // Loading state
  loading: boolean;
  // Last fetch timestamp
  lastFetch: number | null;
  // Cache expiry time (5 minutes)
  cacheExpiry: number;
  
  // Get categories from cache or fetch
  getCategories: (forceRefresh?: boolean) => Promise<Category[]>;
  
  // Clear cache
  clearCache: () => void;
}

export const useCategoryStore = create<CategoryState>()((set, get) => ({
  categoriesCache: null,
  loading: false,
  lastFetch: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes

  getCategories: async (forceRefresh = false) => {
    const state = get();
    
    // Return cached categories if still valid and not forcing refresh
    if (!forceRefresh && state.categoriesCache && state.lastFetch) {
      const now = Date.now();
      const isExpired = now - state.lastFetch > state.cacheExpiry;
      const hasCachedCategories = state.categoriesCache.length > 0;
      
      if (!isExpired && hasCachedCategories) {
        // Return cached data immediately.
        // Do not auto-refresh in background to avoid duplicate API hits.
        return state.categoriesCache;
      }
    }
    
    // Reuse in-flight request so multiple components share one API call.
    if (inFlightCategoriesRequest) {
      return inFlightCategoriesRequest;
    }
    
    // Mark as loading
    set({ loading: true });
    
    inFlightCategoriesRequest = categoryApi.getCategories()
      .then((categories) => {
        set({
          categoriesCache: categories,
          lastFetch: Date.now(),
        });
        return categories;
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        if (state.categoriesCache) {
          return state.categoriesCache;
        }
        throw error;
      })
      .finally(() => {
        inFlightCategoriesRequest = null;
        set({ loading: false });
      });

    return inFlightCategoriesRequest;
  },

  clearCache: () => {
    set({
      categoriesCache: null,
      lastFetch: null,
      loading: false,
    });
  },
}));

