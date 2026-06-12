import axiosInstance from './axios';
import { ApiResponse } from './categoryApi';

export interface Customer {
  id: string;
  email: string;
  name?: string;
  phone_number?: string;
  mobile_number?: string;
  address?: string;
  billing_address?: string;
  gender?: string;
  dob?: string;
  area_id?: string;
  ntn?: string;
  strn?: string;
  gov_id?: string;
  customer_cat?: string[];
  customer_tags?: string[];
  ref_by?: string;
  ref_contact_number?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  email: string;
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  phone_number?: string;
  mobile_number?: string;
  address?: string;
}

class AuthApi {
  async login(email: string, password: string): Promise<{ user: Customer; token: string }> {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
      '/customer/login',
      { email, password }
    );
    const { token } = response.data.data;
    
    // Store token temporarily to use in next request
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
    
    // After login, fetch full user data
    const userResponse = await axiosInstance.get<ApiResponse<Customer>>('/customer/me');
    const user = userResponse.data.data;
    
    return { user, token };
  }

  async register(data: RegisterData): Promise<{ customer: Customer }> {
    const response = await axiosInstance.post<ApiResponse<{ customer: Customer }>>(
      '/customer/register',
      data
    );
    return response.data.data;
  }

  async getCurrentCustomer(): Promise<Customer> {
    // Use getCustomerById with the ID from token, or fetch from /customer/:id
    // Since there's no /me endpoint, we'll need to get it from the customer ID in the token
    // For now, we'll use a workaround - the backend should add a /me endpoint
    // But we can use the customer ID from the token if available
    const response = await axiosInstance.get<ApiResponse<Customer>>('/customer/me');
    return response.data.data;
  }

  async updateCustomer(data: Partial<Customer>): Promise<Customer> {
    const response = await axiosInstance.put<ApiResponse<Customer>>('/customer', data);
    return response.data.data;
  }

  async logout(): Promise<void> {
    await axiosInstance.post('/customer/logout');
  }
}

export const authApi = new AuthApi();

