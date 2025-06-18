/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '../config';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: string;
  phone: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  code: string;
  data: {
    token: string;
    refreshToken: string;
    user: {
      email: string;
      name: string;
      role: string;
      permissions: string[];
    };
  };
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    let response;
    try {
      response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      if (response.data.data.token) {
        localStorage.setItem('access_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterData) => {
    let response;
    try {
      response = await apiClient.post('/auth/signup', userData);
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (email: string, otp: string) => {
    let response;
    try {
      response = await apiClient.post('/auth/verify-otp', { email, otp });
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },

  // Resend OTP
  resendOTP: async (email: string) => {
    let response;
    try {
      response = await apiClient.post(`/auth/resend-otp?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },

  // Request password reset
  requestPasswordReset: async (email: string) => {
    let response;
    try {
      response = await apiClient.post('/auth/request-password-reset', { email });
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },

  // Confirm password reset
  confirmPasswordReset: async (token: string, newPassword: string) => {
    let response;
    try {
      response = await apiClient.post('/auth/confirm-password-reset', {
        token,
        newPassword,
      });
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      // Call the logout endpoint to clear the refresh token cookie
      const response = await apiClient.post('/auth/logout');
      if (response.status === 200) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
      return true;
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      console.error('Logout failed:', error);
      return false;
    }
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/auth/refresh');
      if (response.data.data.token) {
        localStorage.setItem('access_token', response.data.data.token);
      }
      return response.data;
    } catch (error) {
      // If refresh fails, logout the user
      await authService.logout();
      throw error;
    }
  },
}; 