
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserProfile from "@/components/profile/UserProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Clock, CheckCircle, AlertCircle, RefreshCw, Bell, MessageCircle } from "lucide-react";
import { VisaApplication } from "@/types";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("applications");
  
  // Mock data for demonstration
  const [applications, setApplications] = useState<VisaApplication[]>([
    {
      id: "app-001",
      userId: "user-123",
      visaType: "Tourist Visa",
      status: "under-review",
      submissionDate: "2025-04-10T10:30:00Z",
      personalInfo: {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1985-06-15",
        nationality: "United States",
        passportNumber: "US12345678",
        passportExpiryDate: "2028-01-01",
        gender: "Male",
        email: "john.doe@example.com",
        phone: "+1234567890"
      },
      travelInfo: {
        purpose: "Tourism",
        entryDate: "2025-06-01",
        exitDate: "2025-06-15",
        accommodation: "Hotel Bujumbura"
      },
      documents: {
        passport: "passport.pdf",
        photo: "photo.jpg",
        itinerary: "itinerary.pdf"
      }
    },
    {
      id: "app-002",
      userId: "user-123",
      visaType: "Business Visa",
      status: "submitted",
      submissionDate: "2025-05-05T14:20:00Z",
      personalInfo: {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1985-06-15",
        nationality: "United States",
        passportNumber: "US12345678",
        passportExpiryDate: "2028-01-01",
        gender: "Male",
        email: "john.doe@example.com",
        phone: "+1234567890"
      },
      travelInfo: {
        purpose: "Business Meeting",
        entryDate: "2025-07-10",
        exitDate: "2025-07-20",
        accommodation: "Kiriri Garden Hotel"
      },
      documents: {
        passport: "passport.pdf",
        photo: "photo.jpg",
        invitation: "invitation_letter.pdf"
      }
    }
  ]);

  // Format date function
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100">Draft</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Submitted</Badge>;
      case 'under-review':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'draft':
        return <FileText className="h-5 w-5 text-gray-500" />;
      case 'submitted':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'under-review':
        return <RefreshCw className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Mock notifications
  const notifications = [
    {
      id: "notif-1",
      message: "Your Tourist Visa application is under review.",
      date: "2025-05-12T09:45:00Z",
      read: false
    },
    {
      id: "notif-2",
      message: "Please upload additional documents for your Business Visa application.",
      date: "2025-05-10T15:30:00Z",
      read: true
    },
    {
      id: "notif-3",
      message: "Your application fee payment has been confirmed.",
      date: "2025-05-05T11:20:00Z",
      read: true
    }
  ];

  // Mock messages
  const messages = [
    {
      id: "msg-1",
      from: "Immigration Officer",
      subject: "Additional document required",
      message: "Please provide a hotel reservation confirmation for your upcoming visit.",
      date: "2025-05-11T13:20:00Z",
      read: false
    },
    {
      id: "msg-2",
      from: "System",
      subject: "Application Update",
      message: "Your visa application has moved to the review phase.",
      date: "2025-05-09T10:15:00Z",
      read: true
    }
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={true} />
      
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-primary">Applicant Dashboard</h1>
              <p className="text-gray-600">Manage your visa applications and communications</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button onClick={() => navigate('/profile')} variant="outline">
                My Profile
              </Button>
              <Link to="/visa-types">
                <Button className="bg-secondary hover:bg-secondary/90">New Application</Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Applications</CardTitle>
                <CardDescription>Currently being processed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Unread Messages</CardTitle>
                <CardDescription>Requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>Application updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1</div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="applications">
              <div className="grid grid-cols-1 gap-6">
                {applications.map((app) => (
                  <Card key={app.id} className="border-l-4 hover:shadow-md transition-shadow duration-200" style={{ borderLeftColor: app.status === 'approved' ? '#1EB53A' : app.status === 'under-review' ? '#f59e0b' : '#0052A5' }}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{app.visaType}</CardTitle>
                          <CardDescription>
                            Submitted on {formatDate(app.submissionDate)}
                          </CardDescription>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Application ID</p>
                          <p className="font-medium">{app.id}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Travel Dates</p>
                          <p className="font-medium">
                            {formatDate(app.travelInfo.entryDate)} - {formatDate(app.travelInfo.exitDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Purpose</p>
                          <p className="font-medium">{app.travelInfo.purpose}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Status</p>
                          <div className="flex items-center">
                            {getStatusIcon(app.status)}
                            <span className="ml-2 capitalize">
                              {app.status.replace(/-/g, ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          onClick={() => navigate(`/application/${app.id}`)}
                        >
                          <Eye className="mr-1 h-4 w-4" /> View Details
                        </Button>
                        {app.status === "draft" && (
                          <Button variant="outline" size="sm" className="flex items-center">
                            <FileText className="mr-1 h-4 w-4" /> Edit Draft
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Notifications</CardTitle>
                  <CardDescription>Your latest application updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-4 border rounded-md ${notification.read ? 'bg-white' : 'bg-green-50'}`}
                      >
                        <div className="flex items-start space-x-3">
                          <Bell className={`h-5 w-5 mt-0.5 ${notification.read ? 'text-gray-400' : 'text-secondary'}`} />
                          <div className="flex-1">
                            <p className={`${notification.read ? 'font-normal' : 'font-medium'}`}>
                              {notification.message}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(notification.date)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Messages</CardTitle>
                  <CardDescription>Communications regarding your applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id}
                        className={`p-4 border rounded-md ${message.read ? 'bg-white' : 'bg-green-50'} hover:shadow-sm transition-shadow duration-200 cursor-pointer`}
                        onClick={() => navigate(`/message/${message.id}`)}
                      >
                        <div className="flex items-start space-x-3">
                          <MessageCircle className={`h-5 w-5 mt-0.5 ${message.read ? 'text-gray-400' : 'text-secondary'}`} />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{message.from}</p>
                                <p className="text-sm text-gray-600">
                                  {message.subject}
                                </p>
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatDate(message.date)}
                              </span>
                            </div>
                            <p className="mt-2 text-gray-700">{message.message}</p>
                            <div className="mt-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/message/${message.id}`);
                                }}
                              >
                                View Message
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile">
              <UserProfile />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
