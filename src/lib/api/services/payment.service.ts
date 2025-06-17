import apiClient from '../config';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentIntentResponse {
  success: boolean;
  data: {
    clientSecret: string;
    paymentId: string;
  };
}

interface PaymentStatus {
  id: string;
  amount: number;
  currency: string;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  stripePaymentId: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentStatusResponse {
  success: boolean;
  data: PaymentStatus;
}

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const paymentService = {
  // Create payment intent
  createPaymentIntent: async (applicationId: string, amount: number): Promise<PaymentIntentResponse> => {
    const response = await apiClient.post<PaymentIntentResponse>(
      `/payment/${applicationId}/create-intent`,
      { amount },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Update payment status
  updatePaymentStatus: async (paymentId: string, stripePaymentId: string): Promise<PaymentStatusResponse> => {
    const response = await apiClient.post<PaymentStatusResponse>(
      `/payment/${paymentId}/update-status`,
      { stripePaymentId },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (paymentId: string): Promise<PaymentStatusResponse> => {
    const response = await apiClient.get<PaymentStatusResponse>(
      `/payment/${paymentId}/status`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Get Stripe instance
  getStripe: () => stripePromise,
};
