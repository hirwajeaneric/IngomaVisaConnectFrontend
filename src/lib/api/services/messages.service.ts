import apiClient from '../config';
import { CreateMessageRequest } from '@/types/createMessageRequest';
import { NewMessageResponse, Message } from '@/types/createMessageResponse';
import { GetMessageWhereIAmTheRecipientResponse } from '@/types/getMessageWhereIAmTheRecipientResponse';
import { ApplicationMessagesResponse } from '@/types/applicationMessagesResponse';
import { MessageBetweenTwoUsersResponse } from '@/types/messageBetweenTwoUsersResponse';
import { GetMessageDetailsResponse } from '@/types/getMessageDetailsResponse';
import { UpdateMessageRequest } from '@/types/updateMessageRequest';
import { UpdateMessageResponse } from '@/types/updateMessageResponse';
import { MarkSingleMessageAsReadResponse } from '@/types/markSingleMessageAsReadResponse';
import { TotalUnreadCountResponse } from '@/types/totalUnreadCountResponse';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const messagesService = {
  /**
   * Create a new message
   * POST /api/messages
   */
  createMessage: async (data: CreateMessageRequest): Promise<NewMessageResponse> => {
    let response;
    try {
      response = await apiClient.post<NewMessageResponse>('/messages', data, {
        headers: getAuthHeader()
      });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const { message } = apiError.response?.data || { message: 'Failed to create message' };
      throw new Error(message);
    }
    return response.data;
  },

  /**
   * Get messages for a specific application
   * GET /api/messages/application/:applicationId
   */
  getMessagesByApplication: async (
    applicationId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApplicationMessagesResponse> => {
    let response;
    try {
      response = await apiClient.get<ApplicationMessagesResponse>(
        `/messages/application/${applicationId}?page=${page}&limit=${limit}`,
        { headers: getAuthHeader() }
      );
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const { message } = apiError.response?.data || { message: 'Failed to fetch application messages' };
      throw new Error(message);
    }
    return response.data;
  },

  /**
   * Get messages between two users
   * GET /api/messages/between/:userId1/:userId2
   */
  getMessagesBetweenUsers: async (
    userId1: string,
    userId2: string,
    page: number = 1,
    limit: number = 20
  ): Promise<MessageBetweenTwoUsersResponse> => {
    let response;
    try {
      response = await apiClient.get<MessageBetweenTwoUsersResponse>(
        `/messages/between/${userId1}/${userId2}?page=${page}&limit=${limit}`,
        { headers: getAuthHeader() }
      );
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const { message } = apiError.response?.data || { message: 'Failed to fetch messages between users' };
      throw new Error(message);
    }
    return response.data;
  },

  /**
   * Get all messages where the authenticated user is the recipient
   * GET /api/messages/mine
   */
  getMyMessages: async (
    page: number = 1,
    limit: number = 20
  ): Promise<GetMessageWhereIAmTheRecipientResponse> => {
    let response;
    try {
      response = await apiClient.get<GetMessageWhereIAmTheRecipientResponse>(
        `/messages/mine?page=${page}&limit=${limit}`,
        { headers: getAuthHeader() }
      );
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const { message } = apiError.response?.data || { message: 'Failed to fetch your messages' };
      throw new Error(message);
    }
    return response.data;
  },

  /**
   * Get a specific message by ID
   * GET /api/messages/:messageId
   */
  getMessageById: async (messageId: string): Promise<GetMessageDetailsResponse> => {
    let response;
    try {
      response = await apiClient.get<GetMessageDetailsResponse>(
        `/messages/${messageId}`,
        { headers: getAuthHeader() }
      );
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const { message } = apiError.response?.data || { message: 'Failed to fetch message details' };
      throw new Error(message);
    }
    return response.data;
  },

  /**
   * Update a message
   * PUT /api/messages/:messageId
   */
  updateMessage: async (
    messageId: string,
    data: UpdateMessageRequest
  ): Promise<UpdateMessageResponse> => {
    let response;
    try {
      response = await apiClient.put<UpdateMessageResponse>(
        `/messages/${messageId}`,
        data,
        { headers: getAuthHeader() }
      );
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const { message } = apiError.response?.data || { message: 'Failed to update message' };
      throw new Error(message);
    }
    return response.data;
  },

  /**
   * Mark message as read
   * PATCH /api/messages/:messageId/read
   */
  markAsRead: async (messageId: string): Promise<MarkSingleMessageAsReadResponse> => {
    let response;
    try {
      response = await apiClient.patch<MarkSingleMessageAsReadResponse>(
        `/messages/${messageId}/read`,
        {},
        { headers: getAuthHeader() }
      );
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const { message } = apiError.response?.data || { message: 'Failed to mark message as read' };
      throw new Error(message);
    }
    return response.data;
  },

  /**
   * Mark all messages as read for a user in an application
   * PATCH /api/messages/application/:applicationId/read-all
   */
  markAllAsRead: async (applicationId: string): Promise<ApiResponse<{ count: number }>> => {
    let response;
    try {
      response = await apiClient.patch<ApiResponse<{ count: number }>>(
        `/messages/application/${applicationId}/read-all`,
        {},
        { headers: getAuthHeader() }
      );
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const { message } = apiError.response?.data || { message: 'Failed to mark all messages as read' };
      throw new Error(message);
    }
    return response.data;
  },

  /**
   * Delete a message
   * DELETE /api/messages/:messageId
   */
  deleteMessage: async (messageId: string): Promise<ApiResponse<void>> => {
    let response;
    try {
      response = await apiClient.delete<ApiResponse<void>>(
        `/messages/${messageId}`,
        { headers: getAuthHeader() }
      );
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const { message } = apiError.response?.data || { message: 'Failed to delete message' };
      throw new Error(message);
    }
    return response.data;
  },

  /**
   * Get unread message count for a user
   * GET /api/messages/unread/count
   */
  getUnreadCount: async (): Promise<TotalUnreadCountResponse> => {
    let response;
    try {
      response = await apiClient.get<TotalUnreadCountResponse>(
        '/messages/unread/count',
        { headers: getAuthHeader() }
      );
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const { message } = apiError.response?.data || { message: 'Failed to get unread count' };
      throw new Error(message);
    }
    return response.data;
  },

  /**
   * Get unread message count for a user in a specific application
   * GET /api/messages/application/:applicationId/unread/count
   */
  getUnreadCountByApplication: async (applicationId: string): Promise<ApiResponse<{ count: number }>> => {
    let response;
    try {
      response = await apiClient.get<ApiResponse<{ count: number }>>(
        `/messages/application/${applicationId}/unread/count`,
        { headers: getAuthHeader() }
      );
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const { message } = apiError.response?.data || { message: 'Failed to get unread count for application' };
      throw new Error(message);
    }
    return response.data;
  },

  /**
   * Send a quick message (convenience method)
   */
  sendQuickMessage: async (
    recipientId: string,
    applicationId: string,
    content: string,
    replyToId?: string,
    attachments?: string[]
  ): Promise<NewMessageResponse> => {
    const messageData: CreateMessageRequest = {
      recipientId,
      applicationId,
      content,
      replyToId,
      attachments
    };
    return messagesService.createMessage(messageData);
  },

  /**
   * Reply to a message (convenience method)
   */
  replyToMessage: async (
    originalMessageId: string,
    content: string,
    attachments?: string[]
  ): Promise<NewMessageResponse> => {
    // First get the original message to extract recipient and application info
    const originalMessage = await messagesService.getMessageById(originalMessageId);
    const messageData = originalMessage.data;

    const replyData: CreateMessageRequest = {
      recipientId: messageData.sender.id, // Reply to the sender
      applicationId: messageData.application.id,
      content,
      replyToId: originalMessageId,
      attachments
    };

    return messagesService.createMessage(replyData);
  },

  /**
   * Get conversation thread (messages and replies)
   */
  getConversationThread: async (messageId: string): Promise<GetMessageDetailsResponse> => {
    // This will return the message with all its replies included
    return messagesService.getMessageById(messageId);
  },

  /**
   * Search messages by content (if backend supports it)
   */
  searchMessages: async (
    query: string,
    applicationId?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<GetMessageWhereIAmTheRecipientResponse> => {
    let response;
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (applicationId) {
        params.append('applicationId', applicationId);
      }

      response = await apiClient.get<GetMessageWhereIAmTheRecipientResponse>(
        `/messages/search?${params.toString()}`,
        { headers: getAuthHeader() }
      );
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const { message } = apiError.response?.data || { message: 'Failed to search messages' };
      throw new Error(message);
    }
    return response.data;
  }
};
