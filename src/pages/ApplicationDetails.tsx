
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, CheckCircle2, Clock, FileText, MessageSquare, User, Video } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { generatePDF } from "@/lib/report-generator";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("status");
  const [newMessage, setNewMessage] = useState("");

  // Mock application data - in a real app, this would be fetched from an API
  const application = {
    id: id || "APP-2354",
    status: "under-review",
    submissionDate: "2025-05-14T09:45:00Z",
    lastUpdated: "2025-05-15T14:20:00Z",
    visaType: "Tourist",
    applicantName: "John Smith",
    applicantEmail: "john.smith@example.com",
    estimatedProcessingDays: 7,
    daysRemaining: 5,
    progress: 40,
    documents: [
      { name: "Passport Copy", status: "verified", updatedAt: "2025-05-14" },
      { name: "Photo", status: "verified", updatedAt: "2025-05-14" },
      { name: "Flight Itinerary", status: "pending", updatedAt: "2025-05-14" },
      { name: "Hotel Reservation", status: "pending", updatedAt: "2025-05-14" },
      { name: "Bank Statement", status: "requested", updatedAt: "2025-05-15" },
    ],
    history: [
      { date: "2025-05-15T14:20:00Z", action: "Application status updated to 'Under Review'", by: "System" },
      { date: "2025-05-15T10:15:00Z", action: "Additional document requested: Bank Statement", by: "Officer Sarah" },
      { date: "2025-05-14T09:45:00Z", action: "Application submitted", by: "Applicant" },
      { date: "2025-05-14T09:30:00Z", action: "Payment confirmed", by: "Payment System" },
    ],
    messages: [
      { id: 1, date: "2025-05-15T14:25:00Z", from: "Officer Sarah", content: "Hello Mr. Smith, we require additional information about your planned activities in Burundi. Could you please provide a detailed itinerary?" },
    ],
    interviews: [
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
    ],
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>;
      case "under-review":
        return <Badge className="bg-amber-100 text-amber-800">Under Review</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-gray-100">Pending</Badge>;
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "requested":
        return <Badge className="bg-purple-100 text-purple-800">Requested</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // In a real implementation, this would call an API to send a message
    console.log(`Sending message: ${newMessage}`);

    // Add the new message to the messages array
    application.messages.push({
      id: application.messages.length + 1,
      date: new Date().toISOString(),
      from: "John Smith",
      content: newMessage
    });

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the visa officer.",
    });

    setNewMessage("");
  };

  // Function to handle PDF download
  const handleDownloadPDF = async () => {
    try {
      // Prepare data for the PDF
      const reportData = {
        title: `Visa Application - ${application.applicantName}`,
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
          id: application.id,
          status: application.status,
          visaType: application.visaType,
          applicantName: application.applicantName,
          submissionDate: formatDateTime(application.submissionDate),
          estimatedCompletion: `${application.daysRemaining} days remaining`,
          documents: application.documents,
          history: application.history.map(event => ({
            date: formatDateTime(event.date),
            action: event.action,
            by: event.by
          })),
          interviews: application.interviews.map(interview => ({
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
                    <h2 className="text-2xl font-bold">{application.visaType} Visa</h2>
                    {getStatusBadge(application.status)}
                  </div>
                  <p className="text-muted-foreground">Application ID: {application.id}</p>
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
                    style={{ width: `${application.progress}%` }}
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
                    <p className="text-sm text-muted-foreground">Estimated completion</p>
                    <p className="font-medium">
                      {application.daysRemaining} days remaining
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last update</p>
                    <p className="font-medium">{formatDateTime(application.lastUpdated)}</p>
                  </div>
                </div>

                {application.interviews.length > 0 && (
                  <div className="flex items-center">
                    <Video className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Interview scheduled</p>
                      <p className="font-medium">
                        {formatDate(application.interviews[0].date)} at {application.interviews[0].time}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="mb-4">
              <TabsTrigger value="status">Status & Timeline</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="interview">Interview</TabsTrigger>
            </TabsList>

            {/* Status Tab */}
            <TabsContent value="status">
              <Card>
                <CardHeader>
                  <CardTitle>Application Timeline</CardTitle>
                  <CardDescription>
                    Track the progress of your visa application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-6 border-l border-gray-200">
                    {application.history.map((event, index) => (
                      <div key={index} className="mb-8 relative">
                        <div className="absolute -left-[13px] h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center">
                          <div className="h-3 w-3 rounded-full bg-primary" />
                        </div>
                        <p className="font-medium">{event.action}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDateTime(event.date)} • {event.by}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Application Documents</CardTitle>
                  <CardDescription>
                    Status of your submitted documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {application.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30"
                      >
                        <div className="flex items-center">
                          <div
                            className={`h-10 w-10 rounded-lg flex items-center justify-center mr-4 ${doc.status === 'verified' ? 'bg-green-100' :
                              doc.status === 'requested' ? 'bg-purple-100' : 'bg-gray-100'
                              }`}
                          >
                            <FileText className={`h-5 w-5 ${doc.status === 'verified' ? 'text-green-600' :
                              doc.status === 'requested' ? 'text-purple-600' : 'text-gray-600'
                              }`} />
                          </div>
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Updated: {formatDate(doc.updatedAt)}
                            </p>
                          </div>
                        </div>
                        <div>
                          {getStatusBadge(doc.status)}
                          {doc.status === 'requested' && (
                            <Button size="sm" className="ml-4 mt-2">
                              Upload
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>
                    Communication with visa officers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {application.messages.length > 0 ? (
                      application.messages.map((message) => (
                        <div key={message.id} className={`flex ${message.from === "John Smith" ? "justify-end" : ""}`}>
                          <div className={`flex max-w-[75%] ${message.from === "John Smith" ? "flex-row-reverse" : ""}`}>
                            <Avatar className={`h-8 w-8 ${message.from === "John Smith" ? "ml-2" : "mr-2"}`}>
                              <AvatarFallback>{message.from === "John Smith" ? "JS" : "OS"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className={`p-3 rounded-lg ${message.from === "John Smith"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/20"
                                }`}>
                                <p>{message.content}</p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDateTime(message.date)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
                        <p className="mt-2 text-muted-foreground">No messages yet</p>
                      </div>
                    )}

                    <div className="mt-8 border-t pt-4">
                      <div className="flex flex-col space-y-4">
                        <Textarea
                          placeholder="Type your message here..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <Button
                          className="w-full sm:w-auto self-end"
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                  {application.interviews.length > 0 ? (
                    <div className="space-y-8">
                      {application.interviews.map((interview) => (
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
