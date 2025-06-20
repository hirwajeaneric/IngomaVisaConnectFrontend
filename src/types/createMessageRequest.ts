export interface CreateMessageRequest {
    senderId: string
    recipientId: string
    applicationId: string
    content: string
    replyToId?: string
    attachments?: string[]
  }
  