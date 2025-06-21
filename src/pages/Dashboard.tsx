import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Clock, CheckCircle, AlertCircle, RefreshCw, MessageCircle } from "lucide-react";
import { visaApplicationService } from "@/lib/api/services/visaapplication.service";
import { messagesService } from "@/lib/api/services/messages.service";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { UserMessagesTab } from "@/components/dashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("applications");

  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['applications'],
    queryFn: () => visaApplicationService.getUserApplications()
  });

  // Fetch unread message count for the dashboard card
  const { data: unreadCountData } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: () => messagesService.getUnreadCount(),
  });

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'SUBMITTED':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Submitted</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case 'APPROVED':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'SUBMITTED':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'UNDER_REVIEW':
        return <RefreshCw className="h-5 w-5 text-yellow-500" />;
      case 'APPROVED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'REJECTED':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Applications</CardTitle>
                <CardDescription>Currently being processed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{applications?.length || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Unread Messages</CardTitle>
                <CardDescription>Requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{unreadCountData?.data.count || 0}</div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            
            <TabsContent value="applications">
              <div className="grid grid-cols-1 gap-6">
                {!applications && (
                  <div className="text-center text-gray-500">
                    No applications found
                  </div>
                )}  
                {applications && applications.map((app) => (
                  <Card key={app.id} className="border-l-4 hover:shadow-md transition-shadow duration-200" style={{ borderLeftColor: app.status === 'APPROVED' ? '#1EB53A' : app.status === 'UNDER_REVIEW' ? '#f59e0b' : '#0052A5' }}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{app.visaType.name}</CardTitle>  
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
            
            <TabsContent value="messages">
              <UserMessagesTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
