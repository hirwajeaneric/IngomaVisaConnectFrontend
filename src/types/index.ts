export type UserRole = 'APPLICANT' | 'OFFICER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active?: boolean;
  permissions?: string[];
  createdAt?: string;
  lastActive?: string;
  avatar?: string;
  phone?: string;
  department?: string;
  title?: string;
}

export interface VisaType {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  requirements: string[];
}

export interface VisaApplicationResponse {
  success: boolean
  message: string
  data: VisaApplication[]
}

export interface VisaApplication {
  id: string
  applicationNumber: string
  status: string
  rejectionReason?: string
  visaType: VisaType
  personalInfo?: PersonalInfo
  travelInfo?: TravelInfo
  documents: Document[]
  payment?: Payment
  fundingSource?: string
  monthlyIncome?: number
  submissionDate?: string
  userId: string
  officerId?: string
}

export interface VisaType {
  id: string
  name: string
  slug: string
  description: string
  price: number
  processingTime: string
  duration: string
  requirements: string[]
  eligibleCountries: string[]
  coverImage: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface PersonalInfo {
  id: string
  userId: string
  firstName: string
  lastName: string
  dateOfBirth: string
  nationality: string
  passportNumber: string
  passportIssueDate: string
  passportExpiryDate: string
  passportIssuingCountry: string
  gender: string
  email: string
  phone: string
  maritalStatus: string
  address: string
  currentAddress?: string
  occupation: string
  employerDetails?: string
  city: string
  country: string
  postalCode: string
}

export interface TravelInfo {
  id: string
  purposeOfTravel: string
  entryDate: string
  exitDate: string
  previousVisits: boolean
  intendedEntryDate: string
  intendedExitDate: string
  portOfEntry: string
  accommodationDetails: string
  travelItinerary: string
  previousVisitDetails: string
  hostDetails: string
  finalDestination: string
  countriesVisitedOfAfterBurundi: string
}

export interface Document {
  id: string
  applicationId: string
  documentType: string
  fileName: string
  filePath: string
  fileSize: number
  uploadDate: string
  verificationStatus: string
  verifiedBy?: string
  verifiedAt?: string
  rejectionReason?: string
}

export interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  paymentStatus: string
  stripePaymentId: string
  createdAt: string
  updatedAt: string
  refundStatus?: string
  refundReason?: string
}


// Admin-related types
export interface AdminUser extends User {
  permissions: string[];
  active: boolean;
  createdAt: string;
  lastActive: string;
  department: string;
  title: string;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  content: string;
  timestamp: string;
  status: 'unread' | 'read' | 'replied';
  applicationId?: string;
  replies?: Message[];
}

export interface Interview {
  id: string;
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  officerId?: string;
  location?: string;
  method: 'in-person' | 'video' | 'phone';
}

export interface Report {
  id: string;
  name: string;
  description: string;
  type: 'pdf' | 'excel';
  createdAt: string;
  downloadUrl: string;
  category: 'applications' | 'payments' | 'interviews' | 'users';
}
