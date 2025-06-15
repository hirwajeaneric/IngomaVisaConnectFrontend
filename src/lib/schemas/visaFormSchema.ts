import { z } from "zod";
import { ALLOWED_DOCUMENT_TYPES, DocumentType } from "@/lib/api/services/visaapplication.service";

// Personal Information Schema - Step 1
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  gender: z.enum(["male", "female", "other"], { 
    required_error: "Please select your gender" 
  }),
  nationality: z.string().min(1, { message: "Nationality is required" }),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"], { 
    required_error: "Please select your marital status" 
  }),
  passportNumber: z.string().min(5, { message: "Valid passport number is required" }),
  passportIssueDate: z.string().min(1, { message: "Passport issue date is required" }),
  passportExpiryDate: z.string().min(1, { message: "Passport expiry date is required" }),
  passportIssuingCountry: z.string().min(1, { message: "Place of issuance is required" }),
  email: z.string().email({ message: "Valid email address is required" }),
  phone: z.string().min(5, { message: "Valid phone number is required" }),
  address: z.string().min(5, { message: "Current address is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  city: z.string().min(1, { message: "City is required" }),
  postalCode: z.string().min(1, { message: "Postal code is required" }),
  occupation: z.string().optional(),
  employerDetails: z.string().optional(),
});

// Travel Information Schema - Step 2
export const travelInfoSchema = z.object({
  visaType: z.string().min(1, { message: "Visa type is required" }),
  entryDate: z.date({
    required_error: "Entry date is required",
  }),
  exitDate: z.date({
    required_error: "Exit date is required",
  }),
  purposeOfTravel: z.string().min(1, { message: "Purpose of travel is required" }),
  portOfEntry: z.string().optional(),
  accommodationDetails: z.string().optional(),
  travelItinerary: z.string().optional(),
  previousVisits: z.boolean().default(false),
  previousVisitDetails: z.string().optional(),
  hostDetails: z.string().optional(),
  finalDestination: z.string().optional(),
  countriesVisitedOfAfterBurundi: z.string().optional(),
});

// Financial Information Schema - Step 3
export const financialInfoSchema = z.object({
  fundingSource: z.enum(["self", "sponsor", "employer", "scholarship"], {
    required_error: "Please select a funding source"
  }),
  sponsorDetails: z.string().optional(),
  monthlyIncome: z.string().optional(),
});

// Supporting Documents Schema - Step 4
export const documentsSchema = z.object({
  passportCopy: z.boolean().refine(val => val === true, {
    message: "Passport copy is required"
  }),
  photos: z.boolean().refine(val => val === true, {
    message: "Passport photos are required"
  }),
  yellowFeverCertificate: z.boolean().refine(val => val === true, {
    message: "Yellow fever certificate is required"
  }),
  travelInsurance: z.boolean().default(false),
  invitationLetter: z.boolean().default(false),
  employmentContract: z.boolean().default(false),
  workPermit: z.boolean().default(false),
  admissionLetter: z.boolean().default(false),
  academicTranscripts: z.boolean().default(false),
  criminalRecord: z.boolean().default(false),
  medicalCertificate: z.boolean().default(false),
  onwardTicket: z.boolean().default(false),
  finalDestinationVisa: z.boolean().default(false),
}) as z.ZodType<Record<DocumentType, boolean>>;

// Declaration Schema - Step 5
export const declarationSchema = z.object({
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  }),
  dataConsent: z.boolean().refine(val => val === true, {
    message: "You must consent to data processing"
  }),
});

// Complete Visa Application Form Schema
export const visaFormSchema = z.object({
  personalInfo: personalInfoSchema,
  travelInfo: travelInfoSchema,
  financialInfo: financialInfoSchema,
  documents: documentsSchema,
  declaration: declarationSchema,
});

export type VisaFormValues = z.infer<typeof visaFormSchema>;
export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
export interface TravelInfoValues {
  visaType: string;
  entryDate: string;
  exitDate: string;
  purposeOfTravel: string;
  portOfEntry?: string;
  accommodationDetails?: string;
  travelItinerary?: string;
  previousVisits: boolean;
  previousVisitDetails?: string;
  hostDetails?: string;
  finalDestination?: string;
  countriesVisitedOfAfterBurundi?: string;
}
export type FinancialInfoValues = z.infer<typeof financialInfoSchema>;
export type DocumentsValues = z.infer<typeof documentsSchema>;
export type DeclarationValues = z.infer<typeof declarationSchema>;
