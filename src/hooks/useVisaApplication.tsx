
import { useState, useEffect } from "react";
import { VisaFormValues } from "@/lib/schemas/visaFormSchema";
import { useToast } from "@/hooks/use-toast";

export const useVisaApplication = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [applicationId, setApplicationId] = useState<string>("");
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  
  // Generate application ID - in real app would come from server
  const generateApplicationId = () => {
    return `BDI-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  // Calculate visa fee based on type
  const calculateVisaFee = (visaType: string): number => {
    switch (visaType) {
      case "tourist": return 50;
      case "business": return 100;
      case "work": return 200;
      case "student": return 75;
      case "transit": return 30;
      default: return 50;
    }
  };

  // Handler for form submission
  const submitApplication = (formData: VisaFormValues) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Store application data in localStorage (in a real app, this would go to a server)
        const newApplicationId = generateApplicationId();
        const visaFee = calculateVisaFee(formData.travelInfo.visaType);
        
        const application = {
          id: newApplicationId,
          submissionDate: new Date().toISOString(),
          status: "draft",
          visaType: formData.travelInfo.visaType,
          fee: visaFee,
          data: formData
        };
        
        // Save to localStorage (simulating database storage)
        const applications = JSON.parse(localStorage.getItem("visaApplications") || "[]");
        applications.push(application);
        localStorage.setItem("visaApplications", JSON.stringify(applications));
        
        setApplicationId(newApplicationId);
        setApplicationSubmitted(true);
        
        toast({
          title: "Application Submitted",
          description: "Your visa application has been received. Please complete payment to process your application.",
        });
      } catch (error) {
        console.error("Error submitting application:", error);
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your application. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return {
    loading,
    applicationId,
    applicationSubmitted,
    submitApplication,
    calculateVisaFee
  };
};
