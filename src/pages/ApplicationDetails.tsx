import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle2, Clock, FileText, User, Video, Upload } from "lucide-react";
import { generatePDF } from "@/lib/report-generator";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { visaApplicationService } from "@/lib/api/services/visaapplication.service";
import { requestForDocumentService } from "@/lib/api/services/requestForDocument.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VisaApplicationResponse, RequestForDocument } from "@/types";
import { getStatusBadge } from "@/components/widgets";
import { formatDate, formatDateTime } from "@/lib/utils";
import { ApplicationMessagesTab } from "@/components/dashboard";
import { DocumentRequestsList } from "@/components/application-details";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/configs/firebase';

const ApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("documents");
  const queryClient = useQueryClient();

  const { data: application, isLoading, error } = useQuery({
    queryKey: ['application', id],
    queryFn: () => visaApplicationService.getApplicationById(id as string),
    enabled: !!id
  });

  const mockInterviews = [
    {
      id: "int-001",
      date: "2025-05-20",
      time: "09:00 AM",
      duration: "30 minutes",
      officer: "Sarah Nkurunziza",
      status: "scheduled",
      joinUrl: "#",
      location: "Online (Video Call)",
    }
  ];

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="bg-gray-100">Pending</Badge>;
      case "VERIFIED":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case "passportCopy":
        return "Passport Copy";
      case "photos":
        return "Passport Photos";
      case "yellowFeverCertificate":
        return "Yellow Fever Certificate";
      case "travelInsurance":
        return "Travel Insurance";
      case "bankStatement":
        return "Bank Statement";
      case "employmentLetter":
        return "Employment Letter";
      case "invitationLetter":
        return "Invitation Letter";
      default:
        return type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
  };

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
            name: getDocumentTypeName(doc.documentType),
            status: doc.verificationStatus,
            updatedAt: formatDate(doc.uploadDate)
          })),
          interviews: mockInterviews.map(interview => ({
            date: formatDate(interview.date),
            time: interview.time,
            duration: interview.duration,
            officer: interview.officer,
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Application Details</h1>
              <p className="text-muted-foreground mt-1">
                Track the status of your visa application
              </p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0" onClick={handleDownloadPDF}>
              <FileText className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold">{application.visaType.name}</h2>
                    {getStatusBadge(application.status)}
                  </div>
                  <p className="text-muted-foreground">Application ID: {application.applicationNumber}</p>
                </div>

                <div className="flex flex-col mt-4 md:mt-0 md:text-right">
                  <p className="text-sm text-muted-foreground">Submitted on</p>
                  <p className="font-medium">{formatDateTime(application.submissionDate)}</p>
                </div>
              </div>

              <div className="mt-8">
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-primary rounded-full"
                    style={{ width: application.status === 'APPROVED' ? '100%' : application.status === 'UNDER_REVIEW' ? '60%' : '30%' }}
                  />
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Submitted</span>
                  <span>Under Review</span>
                  <span>Decision</span>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Processing time</p>
                    <p className="font-medium">
                      {application.visaType.processingTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Visa duration</p>
                    <p className="font-medium">{application.visaType.duration}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <User className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Applicant</p>
                    <p className="font-medium">
                      {application.personalInfo.firstName} {application.personalInfo.lastName}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="mb-4">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="interview">Interview</TabsTrigger>
            </TabsList>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Documents</CardTitle>
                    <CardDescription>
                      Status of your submitted documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {application.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30"
                        >
                          <div className="flex items-center">
                            <div
                              className={`h-10 w-10 rounded-lg flex items-center justify-center mr-4 ${doc.verificationStatus === 'VERIFIED' ? 'bg-green-100' :
                                doc.verificationStatus === 'REJECTED' ? 'bg-red-100' : 'bg-gray-100'
                                }`}
                            >
                              <FileText className={`h-5 w-5 ${doc.verificationStatus === 'VERIFIED' ? 'text-green-600' :
                                doc.verificationStatus === 'REJECTED' ? 'text-red-600' : 'text-gray-600'
                                }`} />
                            </div>
                            <div>
                              <p className="font-medium">{getDocumentTypeName(doc.documentType)}</p>
                              <p className="text-sm text-muted-foreground">
                                Uploaded: {formatDate(doc.uploadDate)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                File: {doc.fileName}
                              </p>
                            </div>
                          </div>
                          <div>
                            {getDocumentStatusBadge(doc.verificationStatus)}
                            {doc.verificationStatus === 'REJECTED' && doc.rejectionReason && (
                              <p className="text-sm text-red-600 mt-1">{doc.rejectionReason}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Document Requests Section */}
                {application.requestForDocuments && application.requestForDocuments.length > 0 && (
                  <DocumentRequestsList
                    applicationId={application.id}
                    requests={application.requestForDocuments}
                    onRequestsUpdate={handleDocumentRequestsUpdate}
                    userRole="APPLICANT"
                    onSubmitDocument={handleSubmitDocumentForRequest}
                  />
                )}
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <ApplicationMessagesTab 
                applicationId={application.id}
                applicantName={`${application.personalInfo.firstName} ${application.personalInfo.lastName}`}
                applicantId={application.userId}
                officerId={application.officerId}
              />
            </TabsContent>

            {/* Interview Tab */}
            <TabsContent value="interview">
              <Card>
                <CardHeader>
                  <CardTitle>Interview Schedule</CardTitle>
                  <CardDescription>
                    Details of your upcoming visa interview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {mockInterviews.length > 0 ? (
                    <div className="space-y-8">
                      {mockInterviews.map((interview) => (
                        <div key={interview.id} className="border rounded-lg p-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Visa Interview</h3>
                            {getStatusBadge(interview.status)}
                          </div>

                          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                              <div>
                                <p className="text-sm text-muted-foreground">Date</p>
                                <p className="font-medium">{formatDate(interview.date)}</p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-muted-foreground mr-3" />
                              <div>
                                <p className="text-sm text-muted-foreground">Time</p>
                                <p className="font-medium">{interview.time} ({interview.duration})</p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <User className="h-5 w-5 text-muted-foreground mr-3" />
                              <div>
                                <p className="text-sm text-muted-foreground">Interview Officer</p>
                                <p className="font-medium">{interview.officer}</p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <Video className="h-5 w-5 text-muted-foreground mr-3" />
                              <div>
                                <p className="text-sm text-muted-foreground">Location</p>
                                <p className="font-medium">{interview.location}</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-8 space-x-3">
                            {interview.status === 'scheduled' && (
                              <Button>
                                <Video className="h-4 w-4 mr-2" />
                                Join Interview
                              </Button>
                            )}
                            <Button variant="outline">Reschedule</Button>
                          </div>

                          <div className="mt-6 bg-muted/30 p-4 rounded-lg">
                            <div className="flex items-center">
                              <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                              <h4 className="font-medium">Interview Preparation Tips</h4>
                            </div>
                            <ul className="mt-2 ml-7 list-disc text-sm space-y-1">
                              <li>Have your passport and application documents ready</li>
                              <li>Test your camera and microphone before the interview</li>
                              <li>Find a quiet place with good lighting</li>
                              <li>Be prepared to answer questions about your travel plans</li>
                              <li>Dress formally as you would for an in-person interview</li>
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Video className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
                      <p className="mt-2 text-muted-foreground">
                        No interview has been scheduled yet
                      </p>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                        If an interview is required for your application, you will be notified
                        and the details will appear here.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApplicationDetails;
