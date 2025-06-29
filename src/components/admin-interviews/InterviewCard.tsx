import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar as CalendarIcon, Clock, User, Check, X, Eye, Calendar } from "lucide-react";
import { Interview } from "@/lib/api/services/interview.service";

interface InterviewCardProps {
  interview: Interview;
  onViewInterview: (interview: Interview) => void;
  onRescheduleInterview: (interview: Interview) => void;
  onCancelInterview: (interview: Interview) => void;
  onCompleteInterview: (interview: Interview) => void;
  onViewApplication: (applicationId: string) => void;
}

const InterviewCard: React.FC<InterviewCardProps> = ({
  interview,
  onViewInterview,
  onRescheduleInterview,
  onCancelInterview,
  onCompleteInterview,
  onViewApplication,
}) => {
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

  const isUpcoming = interview.status === "SCHEDULED" || interview.status === "RESCHEDULED";
  const isCompleted = interview.status === "COMPLETED";
  const isCancelled = interview.status === "CANCELLED";

  return (
    <div className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
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
          {isUpcoming && getConfirmationBadge(interview.confirmed, interview.confirmedAt)}
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

      {interview.outcome && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium">Outcome:</p>
          <p className="text-sm text-muted-foreground">{interview.outcome}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2" 
          onClick={() => onViewApplication(interview.applicationId)}
        >
          <Eye className="h-3 w-3" />
          View Application
        </Button>
        <Button variant="outline" size="sm" onClick={() => onViewInterview(interview)}>
          <Eye className="h-3 w-3 mr-1" />
          View Details
        </Button>
        
        {isUpcoming && (
          <>
            <Button variant="outline" size="sm" onClick={() => onRescheduleInterview(interview)}>
              <Calendar className="h-3 w-3 mr-1" />
              Reschedule
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-500 hover:text-red-500"
              onClick={() => onCancelInterview(interview)}
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onCompleteInterview(interview)}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark Complete
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewCard; 