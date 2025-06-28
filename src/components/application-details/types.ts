export interface Document {
  id: string;
  applicationId: string;
  documentType: string;
  fileName: string;
  fileSize: number;
  filePath: string;
  uploadDate: string;
  verificationStatus: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface Message {
  id: string;
  date: string;
  from: string;
  content: string;
  read: boolean;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  country: string;
  email: string;
  phone: string;
  occupation: string;
  employerDetails?: string;
  address: string;
  city: string;
  maritalStatus: string;
  passportNumber: string;
  passportIssueDate: string;
  passportExpiryDate: string;
}

export interface TravelInfo {
  purposeOfTravel: string;
  entryDate: string;
  exitDate: string;
  accommodationDetails: string;
  previousVisits: boolean;
  portOfEntry: string;
  travelItinerary: string;
  hostDetails: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  stripePaymentId: string;
  createdAt: string;
}

export interface VisaType {
  name: string;
  processingTime: string;
  duration: string;
}

export interface Application {
  applicationNumber: string;
  status: string;
  submissionDate: string;
  personalInfo: PersonalInfo;
  travelInfo: TravelInfo;
  payment: Payment;
  visaType: VisaType;
  documents: Document[];
  fundingSource: string;
  monthlyIncome: number;
} 