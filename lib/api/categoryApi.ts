import axiosInstance from './axios';

export interface CategoryImage {
  image: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  code: string;
  description?: string;
  is_active: boolean;
  branch_id?: string;
  CategoryImages?: CategoryImage[];
  image?: string; // For convenience - first image from CategoryImages
  product_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  success?: boolean;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface HomeDataResponse {
  featuredProducts: any[];
  bestSellingProducts: any[];
  categories: Category[];
}

class CategoryApi {
  /**
   * Get home data including categories, featured products, and best selling products
   */
  async getHomeData(): Promise<HomeDataResponse> {
    const response = await axiosInstance.get<ApiResponse<HomeDataResponse>>('/customer/app');
    return response.data.data;
  }

  /**
   * Get all active categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await axiosInstance.get<ApiResponse<Category[]>>('/customer/app/categories');
    return response.data.data || [];
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<Category> {
    const response = await axiosInstance.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data;
  }

  /**
   * List categories with pagination and filters
   */
  async listCategories(params?: {
    page?: number;
    limit?: number;
    search?: string;
    is_active?: boolean;
    branch_id?: string;
  }): Promise<{ data: Category[]; meta: any }> {
    const response = await axiosInstance.get<ApiResponse<Category[]>>('/categories', {
      params,
    });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  }
}

export const categoryApi = new CategoryApi();

