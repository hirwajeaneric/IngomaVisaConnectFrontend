import { Message } from "./createMessageResponse"

export interface GetMessageDetailsResponse {
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
    application: Application
    replyTo: ReplyTo
    replies: Message[]
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
    senderId: string
    recipientId: string
    content: string
    isRead: boolean
    applicationId: string
    replyToId: string
    attachments: string[]
    createdAt: string
    sender: Sender2
    recipient: Recipient2
  }
  
  export interface Sender2 {
    id: string
    name: string
    email: string
    role: string
  }
  
  export interface Recipient2 {
    id: string
    name: string
    email: string
    role: string
  }
  