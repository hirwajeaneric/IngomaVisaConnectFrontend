import apiClient from "../config";

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface CreateRequestForDocumentData {
    documentName: string;
    additionalDetails?: string;
}

export interface UpdateRequestForDocumentData {
    documentName?: string;
    additionalDetails?: string;
}

export interface SubmitDocumentForRequestData {
    documentType: string;
    fileName: string;
    filePath: string;
    fileSize: number;
}

export const requestForDocumentService = {
    // Create a new document request (officer only)
    createRequestForDocument: async (applicationId: string, data: CreateRequestForDocumentData) => {
        const response = await apiClient.post(
            `/document-requests/${applicationId}`,
            data,
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    // Get all document requests for an application
    getApplicationDocumentRequests: async (applicationId: string) => {
        const response = await apiClient.get(
            `/document-requests/application/${applicationId}`,
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    // Get a specific document request by ID
    getRequestForDocumentById: async (requestId: string) => {
        const response = await apiClient.get(
            `/document-requests/${requestId}`,
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    // Update a document request (officer only)
    updateRequestForDocument: async (requestId: string, data: UpdateRequestForDocumentData) => {
        const response = await apiClient.put(
            `/document-requests/${requestId}`,
            data,
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    // Cancel a document request (officer only)
    cancelRequestForDocument: async (requestId: string) => {
        const response = await apiClient.delete(
            `/document-requests/${requestId}`,
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    // Submit a document for a request (applicant only)
    submitDocumentForRequest: async (requestId: string, data: SubmitDocumentForRequestData) => {
        const response = await apiClient.post(
            `/document-requests/${requestId}/submit`,
            data,
            { headers: getAuthHeader() }
        );
        return response.data;
    }
}; 