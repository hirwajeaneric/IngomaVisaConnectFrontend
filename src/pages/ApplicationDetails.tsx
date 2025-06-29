import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generatePDF } from "@/lib/report-generator";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { visaApplicationService } from "@/lib/api/services/visaapplication.service";
import { requestForDocumentService } from "@/lib/api/services/requestForDocument.service";
import { interviewService } from "@/lib/api/services/interview.service";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { RequestForDocument } from "@/types";
import { formatDate, formatDateTime } from "@/lib/utils";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/configs/firebase';
import {
  ApplicationHeader,
  ApplicationDocuments,
  ApplicationMessages,
  ApplicationInterview,
} from "@/components/applicant-application-details";

const ApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("documents");
  const queryClient = useQueryClient();

  const { data: application, isLoading, error } = useQuery({
    queryKey: ['application', id],
    queryFn: () => visaApplicationService.getApplicationById(id as string),
    enabled: !!id
  });

  // Fetch interviews for this application
  const { data: interviewsResponse } = useQuery({
    queryKey: ['application-interviews', id],
    queryFn: () => interviewService.getApplicationInterviews(id as string),
    enabled: !!id
  });

  const interviews = interviewsResponse?.data || [];

  // Mutation for confirming interviews
  const confirmInterviewMutation = useMutation({
    mutationFn: (interviewId: string) => interviewService.confirmInterview(interviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application-interviews', id] });
      toast({
        title: "Interview Confirmed",
        description: "You have successfully confirmed your interview appointment.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Confirm Interview",
        description: error.message || "An error occurred while confirming the interview.",
        variant: "destructive",
      });
    },
  });

  // Function to handle PDF download
  const handleDownloadPDF = async () => {
    if (!application) return;

    try {
      // Prepare data for the PDF
      const reportData = {
        title: `Visa Application - ${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
        dateRange: {
          from: formatDate(application.submissionDate),
          to: 'Present',
        },
        includeDetails: true,
        reportType: 'application_detail',
        generatedAt: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Coat_of_arms_of_Burundi.svg/250px-Coat_of_arms_of_Burundi.svg.png',
        applicationData: {
          id: application.applicationNumber,
          status: application.status,
          visaType: application.visaType.name,
          applicantName: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
          submissionDate: formatDateTime(application.submissionDate),
          estimatedCompletion: "Processing",
          documents: application.documents.map(doc => ({
            name: doc.documentType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            status: doc.verificationStatus,
            updatedAt: formatDate(doc.uploadDate)
          })),
          interviews: interviews.map(interview => ({
            date: formatDate(interview.scheduledDate),
            time: new Date(interview.scheduledDate).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            status: interview.status,
            location: interview.location
          }))
        }
      };

      await generatePDF(reportData);

      toast({
        title: "PDF Downloaded",
        description: "Your application details have been downloaded as a PDF.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);

      toast({
        title: "Download Failed",
        description: "There was an error downloading your application details.",
        variant: "destructive",
      });
    }
  };

  const handleDocumentRequestsUpdate = async (updatedRequests: RequestForDocument[] | null) => {
    if (updatedRequests === null) {
      // This indicates we need to refetch from the server
      try {
        await queryClient.invalidateQueries({ queryKey: ['application', id] });
        toast({
          title: "Document Requests Refreshed",
          description: "Document requests have been updated from the server.",
        });
      } catch (error) {
        toast({
          title: "Refresh Failed",
          description: "Failed to refresh document requests. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const uploadDocumentToFirebase = async (file: File, applicationId: string, documentType: string): Promise<string> => {
    const storageRef = ref(storage, `requested-documents/${applicationId}-${documentType}-${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log('Upload progress:', progress);
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  const handleSubmitDocumentForRequest = async (requestId: string, documentType: string, file: File) => {
    if (!application?.id) return;

    try {
      // Upload to Firebase first
      const filePath = await uploadDocumentToFirebase(file, application.id, documentType);
      
      // Submit the document for the request
      const response = await requestForDocumentService.submitDocumentForRequest(requestId, {
        documentType,
        fileName: file.name,
        filePath,
        fileSize: file.size,
      });

      if (response.success) {
        toast({
          title: "Document Submitted",
          description: "Document has been submitted successfully for review.",
        });
        // Refresh the application data to update the requests list
        await queryClient.invalidateQueries({ queryKey: ['application', id] });
      } else {
        toast({
          title: "Submission Failed",
          description: response.message || "Failed to submit document.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting document:', error);
      toast({
        title: "Submission Failed",
        description: "An error occurred while submitting the document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmInterview = (interviewId: string) => {
    confirmInterviewMutation.mutate(interviewId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading application details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Failed to load application details</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <ApplicationHeader 
            application={application}
            onDownloadPDF={handleDownloadPDF}
          />

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="mb-4">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="interview">Interview</TabsTrigger>
            </TabsList>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <ApplicationDocuments
                application={application}
                onDocumentRequestsUpdate={handleDocumentRequestsUpdate}
                onSubmitDocument={handleSubmitDocumentForRequest}
              />
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <ApplicationMessages application={application} />
            </TabsContent>

            {/* Interview Tab */}
            <TabsContent value="interview">
              <ApplicationInterview
                interviews={interviews}
                onConfirmInterview={handleConfirmInterview}
                isConfirming={confirmInterviewMutation.isPending}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApplicationDetails;
