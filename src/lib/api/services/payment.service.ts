/* eslint-disable @typescript-eslint/no-explicit-any */
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
    let response;
    try {
      response = await apiClient.post<PaymentIntentResponse>(
        `/payment/${applicationId}/create-intent`,
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
  updatePaymentStatus: async (paymentId: string, stripePaymentId: string): Promise<PaymentStatusResponse> => {
    let response;
    try {
      response = await apiClient.post<PaymentStatusResponse>(
        `/payment/${paymentId}/update-status`,
        { stripePaymentId },
        { headers: getAuthHeader() }
      );
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (paymentId: string): Promise<PaymentStatusResponse> => {
    let response;
    try {
      response = await apiClient.get<PaymentStatusResponse>(
        `/payment/${paymentId}/status`,
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
