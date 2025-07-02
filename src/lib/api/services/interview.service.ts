import apiClient from '../config';

export interface CreateInterviewData {
  applicationId: string;
  assignedOfficerId: string;
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
  scheduler?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface Officer {
  id: string;
  name: string;
  email: string;
  department?: string;
  title?: string;
}

export interface ApplicationForInterview {
  id: string;
  applicationNumber: string;
  applicantName: string;
  applicantEmail: string;
  visaTypeName: string;
  visaTypeId: string;
  status: string;
  submissionDate?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Note: apiClient automatically handles authentication via interceptors

export const interviewService = {
  // Create a new interview (officer only)
  createInterview: async (data: CreateInterviewData): Promise<ApiResponse<Interview>> => {
    const response = await apiClient.post(`/interviews/create`, data);
    return response.data;
  },

  // Get a specific interview by ID
  getInterviewById: async (interviewId: string): Promise<ApiResponse<Interview>> => {
    const response = await apiClient.get(`/interviews/${interviewId}`);
    return response.data;
  },

  // Get all interviews for an application
  getApplicationInterviews: async (applicationId: string): Promise<ApiResponse<Interview[]>> => {
    const response = await apiClient.get(`/interviews/application/${applicationId}`);
    return response.data;
  },

  // Get all interviews scheduled by an officer
  getOfficerInterviews: async (): Promise<ApiResponse<Interview[]>> => {
    const response = await apiClient.get(`/interviews/officer/all`);
    return response.data;
  },

  // Get all interviews for the current applicant
  getApplicantInterviews: async (): Promise<ApiResponse<Interview[]>> => {
    const response = await apiClient.get(`/interviews/applicant/all`);
    return response.data;
  },

  // Reschedule an interview (officer only)
  rescheduleInterview: async (interviewId: string, data: UpdateInterviewData): Promise<ApiResponse<Interview>> => {
    const response = await apiClient.put(`/interviews/${interviewId}/reschedule`, data);
    return response.data;
  },

  // Cancel an interview (officer only)
  cancelInterview: async (interviewId: string): Promise<ApiResponse<Interview>> => {
    const response = await apiClient.delete(`/interviews/${interviewId}`);
    return response.data;
  },

  // Confirm an interview (applicant only)
  confirmInterview: async (interviewId: string): Promise<ApiResponse<Interview>> => {
    const response = await apiClient.post(`/interviews/${interviewId}/confirm`, {});
    return response.data;
  },

  // Mark an interview as completed (officer only)
  markInterviewCompleted: async (interviewId: string, data: MarkInterviewCompletedData): Promise<ApiResponse<Interview>> => {
    const response = await apiClient.put(`/interviews/${interviewId}/complete`, data);
    return response.data;
  },

  // Get officers for assignment
  getOfficersForAssignment: async (): Promise<ApiResponse<Officer[]>> => {
    const response = await apiClient.get(`/interviews/officers/assignment`);
    return response.data;
  },

  // Get applications for interview scheduling
  getApplicationsForInterviewScheduling: async (): Promise<ApiResponse<ApplicationForInterview[]>> => {
    const response = await apiClient.get(`/interviews/applications/scheduling`);
    return response.data;
  },
}; 