import apiClient from '../config';

export interface VisaType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  processingTime: string;
  duration: string;
  requirements: string[];
  eligibleCountries: string[];
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CreateVisaTypeData {
  name: string;
  description?: string;
  price: number;
  processingTime: string;
  duration: string;
  requirements: string[];
  eligibleCountries: string[];
  coverImage?: string;
}

export interface UpdateVisaTypeData {
  name?: string;
  description?: string;
  price?: number;
  processingTime?: string;
  duration?: string;
  requirements?: string[];
  eligibleCountries?: string[];
  coverImage?: string;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const visaTypeService = {
  // Create a new visa type
  createVisaType: async (data: CreateVisaTypeData): Promise<ApiResponse<VisaType>> => {
    const response = await apiClient.post<ApiResponse<VisaType>>('/visas/types', data, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Get all visa types
  getAllVisaTypes: async (): Promise<ApiResponse<VisaType[]>> => {
    const response = await apiClient.get<ApiResponse<VisaType[]>>('/visas/types');
    return response.data;
  },

  // Get visa type by ID
  getVisaTypeById: async (id: string): Promise<ApiResponse<VisaType>> => {
    const response = await apiClient.get<ApiResponse<VisaType>>(`/visas/types/${id}`);
    return response.data;
  },

  // Get visa type by slug
  getVisaTypeBySlug: async (slug: string): Promise<ApiResponse<VisaType>> => {
    const response = await apiClient.get<ApiResponse<VisaType>>(`/visas/types/slug/${slug}`);
    return response.data;
  },

  // Update visa type
  updateVisaType: async (id: string, data: UpdateVisaTypeData): Promise<ApiResponse<VisaType>> => {
    const response = await apiClient.put<ApiResponse<VisaType>>(`/visas/types/${id}`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Delete visa type
  deleteVisaType: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/visas/types/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};
