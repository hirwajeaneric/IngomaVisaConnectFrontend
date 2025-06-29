import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { interviewService, Interview, CreateInterviewData, UpdateInterviewData, MarkInterviewCompletedData } from "@/lib/api/services/interview.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  InterviewCalendar,
  InterviewList,
  CreateInterviewDialog,
  ViewInterviewDialog,
  RescheduleInterviewDialog,
  CancelInterviewDialog,
  CompleteInterviewDialog,
} from "@/components/admin-interviews";

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

  // Calculate current date's interviews for calendar view
  const currentDateStr = viewDate.toISOString().split('T')[0];
  const todaysInterviews = interviews.filter(interview => 
    interview.status === "SCHEDULED" || interview.status === "RESCHEDULED"
  ).filter(interview => 
    interview.scheduledDate.startsWith(currentDateStr)
  );

  // Mutations
  const createInterviewMutation = useMutation({
    mutationFn: (data: CreateInterviewData) => interviewService.createInterview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officer-interviews'] });
      setCreateInterviewOpen(false);
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

  // Event handlers
  const handleNavigateDate = (direction: 'prev' | 'next' | 'today') => {
    const newDate = new Date(viewDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (direction === 'next') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (direction === 'today') {
      newDate.setTime(Date.now());
    }
    setViewDate(newDate);
  };

  const handleViewInterview = (interview: Interview) => {
    setSelectedInterview(interview);
    setViewInterviewOpen(true);
  };

  const handleRescheduleInterview = (interview: Interview) => {
    setSelectedInterview(interview);
    setRescheduleInterviewOpen(true);
  };

  const handleCancelInterview = (interview: Interview) => {
    setSelectedInterview(interview);
    setCancelConfirmOpen(true);
  };

  const handleCompleteInterview = (interview: Interview) => {
    setSelectedInterview(interview);
    setCompleteInterviewOpen(true);
  };

  const handleViewApplication = (applicationId: string) => {
    navigate(`/dashboard/application/${applicationId}`);
  };

  const handleCreateInterview = (data: CreateInterviewData) => {
    createInterviewMutation.mutate(data);
  };

  const handleRescheduleInterviewSubmit = (data: UpdateInterviewData) => {
    rescheduleInterviewMutation.mutate(data);
  };

  const handleCancelInterviewSubmit = () => {
    if (!selectedInterview) return;
    cancelInterviewMutation.mutate(selectedInterview.id);
  };

  const handleCompleteInterviewSubmit = (data: MarkInterviewCompletedData) => {
    completeInterviewMutation.mutate(data);
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
          <InterviewCalendar
            viewDate={viewDate}
            todaysInterviews={todaysInterviews}
            onNavigateDate={handleNavigateDate}
            onViewInterview={handleViewInterview}
            onCreateInterview={() => setCreateInterviewOpen(true)}
          />
        </div>

        {/* Interview List - Right Side */}
        <div className="lg:col-span-2">
          <InterviewList
            interviews={interviews}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            onRefetch={refetch}
            onViewInterview={handleViewInterview}
            onRescheduleInterview={handleRescheduleInterview}
            onCancelInterview={handleCancelInterview}
            onCompleteInterview={handleCompleteInterview}
            onViewApplication={handleViewApplication}
          />
        </div>
      </div>

      {/* Dialogs */}
      <CreateInterviewDialog
        open={createInterviewOpen}
        onOpenChange={setCreateInterviewOpen}
        applications={applications}
        officers={officers}
        onCreateInterview={handleCreateInterview}
        isLoading={createInterviewMutation.isPending}
      />

      <ViewInterviewDialog
        open={viewInterviewOpen}
        onOpenChange={setViewInterviewOpen}
        interview={selectedInterview}
        onViewApplication={handleViewApplication}
        onRescheduleInterview={handleRescheduleInterview}
        onCompleteInterview={handleCompleteInterview}
      />

      <RescheduleInterviewDialog
        open={rescheduleInterviewOpen}
        onOpenChange={setRescheduleInterviewOpen}
        interview={selectedInterview}
        onRescheduleInterview={handleRescheduleInterviewSubmit}
        isLoading={rescheduleInterviewMutation.isPending}
      />

      <CancelInterviewDialog
        open={cancelConfirmOpen}
        onOpenChange={setCancelConfirmOpen}
        interview={selectedInterview}
        onCancelInterview={handleCancelInterviewSubmit}
        isLoading={cancelInterviewMutation.isPending}
      />

      <CompleteInterviewDialog
        open={completeInterviewOpen}
        onOpenChange={setCompleteInterviewOpen}
        interview={selectedInterview}
        onCompleteInterview={handleCompleteInterviewSubmit}
        isLoading={completeInterviewMutation.isPending}
      />
    </AdminLayout>
  );
};

export default AdminInterviews;
