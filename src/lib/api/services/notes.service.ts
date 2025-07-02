import apiClient from '../config';

export interface Note {
  id: string;
  applicationId: string;
  content: string;
  officerId: string;
  officer: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  applicationId: string;
  content: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const notesService = {
  // Get all notes for an application
  getApplicationNotes: async (applicationId: string): Promise<ApiResponse<Note[]>> => {
    try {
      const response = await apiClient.get(`/applications/${applicationId}/notes`);
      return response.data;
    } catch (error: any) {
      const { message } = error.response?.data || { message: 'Failed to fetch application notes' };
      throw new Error(message);
    }
  },

  // Create a new note for an application
  createNote: async (data: CreateNoteData): Promise<ApiResponse<Note>> => {
    try {
      const response = await apiClient.post(`/applications/${data.applicationId}/notes`, {
        content: data.content
      });
      return response.data;
    } catch (error: any) {
      const { message } = error.response?.data || { message: 'Failed to create note' };
      throw new Error(message);
    }
  },

  // Update an existing note
  updateNote: async (noteId: string, content: string): Promise<ApiResponse<Note>> => {
    try {
      const response = await apiClient.put(`/notes/${noteId}`, { content });
      return response.data;
    } catch (error: any) {
      const { message } = error.response?.data || { message: 'Failed to update note' };
      throw new Error(message);
    }
  },

  // Delete a note
  deleteNote: async (noteId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.delete(`/notes/${noteId}`);
      return response.data;
    } catch (error: any) {
      const { message } = error.response?.data || { message: 'Failed to delete note' };
      throw new Error(message);
    }
  }
}; 