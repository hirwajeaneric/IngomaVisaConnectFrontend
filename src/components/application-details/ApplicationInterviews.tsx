import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Video, User, CheckCircle2, Clock, MapPin, FileText } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { Interview } from "@/lib/api/services/interview.service";

interface ApplicationInterviewsProps {
  interviews: Interview[];
  onViewInterview?: (interview: Interview) => void;
  onRescheduleInterview?: (interview: Interview) => void;
  onCancelInterview?: (interview: Interview) => void;
  onCompleteInterview?: (interview: Interview) => void;
}

const ApplicationInterviews: React.FC<ApplicationInterviewsProps> = ({
  interviews,
  onViewInterview,
  onRescheduleInterview,
  onCancelInterview,
  onCompleteInterview,
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

  const getConfirmationBadge = (confirmed: boolean, confirmedAt?: string) => {
    if (confirmed) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle2 className="h-3 w-3 mr-1" />
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Interview Schedule
        </CardTitle>
        <CardDescription>
          All interviews scheduled for this application
        </CardDescription>
      </CardHeader>
      <CardContent>
        {interviews.length > 0 ? (
          <div className="space-y-6">
            {interviews.map((interview) => (
              <div key={interview.id} className="border rounded-lg p-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>
                        {interview.assignedOfficer?.name.split(" ").map((name: string) => name[0]).join("") || "IO"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Visa Interview</h3>
                      <p className="text-sm text-muted-foreground">
                        {interview.assignedOfficer?.name || "Unassigned Officer"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getInterviewStatusBadge(interview.status)}
                    {getConfirmationBadge(interview.confirmed, interview.confirmedAt)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date & Time</p>
                      <p className="text-sm font-medium">{formatInterviewDateTime(interview.scheduledDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">{interview.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <User className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-xs text-muted-foreground">Assigned Officer</p>
                      <p className="text-sm font-medium">{interview.assignedOfficer?.name || "Unassigned"}</p>
                    </div>
                  </div>
                </div>

                {interview.notes && (
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Interview Notes</p>
                    <p className="text-sm">{interview.notes}</p>
                  </div>
                )}

                {interview.outcome && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-1">Interview Outcome</p>
                    <p className="text-sm text-blue-700">{interview.outcome}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {onViewInterview && (
                    <Button variant="outline" size="sm" onClick={() => onViewInterview(interview)}>
                      <FileText className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  )}
                  
                  {interview.status === 'SCHEDULED' || interview.status === 'RESCHEDULED' ? (
                    <>
                      {onRescheduleInterview && (
                        <Button variant="outline" size="sm" onClick={() => onRescheduleInterview(interview)}>
                          <Calendar className="h-3 w-3 mr-1" />
                          Reschedule
                        </Button>
                      )}
                      
                      {onCancelInterview && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-500"
                          onClick={() => onCancelInterview(interview)}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      )}
                      
                      {onCompleteInterview && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onCompleteInterview(interview)}
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Mark Complete
                        </Button>
                      )}
                    </>
                  ) : null}
                </div>

                {interview.confirmed && interview.confirmedAt && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    Confirmed on {formatDateTime(interview.confirmedAt)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Video className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
            <p className="mt-2 text-muted-foreground">
              No interviews have been scheduled for this application
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
              Interviews will appear here once they are scheduled by an officer.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationInterviews; 