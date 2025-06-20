export interface NewMessageResponse {
    success: boolean
    data: Message
    message: string
  }
  
  export interface Message {
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
    application: Application
    replyTo: ReplyTo
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
  
  export interface Application {
    id: string
    applicationNumber: string
  }
  
  export interface ReplyTo {
    id: string
    content: string
    sender: Sender2
  }
  
  export interface Sender2 {
    name: string
  }
  