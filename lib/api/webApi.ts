import axiosInstance from './axios';

// ─────────────────────────────────────────────────────────────────────────────
// Types — match the shape returned by Backend /api/v1/web/* endpoints.
// Prisma `Decimal` fields serialize to string in JSON, so price-like fields are
// coerced to number at this boundary. Components consume plain `number`s.
// ─────────────────────────────────────────────────────────────────────────────

export interface WebMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  sort?: string;
}

export interface WebCategory {
  id: string;
  name: string;
  slug: string;
  code: string;
  is_active: boolean;
  image: string | null;
  product_count: number;
}

export interface WebProduct {
  id: string;
  name: string;
  code: string;
  sku: string;
  description: string | null;
  price: number;
  base_price: number;
  discount_amount: number;
  original_price?: number;
  is_featured: boolean;
  is_active: boolean;
  category_id: string;
  category: { id: string; name: string; slug: string } | null;
  unit: { id: string; name: string } | null;
  image: string | null;
  images: string[];
  created_at: string;
}

export interface WebProductDetail extends WebProduct {
  tax: { id: string; name: string; percentage: number | string } | null;
  brand: { id: string; name: string } | null;
  subcategory: { id: string; name: string } | null;
  in_stock: boolean;
  available_stock: number;
}

export interface WebHomePayload {
  featuredProducts: WebProduct[];
  bestSellingProducts: WebProduct[];
  categories: WebCategory[];
  product_count: number;
  featured_total: number;
  categories_total: number;
}

export type WebSort = 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string; // slug
  category_id?: string;
  subcategory_id?: string;
  min_price?: number;
  max_price?: number;
  sort?: WebSort;
  featured?: boolean;
}

export interface WebSearchSuggestion {
  id: string;
  name: string;
  price: number;
  category: { id: string; name: string; slug: string } | null;
  image: string | null;
}

interface RawApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: WebMeta;
}

const toNumber = (v: unknown, fallback = 0): number => {
  if (v === null || v === undefined || v === '') return fallback;
  const n = typeof v === 'string' ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? n : fallback;
};

const shapeProduct = (raw: any): WebProduct => {
  const price = toNumber(raw.price);
  const discount = toNumber(raw.discount_amount);
  return {
    id: String(raw.id),
    name: raw.name,
    code: raw.code,
    sku: raw.sku,
    description: raw.description ?? null,
    price,
    base_price: toNumber(raw.base_price),
    discount_amount: discount,
    original_price: discount > 0 && price > 0 ? price + discount : undefined,
    is_featured: !!raw.is_featured,
    is_active: !!raw.is_active,
    category_id: raw.category_id,
    category: raw.category ?? null,
    unit: raw.unit ?? null,
    image: raw.image ?? null,
    images: Array.isArray(raw.images) ? raw.images : [],
    created_at: raw.created_at,
  };
};

const shapeCategory = (raw: any): WebCategory => ({
  id: String(raw.id),
  name: raw.name,
  slug: raw.slug,
  code: raw.code,
  is_active: !!raw.is_active,
  image: raw.image ?? null,
  product_count: toNumber(raw.product_count),
});

const shapeProductDetail = (raw: any): WebProductDetail => ({
  ...shapeProduct(raw),
  tax: raw.tax ?? null,
  brand: raw.brand ?? null,
  subcategory: raw.subcategory ?? null,
  in_stock: !!raw.in_stock,
  available_stock: toNumber(raw.available_stock),
});

// ─────────────────────────────────────────────────────────────────────────────

class WebApi {
  async getHome(opts: { featuredLimit?: number; bestLimit?: number; categoriesLimit?: number } = {}): Promise<WebHomePayload> {
    const params: Record<string, number> = {};
    if (opts.featuredLimit) params.featured_limit = opts.featuredLimit;
    if (opts.bestLimit) params.best_limit = opts.bestLimit;
    if (opts.categoriesLimit) params.categories_limit = opts.categoriesLimit;

    const res = await axiosInstance.get<RawApiEnvelope<any>>('/web/home', { params });
    const data = res.data.data;
    return {
      featuredProducts: (data.featuredProducts || []).map(shapeProduct),
      bestSellingProducts: (data.bestSellingProducts || []).map(shapeProduct),
      categories: (data.categories || []).map(shapeCategory),
      product_count: toNumber(data.product_count),
      featured_total: toNumber(data.featured_total),
      categories_total: toNumber(data.categories_total),
    };
  }

  async listCategories(opts: { page?: number; limit?: number; search?: string } = {}): Promise<{ data: WebCategory[]; meta: WebMeta }> {
    const res = await axiosInstance.get<RawApiEnvelope<any[]>>('/web/categories', { params: opts });
    return {
      data: (res.data.data || []).map(shapeCategory),
      meta: res.data.meta as WebMeta,
    };
  }

  async getAllCategories(): Promise<WebCategory[]> {
    const res = await axiosInstance.get<RawApiEnvelope<any[]>>('/web/categories/all');
    return (res.data.data || []).map(shapeCategory);
  }

  async getCategoryBySlug(
    slug: string,
    opts: { page?: number; limit?: number; sort?: WebSort } = {}
  ): Promise<{ category: WebCategory; products: WebProduct[]; meta: WebMeta }> {
    const res = await axiosInstance.get<RawApiEnvelope<any>>(`/web/categories/${encodeURIComponent(slug)}`, {
      params: opts,
    });
    const d = res.data.data;
    return {
      category: shapeCategory(d.category),
      products: (d.products || []).map(shapeProduct),
      meta: d.meta as WebMeta,
    };
  }

  async listProducts(params: ProductListParams = {}): Promise<{ data: WebProduct[]; meta: WebMeta }> {
    const res = await axiosInstance.get<RawApiEnvelope<any[]>>('/web/products', { params });
    return {
      data: (res.data.data || []).map(shapeProduct),
      meta: res.data.meta as WebMeta,
    };
  }

  async getProductById(id: string): Promise<WebProductDetail> {
    const res = await axiosInstance.get<RawApiEnvelope<any>>(`/web/products/${encodeURIComponent(id)}`);
    return shapeProductDetail(res.data.data);
  }

  async suggest(q: string, limit = 8): Promise<WebSearchSuggestion[]> {
    if (!q || q.trim().length < 2) return [];
    const res = await axiosInstance.get<RawApiEnvelope<any[]>>('/web/search/suggest', {
      params: { q, limit },
    });
    return (res.data.data || []).map((r) => ({
      id: String(r.id),
      name: r.name,
      price: toNumber(r.price),
      category: r.category ?? null,
      image: r.image ?? null,
    }));
  }

  async getProductCount(): Promise<number> {
    const res = await axiosInstance.get<RawApiEnvelope<{ count: number }>>('/web/meta/product-count');
    return toNumber(res.data.data?.count);
  }
}

export const webApi = new WebApi();
