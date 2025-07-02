import apiClient from '../config';

export interface DashboardStats {
  totalApplications: number;
  applicationChange: number;
  pendingPercentage: number;
  avgProcessingDays: number;
  totalUsers: number;
  userChange: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
}

export interface MonthlyApplication {
  month: string;
  applications: number;
}

export interface VisaTypeDistribution {
  name: string;
  value: number;
}

export interface StatusTrend {
  name: string;
  pending: number;
  approved: number;
  rejected: number;
}

export const dashboardService = {
  async getDashboardStats(year: number = new Date().getFullYear()): Promise<DashboardStats> {
    try {
      const response = await apiClient.get(`/dashboard/stats?year=${year}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  async getMonthlyApplications(year: number = new Date().getFullYear()): Promise<MonthlyApplication[]> {
    try {
      const response = await apiClient.get(`/dashboard/monthly-applications?year=${year}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching monthly applications:', error);
      throw error;
    }
  },

  async getVisaTypeDistribution(year: number = new Date().getFullYear()): Promise<VisaTypeDistribution[]> {
    try {
      const response = await apiClient.get(`/dashboard/visa-type-distribution?year=${year}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching visa type distribution:', error);
      throw error;
    }
  },

  async getApplicationStatusTrends(year: number = new Date().getFullYear()): Promise<StatusTrend[]> {
    try {
      const response = await apiClient.get(`/dashboard/status-trends?year=${year}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching application status trends:', error);
      throw error;
    }
  }
}; 