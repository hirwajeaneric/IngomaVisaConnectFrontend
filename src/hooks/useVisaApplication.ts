/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { visaApplicationService, DocumentType } from '@/lib/api/services/visaapplication.service';
import { useToast } from './use-toast';
import { VisaFormValues } from '@/lib/schemas/visaFormSchema';
import { useNavigate } from 'react-router-dom';

export type UploadProgressCallback = (progress: number) => void;

export const useVisaApplication = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(() => {
    return localStorage.getItem('current_application_id');
  });
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const createApplication = async (visaType: string, visaTypeId: string) => {
    try {
      setLoading(true);
      const response = await visaApplicationService.createApplication(visaTypeId);

      if (response.data) {
        setApplicationId(response.data.id);
        return response.data;
      }
    } catch (error) {
      console.error('[useVisaApplication] Failed to create application:', error);
      toast({
        title: "Error",
        description: "Failed to create application. Please try again.",
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
  ) => {
    if (!applicationId) {
      throw new Error("No application ID found");
    }

    try {
      const response = await visaApplicationService.uploadDocument(
        applicationId,
        documentType,
        file,
        onProgress
      );
      return response.data;
    } catch (error) {
      console.error('[useVisaApplication] Failed to upload document:', error);
      throw error;
    }
  };

  const submitApplication = async (formData: VisaFormValues) => {
    const applicationId = localStorage.getItem('current_application_id');
    const visaTypeId = localStorage.getItem('selected_visa_type_id');
    if (!applicationId) {
      throw new Error("No application ID found");
    }

    try {
      setLoading(true);

      // Update personal information
      await visaApplicationService.updatePersonalInfo(applicationId, formData.personalInfo);

      // Update travel information
      await visaApplicationService.updateTravelInfo(applicationId, {
        ...formData.travelInfo,
        visaTypeId: visaTypeId || ''
      });

      // Update financial information
      await visaApplicationService.updateFinancialInfo(applicationId, formData.financialInfo);

      // Submit the application
      const response = await visaApplicationService.submitApplication(applicationId);
      console.log(response);
      if (response.data) {
        setApplicationSubmitted(true);
        toast({
          title: "Application Submitted",
          description: "Your visa application has been submitted successfully. Redirecting to payment",
        });
        navigate(`/payment?applicationId=${applicationId}&visaTypeId=${visaTypeId}`);
        return {
          success: true,
          applicationId: applicationId,
          visaTypeId: visaTypeId,
        };
      }
    } catch (error: any) {
      console.error('[useVisaApplication] Failed to submit application:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      // throw error;
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
      transit: 30
    };
    return fees[visaType] || 50;
  };

  return {
    loading,
    applicationId,
    applicationSubmitted,
    createApplication,
    uploadDocument,
    submitApplication,
    calculateVisaFee,
  };
}; 