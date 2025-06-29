import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Search, Plus, Calendar, User, Check, X, ChevronLeft, ChevronRight, Video, Eye, Loader2, Filter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { interviewService, Interview, CreateInterviewData, UpdateInterviewData, MarkInterviewCompletedData, Officer, ApplicationForInterview } from "@/lib/api/services/interview.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminInterviews = () => {
  const [createInterviewOpen, setCreateInterviewOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewInterviewOpen, setViewInterviewOpen] = useState(false);
  const [rescheduleInterviewOpen, setRescheduleInterviewOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [completeInterviewOpen, setCompleteInterviewOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [newInterviewDate, setNewInterviewDate] = useState("");
  const [newInterviewTime, setNewInterviewTime] = useState("");
  const [newInterviewLocation, setNewInterviewLocation] = useState("");
  const [newInterviewNotes, setNewInterviewNotes] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [selectedAssignedOfficerId, setSelectedAssignedOfficerId] = useState("");
  const [interviewOutcome, setInterviewOutcome] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch interviews
  const { data: interviewsResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['officer-interviews'],
    queryFn: () => interviewService.getOfficerInterviews(),
  });

  // Fetch officers for assignment
  const { data: officersResponse } = useQuery({
    queryKey: ['officers-for-assignment'],
    queryFn: () => interviewService.getOfficersForAssignment(),
  });

  // Fetch applications for scheduling
  const { data: applicationsResponse } = useQuery({
    queryKey: ['applications-for-scheduling'],
    queryFn: () => interviewService.getApplicationsForInterviewScheduling(),
  });

  const interviews = interviewsResponse?.data || [];
  const officers = officersResponse?.data || [];
  const applications = applicationsResponse?.data || [];

  // Mutations
  const createInterviewMutation = useMutation({
    mutationFn: (data: CreateInterviewData) => interviewService.createInterview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officer-interviews'] });
      setCreateInterviewOpen(false);
      resetCreateForm();
      toast({
        title: "Interview Scheduled",
        description: "Interview has been scheduled successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Schedule Interview",
        description: error.message || "An error occurred while scheduling the interview.",
        variant: "destructive",
      });
    },
  });

  const rescheduleInterviewMutation = useMutation({
    mutationFn: (data: UpdateInterviewData) => interviewService.rescheduleInterview(selectedInterview?.id || '', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officer-interviews'] });
      setRescheduleInterviewOpen(false);
      resetRescheduleForm();
      toast({
        title: "Interview Rescheduled",
        description: "Interview has been rescheduled successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Reschedule Interview",
        description: error.message || "An error occurred while rescheduling the interview.",
        variant: "destructive",
      });
    },
  });

  const cancelInterviewMutation = useMutation({
    mutationFn: (interviewId: string) => interviewService.cancelInterview(interviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officer-interviews'] });
      setCancelConfirmOpen(false);
      toast({
        title: "Interview Cancelled",
        description: "Interview has been cancelled successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Cancel Interview",
        description: error.message || "An error occurred while cancelling the interview.",
        variant: "destructive",
      });
    },
  });

  const completeInterviewMutation = useMutation({
    mutationFn: (data: MarkInterviewCompletedData) => interviewService.markInterviewCompleted(selectedInterview?.id || '', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officer-interviews'] });
      setCompleteInterviewOpen(false);
      resetCompleteForm();
      toast({
        title: "Interview Completed",
        description: "Interview has been marked as completed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Complete Interview",
        description: error.message || "An error occurred while marking the interview as completed.",
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const resetCreateForm = () => {
    setSelectedApplicationId("");
    setSelectedAssignedOfficerId("");
    setNewInterviewDate("");
    setNewInterviewTime("");
    setNewInterviewLocation("");
    setNewInterviewNotes("");
  };

  const resetRescheduleForm = () => {
    setNewInterviewDate("");
    setNewInterviewTime("");
    setNewInterviewLocation("");
    setNewInterviewNotes("");
  };

  const resetCompleteForm = () => {
    setInterviewOutcome("");
    setInterviewNotes("");
  };

  // Filter interviews based on search term and status
  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = 
      interview.application?.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.application?.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || interview.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const completedInterviews = filteredInterviews.filter(interview => interview.status === "COMPLETED");
  const upcomingInterviews = filteredInterviews.filter(interview => 
    interview.status === "SCHEDULED" || interview.status === "RESCHEDULED"
  );
  const cancelledInterviews = filteredInterviews.filter(interview => interview.status === "CANCELLED");

  // Calculate current date's interviews for calendar view
  const currentDateStr = viewDate.toISOString().split('T')[0];
  const todaysInterviews = upcomingInterviews.filter(interview => 
    interview.scheduledDate.startsWith(currentDateStr)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "RESCHEDULED":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Rescheduled</Badge>;
      case "COMPLETED":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getConfirmationBadge = (confirmed: boolean, confirmedAt?: string) => {
    if (confirmed) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <Check className="h-3 w-3 mr-1" />
          Confirmed
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    );
  };

  // Function to navigate between dates
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setViewDate(newDate);
  };
  
  // Function to handle viewing an interview
  const handleViewInterview = (interview: Interview) => {
    setSelectedInterview(interview);
    setViewInterviewOpen(true);
  };
  
  // Function to open reschedule dialog
  const handleOpenReschedule = (interview: Interview) => {
    setSelectedInterview(interview);
    setRescheduleInterviewOpen(true);
  };
  
  // Function to reschedule an interview
  const handleRescheduleInterview = () => {
    if (!newInterviewDate || !newInterviewTime || !selectedInterview) return;
    
    const scheduledDate = new Date(`${newInterviewDate}T${newInterviewTime}`);
    
    const data: UpdateInterviewData = {
      scheduledDate: scheduledDate.toISOString(),
      location: newInterviewLocation || selectedInterview.location,
      notes: newInterviewNotes || selectedInterview.notes,
    };
    
    rescheduleInterviewMutation.mutate(data);
  };
  
  // Function to open cancel confirmation
  const handleOpenCancelConfirm = (interview: Interview) => {
    setSelectedInterview(interview);
    setCancelConfirmOpen(true);
  };
  
  // Function to cancel an interview
  const handleCancelInterview = () => {
    if (!selectedInterview) return;
    cancelInterviewMutation.mutate(selectedInterview.id);
  };

  // Function to open complete interview dialog
  const handleOpenCompleteInterview = (interview: Interview) => {
    setSelectedInterview(interview);
    setCompleteInterviewOpen(true);
  };

  // Function to complete an interview
  const handleCompleteInterview = () => {
    if (!interviewOutcome.trim() || !selectedInterview) return;
    
    const data: MarkInterviewCompletedData = {
      outcome: interviewOutcome,
      notes: interviewNotes,
    };
    
    completeInterviewMutation.mutate(data);
  };

  // Function to create a new interview
  const handleCreateInterview = () => {
    if (!selectedApplicationId || !selectedAssignedOfficerId || !newInterviewDate || !newInterviewTime || !newInterviewLocation) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const scheduledDate = new Date(`${newInterviewDate}T${newInterviewTime}`);
    
    const data: CreateInterviewData = {
      applicationId: selectedApplicationId,
      assignedOfficerId: selectedAssignedOfficerId,
      scheduledDate: scheduledDate.toISOString(),
      location: newInterviewLocation,
      notes: newInterviewNotes,
    };
    
    createInterviewMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Interview Management" subtitle="Schedule and manage visa applicant interviews">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading interviews...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Interview Management" subtitle="Schedule and manage visa applicant interviews">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load interviews</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Interview Management" subtitle="Schedule and manage visa applicant interviews">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View - Left Side */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>View and manage scheduled interviews</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Calendar</h3>
                <Button variant="outline" size="sm" onClick={() => setViewDate(new Date())}>
                  Today
                </Button>
              </div>

              {/* Date Navigation */}
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="icon" onClick={() => navigateDate('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="font-medium">{formatDate(viewDate)}</h3>
                <Button variant="ghost" size="icon" onClick={() => navigateDate('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Today's Interviews */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  {todaysInterviews.length} Interviews
                </h4>
                {todaysInterviews.length > 0 ? (
                  <div className="space-y-3">
                    {todaysInterviews.map((interview) => (
                      <div 
                        key={interview.id} 
                        className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleViewInterview(interview)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback>
                                {interview.application?.user.name.split(" ").map((name: string) => name[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{interview.application?.user.name}</p>
                              <p className="text-xs text-muted-foreground">{formatTime(interview.scheduledDate)}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-muted">
                            {interview.application?.visaType.name}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground">No interviews scheduled</p>
                    <Button variant="link" size="sm" onClick={() => setCreateInterviewOpen(true)} className="mt-2">
                      Schedule Interview
                    </Button>
                  </div>
                )}
              </div>

              {/* Quick Schedule Button */}
              <Button onClick={() => setCreateInterviewOpen(true)} className="w-full mt-6">
                <Plus className="h-4 w-4 mr-2" />
                Schedule New Interview
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Interview List - Right Side */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Interview List</CardTitle>
              <CardDescription>View and manage scheduled and completed interviews</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-auto">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search applicants or ID..."
                      className="pl-9 w-full min-w-[240px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="RESCHEDULED">Rescheduled</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => refetch()}>
                    <Loader2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="upcoming">
                <TabsList className="mb-4 w-full sm:w-auto">
                  <TabsTrigger value="upcoming" className="flex-1 sm:flex-initial">
                    Upcoming ({upcomingInterviews.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="flex-1 sm:flex-initial">
                    Completed ({completedInterviews.length})
                  </TabsTrigger>
                  <TabsTrigger value="cancelled" className="flex-1 sm:flex-initial">
                    Cancelled ({cancelledInterviews.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  <div className="space-y-3">
                    {upcomingInterviews.length > 0 ? (
                      upcomingInterviews.map((interview) => (
                        <div key={interview.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>
                                  {interview.application?.user.name.split(" ").map((name: string) => name[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{interview.application?.user.name}</h3>
                                <p className="text-sm text-muted-foreground">{interview.application?.applicationNumber}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                              {getStatusBadge(interview.status)}
                              {getConfirmationBadge(interview.confirmed, interview.confirmedAt)}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground mr-2" />
                              <div>
                                <p className="text-xs text-muted-foreground">Date</p>
                                <p className="text-sm">{formatDateTime(interview.scheduledDate)}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                              <div>
                                <p className="text-xs text-muted-foreground">Time</p>
                                <p className="text-sm">{formatTime(interview.scheduledDate)}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-muted-foreground mr-2" />
                              <div>
                                <p className="text-xs text-muted-foreground">Assigned Officer</p>
                                <p className="text-sm">{interview.assignedOfficer?.name}</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate(`/dashboard/application/${interview.applicationId}`)}>
                              <Eye className="h-3 w-3" />
                              View Application
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleViewInterview(interview)}>
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleOpenReschedule(interview)}>
                              <Calendar className="h-3 w-3 mr-1" />
                              Reschedule
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500 hover:text-red-500"
                              onClick={() => handleOpenCancelConfirm(interview)}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleOpenCompleteInterview(interview)}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Mark Complete
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 border rounded-lg">
                        <p className="text-muted-foreground">No upcoming interviews found</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="completed">
                  <div className="space-y-3">
                    {completedInterviews.length > 0 ? (
                      completedInterviews.map((interview) => (
                        <div key={interview.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>
                                  {interview.application?.user.name.split(" ").map((name: string) => name[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{interview.application?.user.name}</h3>
                                <p className="text-sm text-muted-foreground">{interview.application?.applicationNumber}</p>
                              </div>
                            </div>
                            {getStatusBadge(interview.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground mr-2" />
                              <div>
                                <p className="text-xs text-muted-foreground">Date</p>
                                <p className="text-sm">{formatDateTime(interview.scheduledDate)}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                              <div>
                                <p className="text-xs text-muted-foreground">Time</p>
                                <p className="text-sm">{formatTime(interview.scheduledDate)}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-muted-foreground mr-2" />
                              <div>
                                <p className="text-xs text-muted-foreground">Assigned Officer</p>
                                <p className="text-sm">{interview.assignedOfficer?.name}</p>
                              </div>
                            </div>
                          </div>

                          {interview.outcome && (
                            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm font-medium">Outcome:</p>
                              <p className="text-sm text-muted-foreground">{interview.outcome}</p>
                            </div>
                          )}

                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewInterview(interview)}>
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/application/${interview.applicationId}`)}>
                              <Eye className="h-3 w-3 mr-1" />
                              View Application
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 border rounded-lg">
                        <p className="text-muted-foreground">No completed interviews found</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="cancelled">
                  <div className="space-y-3">
                    {cancelledInterviews.length > 0 ? (
                      cancelledInterviews.map((interview) => (
                        <div key={interview.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>
                                  {interview.application?.user.name.split(" ").map((name: string) => name[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{interview.application?.user.name}</h3>
                                <p className="text-sm text-muted-foreground">{interview.application?.applicationNumber}</p>
                              </div>
                            </div>
                            {getStatusBadge(interview.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground mr-2" />
                              <div>
                                <p className="text-xs text-muted-foreground">Date</p>
                                <p className="text-sm">{formatDateTime(interview.scheduledDate)}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                              <div>
                                <p className="text-xs text-muted-foreground">Time</p>
                                <p className="text-sm">{formatTime(interview.scheduledDate)}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-muted-foreground mr-2" />
                              <div>
                                <p className="text-xs text-muted-foreground">Assigned Officer</p>
                                <p className="text-sm">{interview.assignedOfficer?.name}</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewInterview(interview)}>
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/application/${interview.applicationId}`)}>
                              <Eye className="h-3 w-3 mr-1" />
                              View Application
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 border rounded-lg">
                        <p className="text-muted-foreground">No cancelled interviews found</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Interview Dialog */}
      <Dialog open={createInterviewOpen} onOpenChange={setCreateInterviewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Set up an interview with a visa applicant. You'll be able to add this to your calendar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Application *</label>
              <Select value={selectedApplicationId} onValueChange={setSelectedApplicationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an application" />
                </SelectTrigger>
                <SelectContent>
                  {applications.map((application) => (
                    <SelectItem key={application.id} value={application.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{application.applicationNumber}</span>
                        <span className="text-sm text-muted-foreground">
                          {application.applicantName} - {application.visaTypeName}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assign Officer *</label>
              <Select value={selectedAssignedOfficerId} onValueChange={setSelectedAssignedOfficerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an officer to assign" />
                </SelectTrigger>
                <SelectContent>
                  {officers.map((officer) => (
                    <SelectItem key={officer.id} value={officer.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{officer.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {officer.department} {officer.title && `- ${officer.title}`}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Interview Date *</label>
              <Input 
                type="date" 
                value={newInterviewDate}
                onChange={(e) => setNewInterviewDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Interview Time *</label>
              <Input 
                type="time" 
                value={newInterviewTime}
                onChange={(e) => setNewInterviewTime(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Location *</label>
              <Input 
                placeholder="Interview location"
                value={newInterviewLocation}
                onChange={(e) => setNewInterviewLocation(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea 
                placeholder="Add any notes or special instructions..."
                value={newInterviewNotes}
                onChange={(e) => setNewInterviewNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateInterviewOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateInterview}
              disabled={createInterviewMutation.isPending}
            >
              {createInterviewMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                'Schedule Interview'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Interview Dialog */}
      <Dialog open={viewInterviewOpen} onOpenChange={setViewInterviewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Interview Details</DialogTitle>
            <DialogDescription>
              Details for the interview with {selectedInterview?.application?.user.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInterview && (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    {selectedInterview.application?.user.name.split(" ").map((name: string) => name[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{selectedInterview.application?.user.name}</h3>
                  <p className="text-muted-foreground">{selectedInterview.application?.applicationNumber}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDateTime(selectedInterview.scheduledDate)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time</p>
                  <p className="font-medium">{formatTime(selectedInterview.scheduledDate)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Visa Type</p>
                  <p className="font-medium">{selectedInterview.application?.visaType.name}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="font-medium">{getStatusBadge(selectedInterview.status)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Confirmation</p>
                  <p className="font-medium">{getConfirmationBadge(selectedInterview.confirmed, selectedInterview.confirmedAt)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned Officer</p>
                  <p className="font-medium">{selectedInterview.assignedOfficer?.name}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Scheduler</p>
                  <p className="font-medium">{selectedInterview.scheduler?.name}</p>
                </div>
                
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedInterview.location}</p>
                </div>
              </div>
              
              {selectedInterview.notes && (
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
                  <p className="text-sm">{selectedInterview.notes}</p>
                </div>
              )}

              {selectedInterview.outcome && (
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Outcome</p>
                  <p className="text-sm">{selectedInterview.outcome}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(`/dashboard/application/${selectedInterview.applicationId}`)}>
                  <Eye className="h-3 w-3 mr-2" />
                  View Application
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setViewInterviewOpen(false)}>
              Close
            </Button>
            <div className="flex space-x-2">
              {selectedInterview && selectedInterview.status !== 'COMPLETED' && selectedInterview.status !== 'CANCELLED' && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setViewInterviewOpen(false);
                      handleOpenReschedule(selectedInterview);
                    }}
                  >
                    <Calendar className="h-3 w-3 mr-2" />
                    Reschedule
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setViewInterviewOpen(false);
                      handleOpenCompleteInterview(selectedInterview);
                    }}
                  >
                    <Check className="h-3 w-3 mr-2" />
                    Mark as Completed
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reschedule Interview Dialog */}
      <Dialog open={rescheduleInterviewOpen} onOpenChange={setRescheduleInterviewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reschedule Interview</DialogTitle>
            <DialogDescription>
              Change the date and time for this interview
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Applicant</label>
              <Input value={selectedInterview?.application?.user.name || ""} disabled />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">New Interview Date</label>
              <Input 
                type="date" 
                value={newInterviewDate} 
                onChange={(e) => setNewInterviewDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">New Interview Time</label>
              <Input 
                type="time" 
                value={newInterviewTime} 
                onChange={(e) => setNewInterviewTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input 
                placeholder="Interview location"
                value={newInterviewLocation} 
                onChange={(e) => setNewInterviewLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea 
                placeholder="Add any notes or special instructions..."
                value={newInterviewNotes} 
                onChange={(e) => setNewInterviewNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleInterviewOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRescheduleInterview}
              disabled={rescheduleInterviewMutation.isPending}
            >
              {rescheduleInterviewMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rescheduling...
                </>
              ) : (
                'Reschedule Interview'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Cancel Confirm Dialog */}
      <Dialog open={cancelConfirmOpen} onOpenChange={setCancelConfirmOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Cancel Interview</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this interview? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedInterview && (
            <div className="py-4">
              <p className="font-medium">{selectedInterview.application?.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(selectedInterview.scheduledDate)}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelConfirmOpen(false)}>
              No, Keep Interview
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelInterview}
              disabled={cancelInterviewMutation.isPending}
            >
              {cancelInterviewMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Yes, Cancel Interview'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Interview Dialog */}
      <Dialog open={completeInterviewOpen} onOpenChange={setCompleteInterviewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Mark Interview as Completed</DialogTitle>
            <DialogDescription>
              Record the outcome and notes for this completed interview
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Applicant</label>
              <Input value={selectedInterview?.application?.user.name || ""} disabled />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Interview Outcome *</label>
              <Textarea 
                placeholder="Describe the interview outcome..."
                value={interviewOutcome}
                onChange={(e) => setInterviewOutcome(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea 
                placeholder="Add any additional notes..."
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteInterviewOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCompleteInterview}
              disabled={completeInterviewMutation.isPending}
            >
              {completeInterviewMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Completing...
                </>
              ) : (
                'Mark as Completed'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminInterviews;
