import { create } from 'zustand';
import { webApi, WebCategory, WebMeta } from '../api/webApi';

// Categories store
// - `all` mode: cached full active list (for Header mega-menu, Footer, Shop sidebar)
// - `paged` mode: append-on-load-more pages (for Home "Read More")

const TTL_MS = 10 * 60 * 1000;

interface CategoryState {
  // All-categories cache (one shared list)
  all: WebCategory[] | null;
  allLoading: boolean;
  allError: string | null;
  allFetchedAt: number | null;

  // Paged accumulator (Home "Read More")
  pages: WebCategory[];
  pageMeta: WebMeta | null;
  pageLoading: boolean;
  pageError: string | null;

  fetchAll: (force?: boolean) => Promise<WebCategory[]>;
  fetchFirstPage: (limit?: number) => Promise<void>;
  fetchNextPage: (limit?: number) => Promise<void>;
  resetPages: () => void;
}

let inFlightAll: Promise<WebCategory[]> | null = null;
let inFlightPage: Promise<void> | null = null;

export const useWebCategoryStore = create<CategoryState>((set, get) => ({
  all: null,
  allLoading: false,
  allError: null,
  allFetchedAt: null,

  pages: [],
  pageMeta: null,
  pageLoading: false,
  pageError: null,

  fetchAll: async (force = false) => {
    const s = get();
    const fresh = s.allFetchedAt && Date.now() - s.allFetchedAt < TTL_MS;
    if (!force && s.all && fresh) return s.all;
    if (inFlightAll) return inFlightAll;

    set({ allLoading: true, allError: null });
    inFlightAll = webApi
      .getAllCategories()
      .then((data) => {
        set({ all: data, allFetchedAt: Date.now(), allLoading: false });
        return data;
      })
      .catch((err) => {
        set({ allLoading: false, allError: err?.message || 'Failed to load categories' });
        throw err;
      })
      .finally(() => {
        inFlightAll = null;
      });

    return inFlightAll;
  },

  fetchFirstPage: async (limit = 6) => {
    set({ pageLoading: true, pageError: null });
    try {
      const { data, meta } = await webApi.listCategories({ page: 1, limit });
      set({ pages: data, pageMeta: meta, pageLoading: false });
    } catch (err: any) {
      set({ pageLoading: false, pageError: err?.message || 'Failed to load categories' });
    }
  },

  fetchNextPage: async (limit = 6) => {
    if (inFlightPage) return inFlightPage;
    const s = get();
    if (!s.pageMeta) {
      await get().fetchFirstPage(limit);
      return;
    }
    if (s.pageMeta.page >= s.pageMeta.totalPages) return;

    const nextPage = s.pageMeta.page + 1;
    set({ pageLoading: true, pageError: null });

    inFlightPage = webApi
      .listCategories({ page: nextPage, limit: s.pageMeta.limit })
      .then(({ data, meta }) => {
        // Dedupe by id when appending
        const seen = new Set(get().pages.map((c) => c.id));
        const merged = [...get().pages, ...data.filter((c) => !seen.has(c.id))];
        set({ pages: merged, pageMeta: meta, pageLoading: false });
      })
      .catch((err) => {
        set({ pageLoading: false, pageError: err?.message || 'Failed to load more categories' });
      })
      .finally(() => {
        inFlightPage = null;
      });

    return inFlightPage;
  },

  resetPages: () => set({ pages: [], pageMeta: null, pageError: null }),
}));
