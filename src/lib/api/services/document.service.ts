import apiClient from "../config";

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const documentService = {
    verifyDocument: async (documentId: string, isApproved: boolean, rejectionReason?: string) => {
        const response = await apiClient.put(`/documents/${documentId}/verify`, { isApproved, rejectionReason }, { headers: getAuthHeader() });
        return response.data;
    },

    rejectDocument: async (documentId: string, rejectionReason: string) => {
        const response = await apiClient.put(`/documents/${documentId}/verify`, { isApproved: false, rejectionReason }, { headers: getAuthHeader() });
        return response.data;
    }
};