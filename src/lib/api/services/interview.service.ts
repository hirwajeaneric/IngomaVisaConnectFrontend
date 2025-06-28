import apiClient from '../config';

export interface CreateInterviewData {
  scheduledDate: string;
  location: string;
  notes?: string;
}

export interface UpdateInterviewData {
  scheduledDate?: string;
  location?: string;
  notes?: string;
}

export interface MarkInterviewCompletedData {
  outcome: string;
  notes?: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  scheduledDate: string;
  location: string;
  status: 'SCHEDULED' | 'RESCHEDULED' | 'COMPLETED' | 'CANCELLED';
  confirmed: boolean;
  confirmedAt?: string;
  notes?: string;
  outcome?: string;
  createdAt: string;
  updatedAt: string;
  application?: {
    id: string;
    applicationNumber: string;
    visaType: {
      name: string;
    };
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  assignedOfficer?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const interviewService = {
  // Create a new interview (officer only)
  createInterview: async (applicationId: string, data: CreateInterviewData): Promise<ApiResponse<Interview>> => {
    const response = await apiClient.post(
      `/interviews/${applicationId}`,
      data,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Get a specific interview by ID
  getInterviewById: async (interviewId: string): Promise<ApiResponse<Interview>> => {
    const response = await apiClient.get(
      `/interviews/${interviewId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Get all interviews for an application
  getApplicationInterviews: async (applicationId: string): Promise<ApiResponse<Interview[]>> => {
    const response = await apiClient.get(
      `/interviews/application/${applicationId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Get all interviews scheduled by an officer
  getOfficerInterviews: async (): Promise<ApiResponse<Interview[]>> => {
    const response = await apiClient.get(
      `/interviews/officer/all`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Get all interviews for the current applicant
  getApplicantInterviews: async (): Promise<ApiResponse<Interview[]>> => {
    const response = await apiClient.get(
      `/interviews/applicant/all`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Reschedule an interview (officer only)
  rescheduleInterview: async (interviewId: string, data: UpdateInterviewData): Promise<ApiResponse<Interview>> => {
    const response = await apiClient.put(
      `/interviews/${interviewId}/reschedule`,
      data,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Cancel an interview (officer only)
  cancelInterview: async (interviewId: string): Promise<ApiResponse<Interview>> => {
    const response = await apiClient.delete(
      `/interviews/${interviewId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Confirm an interview (applicant only)
  confirmInterview: async (interviewId: string): Promise<ApiResponse<Interview>> => {
    const response = await apiClient.post(
      `/interviews/${interviewId}/confirm`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Mark an interview as completed (officer only)
  markInterviewCompleted: async (interviewId: string, data: MarkInterviewCompletedData): Promise<ApiResponse<Interview>> => {
    const response = await apiClient.put(
      `/interviews/${interviewId}/complete`,
      data,
      { headers: getAuthHeader() }
    );
    return response.data;
  },
}; 