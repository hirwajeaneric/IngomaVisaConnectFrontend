/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '../config';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export interface Payment {
  id: string;
  applicationId: string;
  applicant: string;
  applicantEmail: string;
  amount: number;
  currency: string;
  date: string;
  method: string;
  status: string;
  visaType: string;
}

export interface PaymentDetail {
  id: string;
  applicationId: string;
  applicant: {
    name: string;
    email: string;
    phone: string;
  };
  amount: number;
  currency: string;
  date: string;
  method: string;
  status: string;
  stripePaymentId: string;
  application: {
    id: string;
    applicationNumber: string;
    status: string;
    submissionDate: string;
    visaType: {
      name: string;
      price: number;
    };
  };
  cardDetails: {
    type: string;
    last4: string;
    expiry: string;
  } | null;
  items: Array<{
    description: string;
    amount: number;
  }>;
  billingAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  transactionId: string;
  paymentProcessor: string;
}

export interface PaymentStats {
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  revenueChange: number;
  transactionChange: number;
  currentMonthTransactions: number;
  previousMonthTransactions: number;
}

export interface MonthlyRevenueData {
  month: string;
  revenue: number;
}

export interface MonthlyRevenueResponse {
  success: boolean;
  data: MonthlyRevenueData[];
}

export interface PaymentListResponse {
  success: boolean;
  data: {
    payments: Payment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface PaymentDetailResponse {
  success: boolean;
  data: PaymentDetail;
}

export interface PaymentStatsResponse {
  success: boolean;
  data: PaymentStats;
}

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const paymentService = {
  getAllPayments: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PaymentListResponse> => {
    let response;
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.search) queryParams.append('search', params.search);

      const url = `/payments/admin/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      response = await apiClient.get<PaymentListResponse>(url, {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response?.data || { message: 'Failed to fetch payments' };
      throw new Error(message);
    }
    return response.data;
  },

  getPaymentById: async (paymentId: string): Promise<PaymentDetailResponse> => {
    let response;
    try {
      response = await apiClient.get<PaymentDetailResponse>(`/payments/admin/${paymentId}`, {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response?.data || { message: 'Failed to fetch payment details' };
      throw new Error(message);
    }
    return response.data;
  },

  getPaymentStats: async (): Promise<PaymentStatsResponse> => {
    let response;
    try {
      response = await apiClient.get<PaymentStatsResponse>('/payments/admin/stats', {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response?.data || { message: 'Failed to fetch payment statistics' };
      throw new Error(message);
    }
    return response.data;
  },

  getMonthlyRevenue: async (year?: number): Promise<MonthlyRevenueResponse> => {
    let response;
    try {
      const queryParams = new URLSearchParams();
      if (year) queryParams.append('year', year.toString());

      const url = `/payments/admin/monthly-revenue${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      response = await apiClient.get<MonthlyRevenueResponse>(url, {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response?.data || { message: 'Failed to fetch monthly revenue data' };
      throw new Error(message);
    }
    return response.data;
  },

  getPaymentStatus: async (paymentId: string): Promise<any> => {
    let response;
    try {
      response = await apiClient.get(`/payments/${paymentId}/status`, {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response?.data || { message: 'Failed to fetch payment status' };
      throw new Error(message);
    }
    return response.data;
  },

  // Create payment intent
  createPaymentIntent: async (applicationId: string, amount: number): Promise<any> => {
    let response;
    try {
      response = await apiClient.post<any>(
        `/payments/${applicationId}/create-intent`,
        { amount },
        { headers: getAuthHeader() }
      );
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },

  // Update payment status
  updatePaymentStatus: async (paymentId: string, stripePaymentId: string): Promise<any> => {
    let response;
    try {
      response = await apiClient.post<any>(
        `/payments/${paymentId}/update-status`,
        { stripePaymentId },
        { headers: getAuthHeader() }
      );
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },

  // Get Stripe instance
  getStripe: () => stripePromise,
};
