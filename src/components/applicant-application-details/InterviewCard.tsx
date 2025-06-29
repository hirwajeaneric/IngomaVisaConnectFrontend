import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video, User, CheckCircle2, Loader2, LocateIcon } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { Interview } from "@/lib/api/services/interview.service";

interface InterviewCardProps {
  interview: Interview;
  onConfirmInterview: (interviewId: string) => void;
  isConfirming: boolean;
}

const InterviewCard: React.FC<InterviewCardProps> = ({
  interview,
  onConfirmInterview,
  isConfirming,
}) => {
  const getInterviewStatusBadge = (status: string) => {
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

  const formatInterviewDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatInterviewTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Visa Interview</h3>
        {getInterviewStatusBadge(interview.status)}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
          <div>
            <p className="text-sm text-muted-foreground">Date & Time</p>
            <p className="font-medium">{formatInterviewDateTime(interview.scheduledDate)}</p>
          </div>
        </div>

        <div className="flex items-center">
          <LocateIcon className="h-5 w-5 text-muted-foreground mr-3" />
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium">{interview.location}</p>
          </div>
        </div>

        {interview.assignedOfficer && (
          <div className="flex items-center">
            <User className="h-5 w-5 text-muted-foreground mr-3" />
            <div>
              <p className="text-sm text-muted-foreground">Interview Officer</p>
              <p className="font-medium">{interview.assignedOfficer.name}</p>
            </div>
          </div>
        )}

        <div className="flex items-center">
          <CheckCircle2 className="h-5 w-5 text-muted-foreground mr-3" />
          <div>
            <p className="text-sm text-muted-foreground">Confirmation Status</p>
            <p className="font-medium">
              {interview.confirmed ? (
                <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending Confirmation</Badge>
              )}
            </p>
          </div>
        </div>
      </div>

      {interview.notes && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium text-muted-foreground mb-2">Interview Notes</p>
          <p className="text-sm">{interview.notes}</p>
        </div>
      )}

      {interview.outcome && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-2">Interview Outcome</p>
          <p className="text-sm text-blue-700">{interview.outcome}</p>
        </div>
      )}

      <div className="mt-8 space-x-3">
        {interview.status === 'SCHEDULED' && !interview.confirmed && (
          <Button 
            onClick={() => onConfirmInterview(interview.id)}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Confirming...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Confirm Appointment
              </>
            )}
          </Button>
        )}
        
        {interview.confirmed && (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Confirmed on {formatDateTime(interview.confirmedAt || '')}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default InterviewCard; 