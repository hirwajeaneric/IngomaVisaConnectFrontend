import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { visaApplicationService } from "@/lib/api/services/visaapplication.service";
import { generatePDF } from "@/lib/report-generator";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import {
  ApplicationHeader,
  ApplicationProcessing,
  ApplicationSummary,
  ApplicantInfo,
  TravelInfo,
  DocumentsList,
  MessagesTab,
  PaymentInfo,
  ApplicationTravelInfo
} from "@/components/application-details";
import { Document } from "@/components/application-details/types";

const AdminApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [currentTab, setCurrentTab] = useState("overview");
  const [processingStatus, setProcessingStatus] = useState("under-review");
  const [notes, setNotes] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const queryClient = useQueryClient();

  const { data: applicationData, isLoading, error, refetch } = useQuery({
    queryKey: ["application", id],
    queryFn: () => visaApplicationService.getApplicationById(id as string),
  });

  // Update documents state when application data loads
  React.useEffect(() => {
    if (applicationData?.documents) {
      setDocuments(applicationData.documents);
    }
  }, [applicationData]);

  const passportPhoto = applicationData?.documents.find(doc => doc.documentType === "passportCopy");
  const application = applicationData;

  if (isLoading) {
    return (
      <AdminLayout title={`Application ${id}`} subtitle="Review and process visa application">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading application details...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error || !application) {
    return (
      <AdminLayout title={`Application ${id}`} subtitle="Review and process visa application">
        <div className="text-center text-red-600">
          <p>Failed to load application details</p>
          <button onClick={() => window.location.reload()} className="mt-2 px-4 py-2 bg-primary text-white rounded">
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  const handleUpdateStatus = () => {
    console.log(`Updating application ${id} status to ${processingStatus}`);
    alert(`Application status updated to: ${processingStatus}`);
  };

  const handleAddNote = () => {
    if (notes.trim()) {
      console.log(`Adding note to application ${id}: ${notes}`);
      alert("Note added successfully!");
      setNotes("");
    }
  };

  const handleScheduleInterview = () => {
    if (interviewDate) {
      console.log(`Scheduling interview for application ${id} on ${interviewDate}`);
      alert(`Interview scheduled for: ${interviewDate}`);
      setProcessingStatus("interview-scheduled");
    }
  };

  const handleExportPDF = async () => {
    try {
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
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Coat_of_arms_of_Burundi.svg/250px-Coat_of_arms_of_Burundi.svg.png'
      };
      
      await generatePDF(reportData);
      
      toast({
        title: "PDF Exported Successfully",
        description: "Application details have been exported as PDF."
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the application details.",
        variant: "destructive",
      });
    }
  };

  const handleDocumentUpdate = async (updatedDocuments: Document[] | null) => {
    if (updatedDocuments === null) {
      // This indicates we need to refetch from the server
      try {
        await refetch();
        toast({
          title: "Documents Refreshed",
          description: "Document list has been updated from the server.",
        });
      } catch (error) {
        toast({
          title: "Refresh Failed",
          description: "Failed to refresh documents. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Update local state with the new document data
      setDocuments(updatedDocuments);
    }
  };

  const applicantName = `${application.personalInfo.firstName} ${application.personalInfo.lastName}`;

  return (
    <AdminLayout title={`Application ${application.applicationNumber}`} subtitle="Review and process visa application">
      <div className="space-y-6">
        {/* Application Header */}
        <ApplicationHeader 
          application={application}
          onExportPDF={handleExportPDF}
        />
        
        {/* Tabs for Application Details */}
        <Tabs defaultValue="overview" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applicant">Applicant</TabsTrigger>
            <TabsTrigger value="travel">Travel Info</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ApplicationProcessing 
                processingStatus={processingStatus}
                setProcessingStatus={setProcessingStatus}
                notes={notes}
                setNotes={setNotes}
                interviewDate={interviewDate}
                setInterviewDate={setInterviewDate}
                onUpdateStatus={handleUpdateStatus}
                onAddNote={handleAddNote}
                onScheduleInterview={handleScheduleInterview}
              />
              <ApplicationSummary application={application} />
            </div>
          </TabsContent>
          
          {/* Applicant Tab */}
          <TabsContent value="applicant">
            <ApplicantInfo 
              application={application}
              passportPhoto={passportPhoto}
            />
          </TabsContent>
          
          {/* Travel Info Tab */}
          <TabsContent value="travel">
            <ApplicationTravelInfo travelInfo={application.travelInfo} />
          </TabsContent>
          
          {/* Documents Tab */}
          <TabsContent value="documents">
            <DocumentsList 
              documents={documents}
              onDocumentUpdate={handleDocumentUpdate}
            />
          </TabsContent>
          
          {/* Messages Tab */}
          <TabsContent value="messages">
            <MessagesTab 
              applicationId={application.id}
              applicantName={applicantName}
              applicantId={application.personalInfo.userId}
            />
          </TabsContent>
          
          {/* Payment Tab */}
          <TabsContent value="payment">
            <PaymentInfo payment={application.payment} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminApplicationDetail;
