/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "../config";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'OFFICER' | 'APPLICANT';
  isActive: boolean;
  permissions: string[];
  createdAt: string;
  lastActive?: string;
  department?: string;
  title?: string;
  avatar?: string;
  phone?: string;
}

export interface GetUserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile
}

export interface UpdateProfileData {
  name: string;
  phone: string;
  email: string;
  department?: string;
}

export interface UpdateAvatarData {
  avatarUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'OFFICER' | 'APPLICANT';
  isActive: boolean;
  permissions: string[];
  createdAt: string;
  lastActive?: string;
  department?: string;
  title?: string;
  avatar?: string;
  phone?: string;
}

export interface CreateOfficerDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
  department?: string;
  title?: string;
}

export interface UpdateUserDto {
  name?: string;
  role?: 'ADMIN' | 'OFFICER';
  phone?: string;
  email?: string;
  department?: string;
  title?: string;
  permissions?: string[];
  isActive?: boolean;
}

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const userService = {
  getProfile: async (): Promise<GetUserProfileResponse> => {
    let response;
    try {
      response = await apiClient.get<GetUserProfileResponse>('/users/profile', {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },
  updateProfile: async (data: UpdateProfileData): Promise<GetUserProfileResponse> => {
    let response;
    try {
      response = await apiClient.put<GetUserProfileResponse>('/users/profile', data, {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },
  updateAvatar: async (data: UpdateAvatarData): Promise<GetUserProfileResponse> => {
    let response;
    try {
      response = await apiClient.put<GetUserProfileResponse>('/users/avatar', data, {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },
  getAllUsers: async (): Promise<GetUserProfileResponse> => {
    let response;
    try {
      response = await apiClient.get('/users', {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },
  getUserById: async (userId: string): Promise<GetUserProfileResponse> => {
    let response;
    try {
      response = await apiClient.get(`/users/${userId}`, {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },
  createOfficer: async (data: CreateOfficerDto): Promise<GetUserProfileResponse> => {
    let response;
    try {
      response = await apiClient.post('/users/officer', data, {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },
  updateUser: async (userId: string, data: UpdateUserDto): Promise<GetUserProfileResponse> => {
    let response;
    try {
      response = await apiClient.put(`/users/${userId}`, data, {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },
  deleteUser: async (userId: string): Promise<GetUserProfileResponse> => {
    let response;
    try {
      response = await apiClient.delete(`/users/${userId}`, {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },  
  updateOfficerPermissions: async (officerId: string, permissions: string[]): Promise<GetUserProfileResponse> => {
    let response;
    try {
      response = await apiClient.put(`/users/officer/${officerId}/permissions`, { permissions }, {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  }
}; 