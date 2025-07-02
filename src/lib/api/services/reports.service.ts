import apiClient from '../config';

export interface ReportData {
  applicationId?: string;
  applicantName?: string;
  visaType?: string;
  status?: string;
  submissionDate?: string;
  decisionDate?: string;
  nationality?: string;
  passportNumber?: string;
  purposeOfTravel?: string;
  entryDate?: string;
  exitDate?: string;
  paymentStatus?: string;
  paymentAmount?: number;
  documentsCount?: number;
  transactionId?: string;
  amount?: number;
  currency?: string;
  refundStatus?: string;
  refundReason?: string;
  customerName?: string;
  customerEmail?: string;
  applicationNumber?: string;
  paymentDate?: string;
  updatedAt?: string;
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
  applicationsCount?: number;
  registrationDate?: string;
  lastUpdated?: string;
  interviewId?: string;
  applicantEmail?: string;
  scheduledDate?: string;
  location?: string;
  assignedOfficer?: string;
  scheduler?: string;
  confirmed?: boolean;
  confirmedAt?: string;
  notes?: string;
  outcome?: string;
  createdAt?: string;
}

export interface ReportSummary {
  totalCount: number;
  totalRevenue?: number;
  averageAmount?: number;
  byStatus?: Record<string, number>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const reportsService = {
  // Get applications report
  getApplicationsReport: async (
    reportType: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<ApiResponse<ReportData[]>> => {
    try {
      const params = new URLSearchParams();
      params.append('reportType', reportType);
      if (fromDate) params.append('fromDate', fromDate.toISOString());
      if (toDate) params.append('toDate', toDate.toISOString());

      const response = await apiClient.get(`/reports/applications?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      const { message } = error.response?.data || { message: 'Failed to fetch applications report' };
      throw new Error(message);
    }
  },

  // Get payments report
  getPaymentsReport: async (
    reportType: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<ApiResponse<ReportData[]>> => {
    try {
      const params = new URLSearchParams();
      params.append('reportType', reportType);
      if (fromDate) params.append('fromDate', fromDate.toISOString());
      if (toDate) params.append('toDate', toDate.toISOString());

      const response = await apiClient.get(`/reports/payments?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      const { message } = error.response?.data || { message: 'Failed to fetch payments report' };
      throw new Error(message);
    }
  },

  // Get users report
  getUsersReport: async (
    reportType: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<ApiResponse<ReportData[]>> => {
    try {
      const params = new URLSearchParams();
      params.append('reportType', reportType);
      if (fromDate) params.append('fromDate', fromDate.toISOString());
      if (toDate) params.append('toDate', toDate.toISOString());

      const response = await apiClient.get(`/reports/users?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      const { message } = error.response?.data || { message: 'Failed to fetch users report' };
      throw new Error(message);
    }
  },

  // Get interviews report
  getInterviewsReport: async (
    reportType: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<ApiResponse<ReportData[]>> => {
    try {
      const params = new URLSearchParams();
      params.append('reportType', reportType);
      if (fromDate) params.append('fromDate', fromDate.toISOString());
      if (toDate) params.append('toDate', toDate.toISOString());

      const response = await apiClient.get(`/reports/interviews?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      const { message } = error.response?.data || { message: 'Failed to fetch interviews report' };
      throw new Error(message);
    }
  },

  // Get report summary
  getReportSummary: async (
    reportType: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<ApiResponse<ReportSummary>> => {
    try {
      const params = new URLSearchParams();
      params.append('reportType', reportType);
      if (fromDate) params.append('fromDate', fromDate.toISOString());
      if (toDate) params.append('toDate', toDate.toISOString());

      const response = await apiClient.get(`/reports/summary?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      const { message } = error.response?.data || { message: 'Failed to fetch report summary' };
      throw new Error(message);
    }
  }
}; 