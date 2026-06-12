import axiosInstance from './axios';
import { ApiResponse } from './categoryApi';

export interface Unit {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
  display_on_pos: boolean;
  created_at: string;
}

class UnitApi {
  /**
   * Get unit by ID
   */
  async getUnitById(id: string): Promise<Unit> {
    const response = await axiosInstance.get<ApiResponse<Unit>>(`/units/${id}`);
    return response.data.data;
  }

  /**
   * List all units
   */
  async listUnits(): Promise<Unit[]> {
    const response = await axiosInstance.get<ApiResponse<Unit[]>>('/units', {
      params: { limit: 1000 }, // Get all units
    });
    return response.data.data || [];
  }
}

export const unitApi = new UnitApi();

