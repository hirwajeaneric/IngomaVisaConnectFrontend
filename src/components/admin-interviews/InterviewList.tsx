import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import { Interview } from "@/lib/api/services/interview.service";
import InterviewCard from "./InterviewCard";

interface InterviewListProps {
  interviews: Interview[];
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onRefetch: () => void;
  onViewInterview: (interview: Interview) => void;
  onRescheduleInterview: (interview: Interview) => void;
  onCancelInterview: (interview: Interview) => void;
  onCompleteInterview: (interview: Interview) => void;
  onViewApplication: (applicationId: string) => void;
}

const InterviewList: React.FC<InterviewListProps> = ({
  interviews,
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onRefetch,
  onViewInterview,
  onRescheduleInterview,
  onCancelInterview,
  onCompleteInterview,
  onViewApplication,
}) => {
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

  return (
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
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
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
            <Button variant="outline" size="icon" onClick={onRefetch}>
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
                  <InterviewCard
                    key={interview.id}
                    interview={interview}
                    onViewInterview={onViewInterview}
                    onRescheduleInterview={onRescheduleInterview}
                    onCancelInterview={onCancelInterview}
                    onCompleteInterview={onCompleteInterview}
                    onViewApplication={onViewApplication}
                  />
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
                  <InterviewCard
                    key={interview.id}
                    interview={interview}
                    onViewInterview={onViewInterview}
                    onRescheduleInterview={onRescheduleInterview}
                    onCancelInterview={onCancelInterview}
                    onCompleteInterview={onCompleteInterview}
                    onViewApplication={onViewApplication}
                  />
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
                  <InterviewCard
                    key={interview.id}
                    interview={interview}
                    onViewInterview={onViewInterview}
                    onRescheduleInterview={onRescheduleInterview}
                    onCancelInterview={onCancelInterview}
                    onCompleteInterview={onCompleteInterview}
                    onViewApplication={onViewApplication}
                  />
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
  );
};

export default InterviewList; 