import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { visaApplicationService, DocumentType } from '@/lib/api/services/visaapplication.service';
import type { 
  PersonalInfo, 
  TravelInfo, 
  FinancialInfo, 
  VisaApplication,
  Document 
} from '@/lib/api/services/visaapplication.service';
import { VisaFormValues } from '@/lib/schemas/visaFormSchema';

export interface UploadProgressCallback {
  (progress: number): void;
}

export const useVisaApplication = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // Initialize applicationId from localStorage if available
  useEffect(() => {
    const storedApplicationId = localStorage.getItem('current_application_id');
    if (storedApplicationId) {
      setApplicationId(storedApplicationId);
    }
  }, []);

  const createApplication = async (visaType: string, visaTypeId: string) => {
    try {
      setLoading(true);
      console.log('[useVisaApplication] Creating application:', {
        visaType,
        visaTypeId
      });

      if (!visaTypeId) {
        throw new Error('Visa type ID is required to create an application');
      }

      const response = await visaApplicationService.createApplication(visaTypeId);
      console.log('[useVisaApplication] Application created:', response.data);
      
      // Store applicationId both in state and localStorage
      setApplicationId(response.data.id);
      localStorage.setItem('current_application_id', response.data.id);
      
      return response.data;
    } catch (error) {
      console.error('[useVisaApplication] Failed to create application:', error);
      toast({
        title: "Error",
        description: "Failed to create visa application. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const submitApplication = async (formData: VisaFormValues) => {
    if (!applicationId) {
      toast({
        title: "Error",
        description: "No active application found.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Get the current application to ensure we have the visa type ID
      const currentApplication = await visaApplicationService.getApplicationById(applicationId);
      
      if (!currentApplication?.data) {
        throw new Error("Application not found");
      }

      // Update personal info
      await visaApplicationService.updatePersonalInfo(applicationId, formData.personalInfo);

      // Update travel info
      await visaApplicationService.updateTravelInfo(applicationId, {
        ...formData.travelInfo,
        visaTypeId: currentApplication.data.visaType.id // Ensure we're using the correct visa type ID
      });

      // Update financial info
      await visaApplicationService.updateFinancialInfo(applicationId, {
        fundingSource: formData.financialInfo.fundingSource,
        sponsorDetails: formData.financialInfo.sponsorDetails,
        monthlyIncome: formData.financialInfo.monthlyIncome,
      });

      // Submit the application
      const response = await visaApplicationService.submitApplication(applicationId);
      setApplicationSubmitted(true);

      // Clear the application data from localStorage after successful submission
      localStorage.removeItem("visaApplicationData");
      localStorage.removeItem("uploadedDocuments");
      localStorage.removeItem("current_application_id");

      toast({
        title: "Success",
        description: "Your visa application has been submitted successfully.",
      });

      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit application. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (
    documentType: DocumentType, 
    file: File,
    onProgress?: UploadProgressCallback
  ): Promise<Document> => {
    if (!applicationId) {
      toast({
        title: "Error",
        description: "No active application found.",
        variant: "destructive",
      });
      throw new Error("No active application found");
    }

    try {
      setLoading(true);
      const response = await visaApplicationService.uploadDocument(
        applicationId, 
        documentType, 
        file,
        onProgress
      );
      
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload document. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const calculateVisaFee = (visaType: string): number => {
    const fees: Record<string, number> = {
      tourist: 50,
      business: 100,
      work: 200,
      student: 75,
      transit: 30,
    };
    return fees[visaType] || 50;
  };

  return {
    loading,
    applicationId,
    applicationSubmitted,
    createApplication,
    submitApplication,
    uploadDocument,
    calculateVisaFee,
  };
}; 