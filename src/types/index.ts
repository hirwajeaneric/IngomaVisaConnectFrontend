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

export interface VisaApplication {
  id: string;
  userId: string;
  visaType: string;
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected';
  submissionDate: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    passportNumber: string;
    passportExpiryDate: string;
    gender: string;
    email: string;
    phone: string;
  };
  travelInfo: {
    purpose: string;
    entryDate: string;
    exitDate: string;
    accommodation: string;
  };
  documents: {
    passport: string;
    photo: string;
    itinerary?: string;
    invitation?: string;
    [key: string]: string | undefined;
  };
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
