/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '../config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '@/configs/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { UploadProgressCallback } from '@/hooks/useVisaApplication';
import { VisaApplicationResponse } from '@/types';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  maritalStatus: string;
  passportNumber: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  passportIssuingCountry: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  postalCode: string;
  occupation?: string;
  employerDetails?: string;
}

export interface TravelInfo {
  visaType: string;
  visaTypeId: string;
  purposeOfTravel: string;
  entryDate: string;
  exitDate: string;
  portOfEntry: string;
  previousVisits: boolean;
  previousVisitDetails?: string;
  travelItinerary?: string;
  accommodationDetails?: string;
  finalDestination?: string;
  countriesVisitedOfAfterBurundi?: string;
}

export interface FinancialInfo {
  fundingSource: string;
  sponsorDetails?: string;
  monthlyIncome?: string;
}

export interface Document {
  id: string;
  applicationId: string;
  documentType: DocumentType;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  transactionId?: string;
  paymentDate?: string;
}

export interface VisaApplication {
  id: string;
  applicationNumber: string;
  status: 'PENDING' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  submissionDate: string | null;
  decisionDate: string | null;
  expiryDate: string | null;
  rejectionReason: string | null;
  visaType: {
    id: string;
    name: string;
    price: number;
  };
  personalInfo: PersonalInfo | null;
  travelInfo: TravelInfo | null;
  documents: Document[];
  payment: Payment | null;
  requestForDocuments?: RequestForDocument[];
}

export interface RequestForDocument {
  id: string;
  applicationId: string;
  documentName: string;
  additionalDetails?: string;
  status: 'SENT' | 'SUBMITTED' | 'CANCELLED';
  officer: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  document?: {
    id: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    uploadDate: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Define allowed document types matching backend
export const ALLOWED_DOCUMENT_TYPES = [
  'passportCopy',
  'photos',
  'yellowFeverCertificate',
  'travelInsurance',
  'invitationLetter',
  'employmentContract',
  'workPermit',
  'admissionLetter',
  'academicTranscripts',
  'criminalRecord',
  'medicalCertificate',
  'onwardTicket',
  'finalDestinationVisa'
] as const;

export type DocumentType = typeof ALLOWED_DOCUMENT_TYPES[number];

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const visaApplicationService = {
  // Create a new visa application
  createApplication: async (visaTypeId: string): Promise<ApiResponse<VisaApplication>> => {
    let response;
    try {
      response = await apiClient.post<ApiResponse<VisaApplication>>('/applications', { visaTypeId }, {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },

  // Get application by ID
  getApplicationById: async (applicationId: string) => {
    let response;
    try {
      response = await apiClient.get(`/applications/${applicationId}`, {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data.data;
  },

  // Get all applications for current user
  getUserApplications: async () => {
    let response;
    try {
      response = await apiClient.get('/applications', {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data.data;
  },

  // Get all applications
  getAllApplications: async () => {
    let response;
    try {
      response = await apiClient.get('/applications/all', {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data.data;
  },

  // Update personal information
  updatePersonalInfo: async (applicationId: string, data: PersonalInfo): Promise<ApiResponse<VisaApplication>> => {
    let response;
    try {
      response = await apiClient.put<ApiResponse<VisaApplication>>(
        `/personal-info/${applicationId}`,
        data,
        { headers: getAuthHeader() }
      );
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },

  // Update travel information
  updateTravelInfo: async (applicationId: string, data: TravelInfo): Promise<ApiResponse<VisaApplication>> => {
    let response;
    try {
      response = await apiClient.post<ApiResponse<VisaApplication>>(
        `/travel-info/${applicationId}`,
        data,
        { headers: getAuthHeader() }
      );
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },

  // Update financial information
  updateFinancialInfo: async (applicationId: string, data: FinancialInfo): Promise<ApiResponse<VisaApplication>> => {
    let response;
    try {
      response = await apiClient.post<ApiResponse<VisaApplication>>(
        `/financial-info/${applicationId}`,
        data,
        { headers: getAuthHeader() }
      );
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },

  // Add new method to get document types
  getDocumentTypes: async (): Promise<ApiResponse<DocumentType[]>> => {
    let response;
    try {
      response = await apiClient.get<ApiResponse<DocumentType[]>>('/document-requirements', {
        headers: getAuthHeader()
      });
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },

  // Upload document
  uploadDocument: async (
    applicationId: string, 
    documentType: DocumentType,
    file: File,
    onProgress?: UploadProgressCallback
  ): Promise<ApiResponse<Document>> => {
    try {
      console.log('[VisaService] Starting document upload:', {
        applicationId,
        documentType,
        fileName: file.name,
        fileSize: file.size
      });

      // Upload to Firebase
      const storageRef = ref(storage, `visa-documents/${applicationId}-${documentType}-${file.name}`);
      console.log('[VisaService] Created Firebase storage reference:', storageRef.fullPath);
      
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Wait for upload to complete and get URL
      const downloadURL = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log('[VisaService] Firebase upload progress:', {
              progress,
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes
            });
            if (onProgress) {
              onProgress(progress);
            }
          },
          (error) => {
            console.error('[VisaService] Firebase upload error:', error);
            reject(error);
          },
          async () => {
            try {
              console.log('[VisaService] Firebase upload completed');
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('[VisaService] Got download URL:', url);
              resolve(url);
            } catch (error) {
              console.error('[VisaService] Error getting download URL:', error);
              reject(error);
            }
          }
        );
      });

      console.log('[VisaService] Sending metadata to backend');
      // Now send only the file metadata to backend
      let response;
      try {
        response = await apiClient.post<ApiResponse<Document>>(
          `/documents/${applicationId}`,
          {
            documentType,
            fileName: file.name,
            filePath: downloadURL,
            fileSize: file.size
          },
          {
            headers: getAuthHeader(),
          }
        );
      } catch (error: any) {
        const { message } = error.response.data;
        throw new Error(message);
      }
      console.log('[VisaService] Backend response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[VisaService] Error in uploadDocument:', error);
      throw error;
    }
  },

  // Submit application
  submitApplication: async (applicationId: string): Promise<ApiResponse<VisaApplication>> => {
    let response;
    try {
      response = await apiClient.post<ApiResponse<VisaApplication>>(
        `/applications/${applicationId}/submit`,
        {},
        { headers: getAuthHeader() }
      );
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },

  // Get application status
  getApplicationStatus: async (applicationId: string): Promise<ApiResponse<{ status: string }>> => {
    let response;
    try {
      response = await apiClient.get<ApiResponse<{ status: string }>>(
        `/applications/${applicationId}/status`,
        { headers: getAuthHeader() }
      );
    } catch (error: any) {
      const { message } = error.response.data;
      throw new Error(message);
    }
    return response.data;
  },

  // Update application status (admin/officer only)
  updateApplicationStatus: async (
    applicationId: string, 
    status: string, 
    rejectionReason?: string
  ): Promise<ApiResponse<VisaApplication>> => {
    let response;
    try {
      const payload: any = { status };
      if (rejectionReason) {
        payload.rejectionReason = rejectionReason;
      }
      
      response = await apiClient.put<ApiResponse<VisaApplication>>(
        `/applications/${applicationId}/status`,
        payload,
        { headers: getAuthHeader() }
      );
    } catch (error: any) {
      const { message } = error.response?.data || { message: 'Failed to update application status' };
      throw new Error(message);
    }
    return response.data;
  }
}; 