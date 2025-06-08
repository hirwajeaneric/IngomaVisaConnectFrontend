import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Search, Plus, Calendar, User, UserPlus, Check, X, ChevronLeft, ChevronRight, Video } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

const AdminInterviews = () => {
  const [createInterviewOpen, setCreateInterviewOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [viewInterviewOpen, setViewInterviewOpen] = useState(false);
  const [rescheduleInterviewOpen, setRescheduleInterviewOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [newInterviewDate, setNewInterviewDate] = useState("");
  const [newInterviewTime, setNewInterviewTime] = useState("");
  
  // Helper to format dates
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Mock data for scheduled interviews
  const [interviews, setInterviews] = useState([
    {
      id: "int-001",
      applicant: "John Smith",
      applicationId: "APP-2354",
      visaType: "Tourist",
      date: "2025-05-20",
      time: "09:00 AM",
      duration: "30 minutes",
      officer: "Sarah Nkurunziza",
      status: "scheduled",
    },
    {
      id: "int-002",
      applicant: "Maria Garcia",
      applicationId: "APP-2353",
      visaType: "Work",
      date: "2025-05-20",
      time: "10:00 AM",
      duration: "45 minutes",
      officer: "Jean Hakizimana",
      status: "scheduled",
    },
    {
      id: "int-003",
      applicant: "Liu Wei",
      applicationId: "APP-2352",
      visaType: "Business",
      date: "2025-05-21",
      time: "11:30 AM",
      duration: "30 minutes",
      officer: "Sarah Nkurunziza",
      status: "scheduled",
    },
    {
      id: "int-004",
      applicant: "Ahmed Hassan",
      applicationId: "APP-2351",
      visaType: "Student",
      date: "2025-05-22",
      time: "02:00 PM",
      duration: "45 minutes",
      officer: "Eric Ndayishimiye",
      status: "scheduled",
    },
    {
      id: "int-005",
      applicant: "David Kim",
      applicationId: "APP-2348",
      visaType: "Work",
      date: "2025-05-18",
      time: "10:30 AM",
      duration: "30 minutes",
      officer: "Jean Hakizimana",
      status: "completed",
    },
    {
      id: "int-006",
      applicant: "Sofia Rossi",
      applicationId: "APP-2345",
      visaType: "Tourist",
      date: "2025-05-15",
      time: "11:00 AM",
      duration: "30 minutes",
      officer: "Sarah Nkurunziza",
      status: "completed",
    },
  ]);

  const completedInterviews = interviews.filter(interview => interview.status === "completed");
  const upcomingInterviews = interviews.filter(interview => interview.status === "scheduled");

  // Filter interviews based on search term
  const filteredUpcoming = upcomingInterviews.filter(interview => 
    interview.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.applicationId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCompleted = completedInterviews.filter(interview => 
    interview.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.applicationId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate current date's interviews for calendar view
  const currentDateStr = viewDate.toISOString().split('T')[0];
  const todaysInterviews = upcomingInterviews.filter(interview => interview.date === currentDateStr);

  const getStatusBadge = (status: string) => {
    if (status === "scheduled") {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Scheduled</Badge>;
    } else if (status === "completed") {
      return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
    } else if (status === "cancelled") {
      return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
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
  const handleViewInterview = (interview: any) => {
    setSelectedInterview(interview);
    setViewInterviewOpen(true);
  };
  
  // Function to open reschedule dialog
  const handleOpenReschedule = (interview: any) => {
    setSelectedInterview(interview);
    setRescheduleInterviewOpen(true);
  };
  
  // Function to reschedule an interview
  const handleRescheduleInterview = () => {
    if (!newInterviewDate || !newInterviewTime || !selectedInterview) return;
    
    const updatedInterviews = interviews.map(interview => {
      if (interview.id === selectedInterview.id) {
        return {
          ...interview,
          date: newInterviewDate,
          time: newInterviewTime
        };
      }
      return interview;
    });
    
    setInterviews(updatedInterviews);
    setRescheduleInterviewOpen(false);
    
    toast({
      title: "Interview Rescheduled",
      description: `Interview with ${selectedInterview.applicant} has been rescheduled to ${newInterviewDate} at ${newInterviewTime}.`
    });
  };
  
  // Function to open cancel confirmation
  const handleOpenCancelConfirm = (interview: any) => {
    setSelectedInterview(interview);
    setCancelConfirmOpen(true);
  };
  
  // Function to cancel an interview
  const handleCancelInterview = () => {
    if (!selectedInterview) return;
    
    const updatedInterviews = interviews.filter(
      interview => interview.id !== selectedInterview.id
    );
    
    setInterviews(updatedInterviews);
    setCancelConfirmOpen(false);
    
    toast({
      title: "Interview Cancelled",
      description: `Interview with ${selectedInterview.applicant} has been cancelled.`
    });
  };

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
                                {interview.applicant.split(" ").map(name => name[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{interview.applicant}</p>
                              <p className="text-xs text-muted-foreground">{interview.time}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-muted">
                            {interview.visaType}
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
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon">
                    <User className="h-4 w-4" />
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
                </TabsList>

                <TabsContent value="upcoming">
                  <div className="space-y-3">
                    {filteredUpcoming.length > 0 ? (
                      filteredUpcoming.map((interview) => (
                        <div key={interview.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>
                                  {interview.applicant.split(" ").map(name => name[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{interview.applicant}</h3>
                                <p className="text-sm text-muted-foreground">{interview.applicationId}</p>
                              </div>
                            </div>
                            {getStatusBadge(interview.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground mr-2" />
                              <div>
                                <p className="text-xs text-muted-foreground">Date</p>
                                <p className="text-sm">
                                  {new Date(interview.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                              <div>
                                <p className="text-xs text-muted-foreground">Time</p>
                                <p className="text-sm">{interview.time} ({interview.duration})</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-muted-foreground mr-2" />
                              <div>
                                <p className="text-xs text-muted-foreground">Officer</p>
                                <p className="text-sm">{interview.officer}</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => handleViewInterview(interview)}>
                              <Video className="h-3 w-3" />
                              Join Interview
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleOpenReschedule(interview)}>Reschedule</Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500 hover:text-red-500"
                              onClick={() => handleOpenCancelConfirm(interview)}
                            >
                              Cancel
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
                    {filteredCompleted.length > 0 ? (
                      filteredCompleted.map((interview) => (
                        <div key={interview.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>
                                  {interview.applicant.split(" ").map(name => name[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{interview.applicant}</h3>
                                <p className="text-sm text-muted-foreground">{interview.applicationId}</p>
                              </div>
                            </div>
                            {getStatusBadge(interview.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground mr-2" />
                              <div>
                                <p className="text-xs text-muted-foreground">Date</p>
                                <p className="text-sm">
                                  {new Date(interview.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                              <div>
                                <p className="text-xs text-muted-foreground">Time</p>
                                <p className="text-sm">{interview.time} ({interview.duration})</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-muted-foreground mr-2" />
                              <div>
                                <p className="text-xs text-muted-foreground">Officer</p>
                                <p className="text-sm">{interview.officer}</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm">View Notes</Button>
                            <Button variant="outline" size="sm">View Application</Button>
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
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Interview Dialog */}
      <Dialog open={createInterviewOpen} onOpenChange={setCreateInterviewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Set up an interview with a visa applicant. You'll be able to add this to your calendar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Applicant</label>
              <select className="w-full p-2 border rounded-md" title="Select an applicant">
                <option>Select an applicant</option>
                <option value="APP-2354">John Smith - APP-2354 (Tourist)</option>
                <option value="APP-2353">Maria Garcia - APP-2353 (Work)</option>
                <option value="APP-2352">Liu Wei - APP-2352 (Business)</option>
                <option value="APP-2351">Ahmed Hassan - APP-2351 (Student)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Interview Date</label>
              <Input type="date" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Interview Time</label>
              <Input type="time" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <select className="w-full p-2 border rounded-md" title="Select a duration">
                <option value="15">15 minutes</option>
                <option value="30" selected>30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Assigned Officer</label>
              <select className="w-full p-2 border rounded-md" title="Select an officer">
                <option value="sarah">Sarah Nkurunziza</option>
                <option value="jean">Jean Hakizimana</option>
                <option value="eric">Eric Ndayishimiye</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea placeholder="Add any notes or special instructions..." />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateInterviewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreateInterviewOpen(false)}>
              Schedule Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Interview Dialog */}
      <Dialog open={viewInterviewOpen} onOpenChange={setViewInterviewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Interview Details</DialogTitle>
            <DialogDescription>
              Details for the interview with {selectedInterview?.applicant}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInterview && (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    {selectedInterview.applicant.split(" ").map((name: string) => name[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{selectedInterview.applicant}</h3>
                  <p className="text-muted-foreground">{selectedInterview.applicationId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {new Date(selectedInterview.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedInterview.time}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedInterview.duration}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Visa Type</p>
                  <p className="font-medium">{selectedInterview.visaType}</p>
                </div>
                
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Assigned Officer</p>
                  <p className="font-medium">{selectedInterview.officer}</p>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
                <p className="text-sm">
                  {selectedInterview.notes || "No notes have been added for this interview."}
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setViewInterviewOpen(false)}>
              Close
            </Button>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setViewInterviewOpen(false);
                  handleOpenReschedule(selectedInterview);
                }}
              >
                Reschedule
              </Button>
              <Button 
                onClick={() => {
                  setViewInterviewOpen(false);
                  // This would launch the video interview in a real app
                  toast({
                    title: "Joining Interview",
                    description: "Connecting to video interview..."
                  });
                }}
              >
                Join Interview
              </Button>
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
              <Input value={selectedInterview?.applicant || ""} disabled />
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
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleInterviewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRescheduleInterview}>
              Reschedule Interview
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
              <p className="font-medium">{selectedInterview.applicant}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(selectedInterview.date).toLocaleDateString()} at {selectedInterview.time}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelConfirmOpen(false)}>
              No, Keep Interview
            </Button>
            <Button variant="destructive" onClick={handleCancelInterview}>
              Yes, Cancel Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminInterviews;
