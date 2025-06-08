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
    const response = await apiClient.get<GetUserProfileResponse>('/users/profile', {
      headers: getAuthHeader()
    });
    return response.data;
  },
  updateProfile: async (data: UpdateProfileData): Promise<GetUserProfileResponse> => {
    const response = await apiClient.put<GetUserProfileResponse>('/users/profile', data, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  updateAvatar: async (data: UpdateAvatarData): Promise<GetUserProfileResponse> => {
    const response = await apiClient.put<GetUserProfileResponse>('/users/avatar', data, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  getAllUsers: async (): Promise<GetUserProfileResponse> => {
    const response = await apiClient.get('/users', {
      headers: getAuthHeader()
    });
    return response.data;
  },
  getUserById: async (userId: string): Promise<GetUserProfileResponse> => {
    const response = await apiClient.get(`/users/${userId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  createOfficer: async (data: CreateOfficerDto): Promise<GetUserProfileResponse> => {
    const response = await apiClient.post('/users/officer', data, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  updateUser: async (userId: string, data: UpdateUserDto): Promise<GetUserProfileResponse> => {
    const response = await apiClient.put(`/users/${userId}`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  deleteUser: async (userId: string): Promise<GetUserProfileResponse> => {
    const response = await apiClient.delete(`/users/${userId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },  
  updateOfficerPermissions: async (officerId: string, permissions: string[]): Promise<GetUserProfileResponse> => {
    const response = await apiClient.put(`/users/officer/${officerId}/permissions`, { permissions }, {
      headers: getAuthHeader()
    });
    return response.data;
  }
}; 