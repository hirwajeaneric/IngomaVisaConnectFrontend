export interface MarkSingleMessageAsReadResponse {
    success: boolean
    data: Data
    message: string
  }
  
  export interface Data {
    id: string
    senderId: string
    recipientId: string
    content: string
    isRead: boolean
    applicationId: string
    replyToId: string
    attachments: string[]
    createdAt: string
    sender: Sender
    recipient: Recipient
  }
  
  export interface Sender {
    id: string
    name: string
    email: string
    role: string
  }
  
  export interface Recipient {
    id: string
    name: string
    email: string
    role: string
  }
  