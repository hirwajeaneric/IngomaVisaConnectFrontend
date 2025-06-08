import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Clock, 
  FileText, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  AlertCircle, 
  Download, 
  Calendar as CalendarIcon,
  CreditCard,
  User
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { generatePDF } from "@/lib/report-generator";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AdminApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [currentTab, setCurrentTab] = useState("overview");
  const [processingStatus, setProcessingStatus] = useState("under-review");
  const [notes, setNotes] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  
  // New state for document verification and request
  const [selectedDocument, setSelectedDocument] = useState<{name: string, type: string, size: string, verified: boolean} | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [requestDocumentName, setRequestDocumentName] = useState("");
  const [requestDocumentDetails, setRequestDocumentDetails] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // Mock application data
  const application = {
    id: id || "APP-2354",
    status: "under-review",
    submissionDate: "2025-05-14T09:45:00Z",
    lastUpdated: "2025-05-15T14:20:00Z",
    assignedTo: "Officer Sarah Nkurunziza",
    visaType: "Tourist",
    applicant: {
      fullName: "John Smith",
      dateOfBirth: "1985-06-15",
      gender: "Male",
      nationality: "United States",
      residenceCountry: "United States",
      passportNumber: "US12345678",
      passportIssueDate: "2020-03-10",
      passportExpiryDate: "2030-03-09",
      email: "john.smith@example.com",
      phone: "+1234567890",
      occupation: "Software Engineer",
      employer: "Tech Solutions Inc.",
    },
    travelInfo: {
      purposeOfVisit: "Tourism and wildlife photography",
      entryDate: "2025-06-20",
      exitDate: "2025-07-05",
      accommodation: "Kiriri Garden Hotel, Bujumbura",
      previousVisits: "No",
      visitedCountries: "Kenya, Rwanda, Tanzania",
    },
    financialInfo: {
      fundingSource: "Self",
      monthlyIncome: "$8,500",
    },
    documents: [
      { name: "Passport Copy", type: "pdf", size: "1.2 MB", verified: true },
      { name: "Photo", type: "jpeg", size: "320 KB", verified: true },
      { name: "Flight Itinerary", type: "pdf", size: "580 KB", verified: false },
      { name: "Hotel Reservation", type: "pdf", size: "420 KB", verified: false },
      { name: "Bank Statement", type: "pdf", size: "890 KB", verified: false },
      { name: "Travel Insurance", type: "pdf", size: "760 KB", verified: false },
      { name: "Yellow Fever Certificate", type: "pdf", size: "450 KB", verified: false },
    ],
    history: [
      { 
        date: "2025-05-15 14:20", 
        action: "Application status updated to 'Under Review'", 
        by: "System" 
      },
      { 
        date: "2025-05-14 09:45", 
        action: "Application submitted", 
        by: "Applicant" 
      },
      { 
        date: "2025-05-14 09:30", 
        action: "Payment confirmed", 
        by: "Payment System" 
      },
    ],
    messages: [
      {
        id: "msg-1",
        date: "2025-05-15 15:30",
        from: "Officer Sarah Nkurunziza",
        content: "Hello Mr. Smith, we require additional information about your planned activities in Burundi. Could you please provide a detailed itinerary?",
        read: true,
      },
      {
        id: "msg-2",
        date: "2025-05-15 16:45",
        from: "John Smith",
        content: "Hello Officer, thank you for your message. I plan to visit Bujumbura for 3 days, then travel to Gitega for 2 days, followed by a visit to Kibira National Park for wildlife photography. I'll send a detailed itinerary document shortly.",
        read: true,
      },
    ],
    payment: {
      id: "PAY-5678",
      amount: "$90.00",
      currency: "USD",
      date: "2025-05-14 09:30",
      method: "Credit Card",
      status: "Paid",
    },
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
    const statusMap: { [key: string]: { color: string; label: string } } = {
      "pending": { color: "bg-blue-100 text-blue-800", label: "Pending" },
      "under-review": { color: "bg-amber-100 text-amber-800", label: "Under Review" },
      "document-requested": { color: "bg-purple-100 text-purple-800", label: "Documents Requested" },
      "interview-scheduled": { color: "bg-indigo-100 text-indigo-800", label: "Interview Scheduled" },
      "approved": { color: "bg-green-100 text-green-800", label: "Approved" },
      "rejected": { color: "bg-red-100 text-red-800", label: "Rejected" },
    };

    const { color, label } = statusMap[status] || { color: "bg-gray-100 text-gray-800", label: status };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
        {label}
      </span>
    );
  };

  const handleUpdateStatus = () => {
    // In a real implementation, this would call an API to update the status
    console.log(`Updating application ${id} status to ${processingStatus}`);
    alert(`Application status updated to: ${processingStatus}`);
  };

  const handleAddNote = () => {
    if (notes.trim()) {
      // In a real implementation, this would add a note to the application
      console.log(`Adding note to application ${id}: ${notes}`);
      alert("Note added successfully!");
      setNotes("");
    }
  };

  const handleScheduleInterview = () => {
    if (interviewDate) {
      // In a real implementation, this would schedule an interview
      console.log(`Scheduling interview for application ${id} on ${interviewDate}`);
      alert(`Interview scheduled for: ${interviewDate}`);
      setProcessingStatus("interview-scheduled");
    }
  };

  // Enhanced function to export application as PDF
  const handleExportPDF = async () => {
    try {
      const reportData = {
        title: `Visa Application - ${application.applicant.fullName}`,
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

  // New functions for document handling
  const handleDocumentVerify = () => {
    if (!selectedDocument) return;
    
    // In a real implementation, this would call an API to mark the document as verified
    console.log(`Verifying document: ${selectedDocument.name}`);
    toast({
      title: "Document Verified",
      description: `${selectedDocument.name} has been marked as verified.`,
    });
    
    // Update the document status in the UI
    application.documents = application.documents.map(doc => 
      doc.name === selectedDocument.name ? {...doc, verified: true} : doc
    );
    
    setSelectedDocument(null);
  };
  
  const handleDocumentReject = () => {
    if (!selectedDocument || !rejectionReason.trim()) return;
    
    // In a real implementation, this would call an API to reject the document
    console.log(`Rejecting document: ${selectedDocument.name}, Reason: ${rejectionReason}`);
    toast({
      title: "Document Rejected",
      description: `${selectedDocument.name} has been rejected.`,
      variant: "destructive",
    });
    
    setSelectedDocument(null);
    setRejectionReason("");
  };
  
  const handleRequestDocument = () => {
    if (!requestDocumentName.trim()) return;
    
    // In a real implementation, this would call an API to request a new document
    console.log(`Requesting document: ${requestDocumentName}, Details: ${requestDocumentDetails}`);
    toast({
      title: "Document Requested",
      description: `${requestDocumentName} has been requested from the applicant.`,
    });
    
    // Add the requested document to history
    application.history.unshift({
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      action: `Additional document requested: ${requestDocumentName}`,
      by: application.assignedTo,
    });
    
    setRequestDocumentName("");
    setRequestDocumentDetails("");
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real implementation, this would call an API to send a message
    console.log(`Sending message: ${newMessage}`);
    
    // Add the new message to the conversation
    application.messages.unshift({
      id: `msg-${application.messages.length + 1}`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      from: application.assignedTo,
      content: newMessage,
      read: false,
    });
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the applicant.",
    });
    
    setNewMessage("");
  };

  return (
    <AdminLayout title={`Application ${id}`} subtitle="Review and process visa application">
      <div className="space-y-6">
        {/* Application Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold">{application.applicant.fullName}</h2>
                  {getStatusBadge(application.status)}
                </div>
                <p className="text-gray-500 mt-1">
                  {application.visaType} Visa Application • {application.id}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
                  <FileText className="h-4 w-4" />
                  Export PDF
                </Button>
                <Button variant="secondary" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
                <Button className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Submitted on</p>
                  <p className="font-medium">{formatDateTime(application.submissionDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Last update</p>
                  <p className="font-medium">{formatDateTime(application.lastUpdated)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <User className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Assigned to</p>
                  <p className="font-medium">{application.assignedTo}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for Application Details */}
        <Tabs defaultValue="overview" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applicant">Applicant</TabsTrigger>
            <TabsTrigger value="travel">Travel Info</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Application Processing */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Application Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Update Status</label>
                      <div className="flex items-center gap-4 mt-1">
                        <Select 
                          value={processingStatus}
                          onValueChange={setProcessingStatus}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="under-review">Under Review</SelectItem>
                            <SelectItem value="document-requested">Document Requested</SelectItem>
                            <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={handleUpdateStatus}>Update</Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Officer Notes</label>
                      <Textarea 
                        placeholder="Add your notes about this application..."
                        className="mt-1"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                      <Button className="mt-2" variant="outline" onClick={handleAddNote}>
                        Add Note
                      </Button>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Schedule Interview</label>
                      <div className="flex items-center gap-4 mt-1">
                        <Input 
                          type="datetime-local" 
                          value={interviewDate}
                          onChange={(e) => setInterviewDate(e.target.value)}
                        />
                        <Button variant="outline" onClick={handleScheduleInterview}>
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Application Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Applicant</dt>
                      <dd className="mt-1 text-sm">{application.applicant.fullName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Nationality</dt>
                      <dd className="mt-1 text-sm">{application.applicant.nationality}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Passport</dt>
                      <dd className="mt-1 text-sm">{application.applicant.passportNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Visit Purpose</dt>
                      <dd className="mt-1 text-sm">{application.travelInfo.purposeOfVisit}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Travel Dates</dt>
                      <dd className="mt-1 text-sm">
                        {formatDate(application.travelInfo.entryDate)} - {formatDate(application.travelInfo.exitDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Payment</dt>
                      <dd className="mt-1 text-sm">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {application.payment.status}
                        </Badge> {application.payment.amount}
                      </dd>
                    </div>
                  </dl>
                  
                  <div className="mt-6 flex space-x-4">
                    <Button className="flex-1" variant="destructive">
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application.history.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                        <Clock className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm">{item.action}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.date} • {item.by}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Applicant Tab */}
          <TabsContent value="applicant">
            <Card>
              <CardHeader>
                <CardTitle>Applicant Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <div className="mb-6">
                      <AspectRatio ratio={3/4} className="border rounded-lg overflow-hidden bg-muted">
                        <img 
                          src="/placeholder.svg"
                          alt={`${application.applicant.fullName}'s photo`} 
                          className="object-cover"
                        />
                      </AspectRatio>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Passport Number</p>
                        <p className="font-medium">{application.applicant.passportNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Passport Issue Date</p>
                        <p>{formatDate(application.applicant.passportIssueDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Passport Expiry Date</p>
                        <p>{formatDate(application.applicant.passportExpiryDate)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                        <p className="font-medium">{application.applicant.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                        <p>{formatDate(application.applicant.dateOfBirth)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Gender</p>
                        <p>{application.applicant.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Nationality</p>
                        <p>{application.applicant.nationality}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Country of Residence</p>
                        <p>{application.applicant.residenceCountry}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p>{application.applicant.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                        <p>{application.applicant.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Occupation</p>
                        <p>{application.applicant.occupation}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Employer</p>
                        <p>{application.applicant.employer}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Financial Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Source of Funding</p>
                          <p>{application.financialInfo.fundingSource}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Monthly Income</p>
                          <p>{application.financialInfo.monthlyIncome}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex space-x-4">
                      <Button variant="outline" className="gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Flag for Review
                      </Button>
                      <Button className="gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Verify Identity
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Travel Info Tab */}
          <TabsContent value="travel">
            <Card>
              <CardHeader>
                <CardTitle>Travel Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Purpose of Visit</p>
                    <p className="mt-1">{application.travelInfo.purposeOfVisit}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Entry Date</p>
                    <p className="mt-1">{formatDate(application.travelInfo.entryDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Exit Date</p>
                    <p className="mt-1">{formatDate(application.travelInfo.exitDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                    <p className="mt-1">
                      {Math.ceil((new Date(application.travelInfo.exitDate).getTime() - 
                        new Date(application.travelInfo.entryDate).getTime()) / 
                        (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Accommodation in Burundi</p>
                    <p className="mt-1">{application.travelInfo.accommodation}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Previous Visits to Burundi</p>
                    <p className="mt-1">{application.travelInfo.previousVisits}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Countries Visited in Last 6 Months</p>
                    <p className="mt-1">{application.travelInfo.visitedCountries}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Submitted Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.type.toUpperCase()} • {doc.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {doc.verified ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Verified
                          </Badge>
                        ) : (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setSelectedDocument(doc)}
                              >
                                Verify
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Verify Document</DialogTitle>
                                <DialogDescription>
                                  Review and verify "{doc.name}" or reject it with a reason.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="flex flex-col space-y-4 py-4">
                                <div className="flex items-center space-x-4">
                                  <FileText className="h-8 w-8 text-primary" />
                                  <div>
                                    <p className="font-medium">{doc.name}</p>
                                    <p className="text-sm text-muted-foreground">{doc.type.toUpperCase()} • {doc.size}</p>
                                  </div>
                                </div>
                                
                                <div className="border rounded-md p-4">
                                  <p className="text-sm">Document preview would appear here in a real application.</p>
                                </div>
                                
                                <Textarea
                                  placeholder="Reason for rejection (required if rejecting)"
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  className="min-h-[100px]"
                                />
                              </div>
                              
                              <DialogFooter className="flex justify-between sm:justify-between">
                                <Button 
                                  variant="destructive" 
                                  onClick={handleDocumentReject}
                                  disabled={!rejectionReason.trim()}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                <Button 
                                  onClick={handleDocumentVerify}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Verify
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Request Additional Documents</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Request Additional Document</DialogTitle>
                        <DialogDescription>
                          Specify which document you need from the applicant.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="flex flex-col space-y-4 py-4">
                        <div>
                          <label htmlFor="documentName" className="text-sm font-medium mb-1 block">
                            Document Name*
                          </label>
                          <Input
                            id="documentName"
                            placeholder="e.g., Bank Statement, Medical Certificate"
                            value={requestDocumentName}
                            onChange={(e) => setRequestDocumentName(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="documentDetails" className="text-sm font-medium mb-1 block">
                            Additional Details (Optional)
                          </label>
                          <Textarea
                            id="documentDetails"
                            placeholder="Please provide any specific requirements for this document..."
                            value={requestDocumentDetails}
                            onChange={(e) => setRequestDocumentDetails(e.target.value)}
                            className="min-h-[100px]"
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button 
                          onClick={handleRequestDocument}
                          disabled={!requestDocumentName.trim()}
                        >
                          Send Request
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {application.messages.map((message) => (
                    <div key={message.id} className={`flex ${message.from === "John Smith" ? "justify-end" : ""}`}>
                      <div className={`flex max-w-[75%] ${message.from === "John Smith" ? "flex-row-reverse" : ""}`}>
                        <Avatar className={`h-8 w-8 ${message.from === "John Smith" ? "ml-3" : "mr-3"}`}>
                          <AvatarImage 
                            src={message.from === "John Smith" ? "/placeholder.svg" : "/placeholder.svg"} 
                            alt={message.from}
                          />
                          <AvatarFallback>
                            {message.from === "John Smith" ? "JS" : "SN"}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className={`p-3 rounded-lg ${
                            message.from === "John Smith" 
                            ? "bg-primary text-white" 
                            : "bg-muted"
                          }`}>
                            <p>{message.content}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {message.date} • {message.from}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex items-center space-x-2">
                  <Textarea 
                    placeholder="Type your message..." 
                    className="min-h-[80px]"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button 
                    className="ml-2 shrink-0"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >Send</Button>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <Button variant="outline">
                    Reply Templates
                  </Button>
                  <Button>
                    Send Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Application History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 border-l border-gray-200">
                  {application.history.map((item, index) => (
                    <div key={index} className="mb-8 relative">
                      <div className="absolute -left-[21px] h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-white" />
                      </div>
                      <p className="font-medium">{item.action}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.date} • {item.by}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Payment Tab */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-6 rounded-lg border border-border mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Payment ID: {application.payment.id}</p>
                        <p className="text-sm text-muted-foreground">{application.payment.date}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {application.payment.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Amount</p>
                    <p className="font-medium text-xl mt-1">{application.payment.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                    <p className="mt-1">{application.payment.method}</p>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Payment Details</h3>
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-muted">
                      <tr>
                        <td className="py-3 text-muted-foreground">Visa Application Fee</td>
                        <td className="py-3 text-right">{application.payment.amount}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-muted-foreground">Processing Fee</td>
                        <td className="py-3 text-right">$0.00</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-muted-foreground">Tax</td>
                        <td className="py-3 text-right">$0.00</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium">Total</td>
                        <td className="py-3 text-right font-medium">{application.payment.amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => {
                      // In a real app, this would download the receipt
                      toast({
                        title: "Receipt Downloaded",
                        description: "The payment receipt has been downloaded successfully.",
                      });
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Download Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminApplicationDetail;
