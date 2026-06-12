import axiosInstance from './axios';
import { ApiResponse } from './categoryApi';

export interface ProductImage {
  image: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  code: string;
  description?: string;
  short_description?: string;
  price?: number; // Legacy field
  cost_price?: number;
  selling_price?: number; // Legacy field
  originalPrice?: number; // Calculated field for display
  // Actual API fields
  sales_rate_exc_dis_and_tax?: string | number;
  sales_rate_inc_dis_and_tax?: string | number;
  purchase_rate?: string | number;
  discount_amount?: string | number;
  discount?: number;
  is_active: boolean;
  is_featured?: boolean;
  category_id?: string;
  subcategory_id?: string;
  brand_id?: string;
  supplier_id?: string;
  color_id?: string;
  size_id?: string;
  tax_id?: string;
  ProductImage?: ProductImage[];
  has_images?: boolean;
  image?: string; // For convenience - first image from ProductImage
  category?: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
  brand?: {
    id: string;
    name: string;
  };
  unit?: {
    id: string;
    name: string;
  };
  stock?: number;
  current_stock?: number;
  rating?: number;
  reviews?: number;
  features?: string[];
  nutrition?: string[];
  longDescription?: string;
  weight?: string;
  origin?: string;
  created_at: string;
  updated_at: string;
}

export interface HomeDataResponse {
  featuredProducts: Product[];
  bestSellingProducts: Product[];
  categories: any[];
}

class ProductApi {
  /**
   * Get home data including featured products, best selling products, and categories
   */
  async getHomeData(): Promise<HomeDataResponse> {
    const response = await axiosInstance.get<ApiResponse<HomeDataResponse>>('/customer/app');
    return response.data.data;
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(): Promise<Product[]> {
    const response = await axiosInstance.get<ApiResponse<HomeDataResponse>>('/customer/app');
    const homeData = response.data.data as HomeDataResponse;
    return homeData.featuredProducts || [];
  }

  /**
   * Get best selling products
   */
  async getBestSellingProducts(): Promise<Product[]> {
    const response = await axiosInstance.get<ApiResponse<HomeDataResponse>>('/customer/app');
    const homeData = response.data.data as HomeDataResponse;
    return homeData.bestSellingProducts || [];
  }

  /**
   * Search products by name
   */
  async searchProducts(query: string): Promise<Product[]> {
    const response = await axiosInstance.get<ApiResponse<Product[]>>('/customer/app/products', {
      params: { search: query },
    });
    return response.data.data || [];
  }

  /**
   * Get product by ID
   * Uses list endpoint to ensure full relations (unit, category, brand) are included,
   * since the direct /products/:id endpoint may omit nested relations.
   */
  async getProductById(id: string): Promise<Product> {
    // First try the list endpoint which always includes full relations (unit, category, etc.)
    try {
      const listResponse = await axiosInstance.get<ApiResponse<Product[]>>('/customer/app/products', {
        params: { limit: 1000 },
      });
      const products = listResponse.data.data || [];
      const fullProduct = products.find(p => p.id === id);
      if (fullProduct) return fullProduct;
    } catch (e) {
      // List endpoint failed, fall back to direct endpoint
    }

    // Fallback: direct endpoint (may not include unit/category relations)
    const response = await axiosInstance.get<ApiResponse<Product>>(`/customer/app/products/${id}`);
    return response.data.data;
  }

  /**
   * List products with pagination and filters
   * Uses public search endpoint with limit parameter to fetch all products
   */
  async listProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: string;
    subcategory_id?: string;
    is_active?: boolean;
    display_on_pos?: boolean;
    branch_id?: string;
    fetch_all?: boolean;
  }): Promise<{ data: Product[]; meta: any }> {
    const searchQuery = params?.search || '';
    
    // If fetch_all is true, request a high limit (1000) to get all products
    // Backend now supports limit parameter
    const requestLimit = params?.fetch_all ? 1000 : (params?.limit || 10);
    
    const response = await axiosInstance.get<ApiResponse<Product[]>>('/customer/app/products', {
      params: {
        search: searchQuery,
        limit: requestLimit,
      },
    });
    
    let allProducts = response.data.data || [];
    
    // Apply filters client-side since backend search doesn't support all filters
    let filteredProducts = allProducts;
    if (params?.category_id) {
      filteredProducts = filteredProducts.filter(p => p.category_id === params.category_id);
    }
    if (params?.is_active !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.is_active === params.is_active);
    }
    
    // Apply pagination if not fetching all
    if (!params?.fetch_all) {
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      filteredProducts = filteredProducts.slice(startIndex, endIndex);
    }
    
    return {
      data: filteredProducts,
      meta: {
        total: filteredProducts.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(filteredProducts.length / (params?.limit || 10)),
      },
    };
  }

  /**
   * Get products by category slug
   */
  async getProductsByCategory(categorySlug: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<Product[]> {
    // Get all products and filter by category
    const result = await this.listProducts({
      ...params,
      fetch_all: true,
    });
    
    // Filter by category name matching slug
    const categoryName = categorySlug.replace(/-/g, ' ');
    return result.data.filter(p => {
      const productCategory = p.category?.name || '';
      return productCategory.toLowerCase().includes(categoryName.toLowerCase()) ||
             productCategory.toLowerCase().replace(/\s+/g, '-') === categorySlug;
    });
  }
}

export const productApi = new ProductApi();

