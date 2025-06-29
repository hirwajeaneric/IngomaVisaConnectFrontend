import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Clock, Calendar } from "lucide-react";
import { Interview } from "@/lib/api/services/interview.service";

interface ViewInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview: Interview | null;
  onViewApplication: (applicationId: string) => void;
  onRescheduleInterview: (interview: Interview) => void;
  onCompleteInterview: (interview: Interview) => void;
}

const ViewInterviewDialog: React.FC<ViewInterviewDialogProps> = ({
  open,
  onOpenChange,
  interview,
  onViewApplication,
  onRescheduleInterview,
  onCompleteInterview,
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

  if (!interview) return null;

  const isUpcoming = interview.status === "SCHEDULED" || interview.status === "RESCHEDULED";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Interview Details</DialogTitle>
          <DialogDescription>
            Details for the interview with {interview.application?.user.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                {interview.application?.user.name.split(" ").map((name: string) => name[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{interview.application?.user.name}</h3>
              <p className="text-muted-foreground">{interview.application?.applicationNumber}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="font-medium">{formatDateTime(interview.scheduledDate)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Time</p>
              <p className="font-medium">{formatTime(interview.scheduledDate)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Visa Type</p>
              <p className="font-medium">{interview.application?.visaType.name}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="mt-1">{getStatusBadge(interview.status)}</div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Confirmation</p>
              <div className="mt-1">{getConfirmationBadge(interview.confirmed, interview.confirmedAt)}</div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Assigned Officer</p>
              <p className="font-medium">{interview.assignedOfficer?.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Scheduler</p>
              <p className="font-medium">{interview.scheduler?.name}</p>
            </div>
            
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <p className="font-medium">{interview.location}</p>
            </div>
          </div>
          
          {interview.notes && (
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
              <p className="text-sm">{interview.notes}</p>
            </div>
          )}

          {interview.outcome && (
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Outcome</p>
              <p className="text-sm">{interview.outcome}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onViewApplication(interview.applicationId)}>
              <Clock className="h-3 w-3 mr-2" />
              View Application
            </Button>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex space-x-2">
            {isUpcoming && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    onOpenChange(false);
                    onRescheduleInterview(interview);
                  }}
                >
                  <Calendar className="h-3 w-3 mr-2" />
                  Reschedule
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    onCompleteInterview(interview);
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
  );
};

export default ViewInterviewDialog; 