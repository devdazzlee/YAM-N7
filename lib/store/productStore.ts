import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '../api/productApi';
import { productApi } from '../api/productApi';

interface ProductState {
  // Cache for products by ID
  productsCache: Map<string, Product>;
  // Cache for product lists (search results, category products, etc.)
  productsListCache: Map<string, Product[]>;
  // Loading states
  loadingProducts: Set<string>;
  // Prefetch queue
  prefetchQueue: Set<string>;
  
  // Get product from cache
  getProduct: (id: string) => Product | null;
  
  // Get or fetch product (returns cached if available, fetches if not)
  getOrFetchProduct: (id: string) => Promise<Product>;
  
  // Prefetch product (fetch in background)
  prefetchProduct: (id: string) => Promise<void>;
  
  // Cache product
  cacheProduct: (product: Product) => void;
  
  // Cache product list
  cacheProductList: (key: string, products: Product[]) => void;
  
  // Get product list from cache
  getProductList: (key: string) => Product[] | null;
  
  // Clear cache
  clearCache: () => void;
}

// Helper to convert Map to/from plain object for persistence
const mapToObject = <K extends string, V>(map: Map<K, V>): Record<K, V> => {
  const obj = {} as Record<K, V>;
  map.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
};

const objectToMap = <K extends string, V>(obj: Record<K, V>): Map<K, V> => {
  const map = new Map<K, V>();
  Object.entries(obj).forEach(([key, value]) => {
    map.set(key as K, value as V);
  });
  return map;
};

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      productsCache: new Map(),
      productsListCache: new Map(),
      loadingProducts: new Set(),
      prefetchQueue: new Set(),

  getProduct: (id: string) => {
    return get().productsCache.get(id) || null;
  },

  getOrFetchProduct: async (id: string) => {
    const state = get();
    
    // Return cached product immediately if available
    const cached = state.productsCache.get(id);
    if (cached) {
      // Always fetch fresh data in background to keep cache updated
      // (force=true bypasses the "already cached" skip)
      productApi.getProductById(id).then((fresh) => {
        get().cacheProduct(fresh);
      }).catch(() => {});
      return cached;
    }
    
    // Check if already loading
    if (state.loadingProducts.has(id)) {
      // Wait for existing request
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          const cached = get().productsCache.get(id);
          if (cached) {
            clearInterval(checkInterval);
            resolve(cached);
          }
        }, 50);
      });
    }
    
    // Mark as loading
    set((state) => ({
      loadingProducts: new Set(state.loadingProducts).add(id),
    }));
    
    try {
      // Fetch product
      const product = await productApi.getProductById(id);
      
      // Cache it
      get().cacheProduct(product);
      
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    } finally {
      // Remove from loading set
      set((state) => {
        const newSet = new Set(state.loadingProducts);
        newSet.delete(id);
        return { loadingProducts: newSet };
      });
    }
  },

  prefetchProduct: async (id: string) => {
    const state = get();
    
    // Skip if already cached or loading
    if (state.productsCache.has(id) || state.loadingProducts.has(id) || state.prefetchQueue.has(id)) {
      return;
    }
    
    // Add to prefetch queue
    set((state) => ({
      prefetchQueue: new Set(state.prefetchQueue).add(id),
    }));
    
    try {
      const product = await productApi.getProductById(id);
      get().cacheProduct(product);
    } catch (error) {
      console.warn('Prefetch failed for product:', id, error);
    } finally {
      // Remove from prefetch queue
      set((state) => {
        const newSet = new Set(state.prefetchQueue);
        newSet.delete(id);
        return { prefetchQueue: newSet };
      });
    }
  },

  cacheProduct: (product: Product) => {
    set((state) => {
      const newCache = new Map(state.productsCache);
      newCache.set(product.id, product);
      return { productsCache: newCache };
    });
  },

  cacheProductList: (key: string, products: Product[]) => {
    set((state) => {
      const newCache = new Map(state.productsListCache);
      newCache.set(key, products);
      return { productsListCache: newCache };
    });
    
    // Also cache individual products
    products.forEach((product) => {
      get().cacheProduct(product);
    });
  },

  getProductList: (key: string) => {
    return get().productsListCache.get(key) || null;
  },

  clearCache: () => {
    set({
      productsCache: new Map(),
      productsListCache: new Map(),
      loadingProducts: new Set(),
      prefetchQueue: new Set(),
    });
  },
    }),
    {
      name: 'product-cache-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist cache, not loading states
        productsCache: mapToObject(state.productsCache),
        productsListCache: mapToObject(state.productsListCache),
      }),
      onRehydrateStorage: () => (state) => {
        // Convert back to Maps after rehydration
        if (state) {
          state.productsCache = objectToMap(state.productsCache as any);
          state.productsListCache = objectToMap(state.productsListCache as any);
        }
      },
    }
  )
);

