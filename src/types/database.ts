
/**
 * Complete Database Schema Structure for Visa Application System
 * 
 * This file defines the entity structure for use with TypeORM
 * to create a complete backend for the visa application system.
 */

// ===== CORE USER ENTITIES =====

export interface UserEntity {
  id: string;              // UUID
  email: string;           // Unique email
  password: string;        // Hashed password
  name: string;            // Full name
  role: "applicant" | "officer" | "admin";
  avatar?: string;         // URL to profile image
  phone?: string;          // Contact phone
  isActive: boolean;       // Account status
  createdAt: Date;         // Account creation timestamp
  lastLoginAt?: Date;      // Last login timestamp
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  department?: string;     // For officers/admins
  title?: string;          // Job title for officers/admins
  permissions?: string[];  // Admin permissions array
}

// ===== VISA ENTITIES =====

export interface VisaTypeEntity {
  id: string;              // UUID
  name: string;            // e.g. Tourist, Business
  description: string;     // Detailed description
  price: number;           // Application fee
  processingTime: string;  // e.g. "5-7 business days"
  duration: string;        // e.g. "30 days", "90 days"
  requirements: string[];  // Array of required documents
  eligibleCountries?: string[]; // Countries eligible for this visa type
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  documentRequirements: DocumentRequirementEntity[];
}

export interface DocumentRequirementEntity {
  id: string;              // UUID
  visaTypeId: string;      // Reference to visa type
  name: string;            // Name of document
  description: string;     // Detailed description
  isRequired: boolean;     // If document is mandatory
  applicableToNationalities?: string[]; // Specific nationalities requiring this doc
  createdAt: Date;
  updatedAt: Date;
}

// ===== APPLICATION ENTITIES =====

export interface VisaApplicationEntity {
  id: string;              // UUID
  applicationNumber: string; // Unique reference number  
  userId: string;          // Reference to applicant
  visaTypeId: string;      // Reference to visa type
  status: "draft" | "submitted" | "under-review" | "document-requested" | "interview-scheduled" | "approved" | "rejected";
  submissionDate?: Date;   // When application was submitted
  decisionDate?: Date;     // When decision was made
  expiryDate?: Date;       // When visa expires (if approved)
  rejectionReason?: string; // If application was rejected
  officerId?: string;      // Officer assigned to process
  createdAt: Date;         // When application was created
  updatedAt: Date;         // Last update timestamp
  
  // References to related data
  personalInfo: PersonalInfoEntity;
  travelInfo: TravelInfoEntity;
  financialInfo: FinancialInfoEntity;
  documents: DocumentEntity[];
  declaration: DeclarationEntity;
  payments: PaymentEntity[];
  messages: MessageEntity[];
  interviews: InterviewEntity[];
  statusHistory: ApplicationStatusHistoryEntity[];
  additionalDocumentRequests: AdditionalDocumentRequestEntity[];
}

export interface PersonalInfoEntity {
  id: string;              // UUID
  applicationId: string;   // Reference to application
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other";
  nationality: string;
  maritalStatus: "single" | "married" | "divorced" | "widowed";
  passportNumber: string;
  passportIssueDate: Date;
  passportExpiryDate: Date;
  placeOfPassportIssuance: string;
  email: string;
  phone: string;
  currentAddress: string;
  occupation?: string;
  employerDetails?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TravelInfoEntity {
  id: string;              // UUID
  applicationId: string;   // Reference to application
  purpose: string;         // Purpose of travel
  entryDate: Date;         // Planned entry date
  exitDate: Date;          // Planned exit date
  portOfEntry: string;     // Intended port of entry
  previousVisits: boolean; // Previous visits to country
  previousVisitDetails?: string;
  accommodation?: string;  // Where applicant will stay
  travelItinerary?: string; // Travel itinerary details
  finalDestination?: string; // If transit visa
  countriesVisited?: string[]; // Recent countries visited
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialInfoEntity {
  id: string;              // UUID
  applicationId: string;   // Reference to application
  fundingSource: "self" | "sponsor" | "employer" | "scholarship";
  sponsorDetails?: string; // If sponsored
  monthlyIncome?: string;  // Income information
  bankStatements?: string[]; // References to uploaded statements
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentEntity {
  id: string;              // UUID
  applicationId: string;   // Reference to application
  documentType: string;    // Type of document
  description?: string;    // Optional description
  fileUrl: string;         // URL to stored file
  fileName: string;        // Original filename
  mimeType: string;        // File type
  fileSize: number;        // Size in bytes
  uploadDate: Date;        // When document was uploaded
  status: "pending" | "verified" | "rejected";
  verificationDate?: Date; // When verified/rejected
  verifiedBy?: string;     // Officer ID who verified
  rejectionReason?: string; // Reason if rejected
  notes?: string;          // Admin notes
}

export interface DeclarationEntity {
  id: string;              // UUID
  applicationId: string;   // Reference to application
  agreeToTerms: boolean;   // Agreement to terms
  dataConsent: boolean;    // Consent to data processing
  signature: string;       // Digital signature
  signatureDate: Date;     // When signed
}

// ===== PAYMENT ENTITIES =====

export interface PaymentEntity {
  id: string;              // UUID
  applicationId: string;   // Reference to application
  userId: string;          // User who made payment
  amount: number;          // Payment amount
  currency: string;        // Currency code (e.g. USD)
  paymentMethod: string;   // Method used
  status: "pending" | "completed" | "failed" | "refunded";
  reference: string;       // Payment reference
  receiptUrl?: string;     // URL to receipt
  transactionDate: Date;   // When payment was made
  processedDate?: Date;    // When payment was processed
  processorResponse?: string; // Response from payment processor
  notes?: string;          // Additional notes
}

export interface PaymentMethodEntity {
  id: string;              // UUID
  name: string;            // Payment method name
  description: string;     // Description
  instructions: string;    // Instructions for using
  isActive: boolean;       // If method is active
  processingFee?: number;  // Additional fee if any
}

// ===== COMMUNICATION ENTITIES =====

export interface MessageEntity {
  id: string;              // UUID
  applicationId: string;   // Reference to application
  senderId: string;        // User who sent message
  senderRole: "applicant" | "officer" | "admin" | "system";
  content: string;         // Message content
  subject: string;         // Message subject
  timestamp: Date;         // When message was sent
  status: "unread" | "read" | "replied";
  parentMessageId?: string; // For threaded messages
  attachments?: MessageAttachmentEntity[];
}

export interface MessageAttachmentEntity {
  id: string;              // UUID
  messageId: string;       // Reference to message
  fileName: string;        // Original file name
  fileUrl: string;         // URL to file
  fileSize: number;        // Size in bytes
  mimeType: string;        // File type
  uploadDate: Date;        // When uploaded
}

export interface NotificationEntity {
  id: string;              // UUID
  userId: string;          // User to notify
  type: string;            // Notification type
  title: string;           // Notification title
  message: string;         // Notification message
  relatedEntityId?: string; // ID of related entity
  relatedEntityType?: string; // Type of related entity
  isRead: boolean;         // If notification was read
  createdAt: Date;         // When created
  readAt?: Date;           // When read
}

// ===== INTERVIEW ENTITIES =====

export interface InterviewEntity {
  id: string;              // UUID
  applicationId: string;   // Reference to application
  officerId?: string;      // Officer conducting interview
  scheduledDate: Date;     // Date of interview
  duration: number;        // Duration in minutes
  location?: string;       // Location if in-person
  method: "in-person" | "video" | "phone";
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  notes?: string;          // Interview notes
  feedback?: string;       // Feedback from officer
  createdAt: Date;
  updatedAt: Date;
  documents?: InterviewDocumentEntity[]; // Documents presented
}

export interface InterviewDocumentEntity {
  id: string;              // UUID
  interviewId: string;     // Reference to interview
  documentType: string;    // Type of document
  notes?: string;          // Notes about document
  fileUrl?: string;        // URL if document was uploaded
}

// ===== TRACKING ENTITIES =====

export interface ApplicationStatusHistoryEntity {
  id: string;              // UUID
  applicationId: string;   // Reference to application
  status: string;          // New status
  previousStatus?: string; // Previous status
  changedById: string;     // User who changed status
  changedByRole: string;   // Role of user who changed
  notes?: string;          // Notes about change
  createdAt: Date;         // When status was changed
}

export interface AdditionalDocumentRequestEntity {
  id: string;              // UUID
  applicationId: string;   // Reference to application
  requestedById: string;   // Officer who requested
  documentName: string;    // Requested document name
  reason: string;          // Reason for request
  details?: string;        // Additional details
  status: "pending" | "submitted" | "verified" | "rejected";
  requestDate: Date;       // When requested
  dueDate?: Date;          // When due
  submissionDate?: Date;   // When submitted
  documentId?: string;     // ID of submitted document
}

// ===== ADMIN ENTITIES =====

export interface ReportEntity {
  id: string;              // UUID
  name: string;            // Report name
  description: string;     // Report description
  type: "pdf" | "excel";   // Report format
  category: "applications" | "payments" | "interviews" | "users";
  createdBy: string;       // User who created report
  createdAt: Date;         // When report was created
  parameters?: Record<string, any>; // Parameters used
  fileUrl: string;         // URL to generated report file
  isScheduled: boolean;    // If report is scheduled
  scheduleFrequency?: string; // Schedule frequency
  lastRun?: Date;          // When last run
  recipients?: string[];   // Emails to send report to
}

export interface AuditLogEntity {
  id: string;              // UUID
  userId: string;          // User who performed action
  userRole: string;        // Role of user
  action: string;          // Action performed
  entityType: string;      // Type of entity affected
  entityId?: string;       // ID of affected entity
  details: Record<string, any>; // Action details
  ipAddress?: string;      // IP address
  userAgent?: string;      // Browser/device info
  createdAt: Date;         // When action was performed
}

export interface SystemSettingEntity {
  id: string;              // UUID
  key: string;             // Setting key
  value: string;           // Setting value
  description: string;     // Setting description
  category: string;        // Setting category
  isPublic: boolean;       // If setting is public
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: string;      // User who last updated
}

export interface FaqEntity {
  id: string;              // UUID
  question: string;        // Question text
  answer: string;          // Answer text
  category: string;        // FAQ category
  order: number;           // Display order
  isActive: boolean;       // If FAQ is active
  createdAt: Date;
  updatedAt: Date;
}

// ===== DATABASE RELATIONSHIPS =====
/**
 * Main relationships between entities:
 * 
 * 1. UserEntity (1) ---> (N) VisaApplicationEntity
 * 2. VisaTypeEntity (1) ---> (N) VisaApplicationEntity
 * 3. VisaApplicationEntity (1) ---> (1) PersonalInfoEntity
 * 4. VisaApplicationEntity (1) ---> (1) TravelInfoEntity
 * 5. VisaApplicationEntity (1) ---> (1) FinancialInfoEntity
 * 6. VisaApplicationEntity (1) ---> (1) DeclarationEntity
 * 7. VisaApplicationEntity (1) ---> (N) DocumentEntity
 * 8. VisaApplicationEntity (1) ---> (N) PaymentEntity
 * 9. VisaApplicationEntity (1) ---> (N) MessageEntity
 * 10. VisaApplicationEntity (1) ---> (N) InterviewEntity
 * 11. VisaApplicationEntity (1) ---> (N) ApplicationStatusHistoryEntity
 * 12. VisaApplicationEntity (1) ---> (N) AdditionalDocumentRequestEntity
 * 13. MessageEntity (1) ---> (N) MessageAttachmentEntity
 * 14. MessageEntity (1) ---> (N) MessageEntity (parent-child)
 * 15. InterviewEntity (1) ---> (N) InterviewDocumentEntity
 * 16. VisaTypeEntity (1) ---> (N) DocumentRequirementEntity
 */

// TypeORM example configuration
export const typeOrmConfig = {
  type: "postgres", // Recommended DB type
  entities: [
    "UserEntity",
    "VisaTypeEntity",
    "DocumentRequirementEntity",
    "VisaApplicationEntity",
    "PersonalInfoEntity",
    "TravelInfoEntity",
    "FinancialInfoEntity",
    "DocumentEntity", 
    "DeclarationEntity",
    "PaymentEntity",
    "PaymentMethodEntity",
    "MessageEntity",
    "MessageAttachmentEntity",
    "NotificationEntity",
    "InterviewEntity",
    "InterviewDocumentEntity",
    "ApplicationStatusHistoryEntity",
    "AdditionalDocumentRequestEntity",
    "ReportEntity",
    "AuditLogEntity",
    "SystemSettingEntity",
    "FaqEntity"
  ],
  migrations: [
    "src/migration/**/*.ts"
  ],
  subscribers: [
    "src/subscriber/**/*.ts"
  ],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber"
  }
};

// Extra information: Recommended indexes for optimizing queries
/**
 * Key indexes to create for performance:
 * 
 * 1. UserEntity.email (unique)
 * 2. VisaApplicationEntity.userId
 * 3. VisaApplicationEntity.status
 * 4. VisaApplicationEntity.officerId
 * 5. VisaApplicationEntity.submissionDate
 * 6. DocumentEntity.applicationId
 * 7. DocumentEntity.status
 * 8. MessageEntity.applicationId
 * 9. MessageEntity.senderId
 * 10. PaymentEntity.applicationId
 * 11. PaymentEntity.status
 * 12. InterviewEntity.scheduledDate
 * 13. InterviewEntity.officerId
 * 14. InterviewEntity.applicationId
 * 15. InterviewEntity.status
 * 16. ApplicationStatusHistoryEntity.applicationId
 */
