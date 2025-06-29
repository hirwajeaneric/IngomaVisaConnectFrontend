import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Interview } from "@/lib/api/services/interview.service";

interface CancelInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview: Interview | null;
  onCancelInterview: () => void;
  isLoading: boolean;
}

const CancelInterviewDialog: React.FC<CancelInterviewDialogProps> = ({
  open,
  onOpenChange,
  interview,
  onCancelInterview,
  isLoading,
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

  if (!interview) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Cancel Interview</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this interview? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="font-medium">{interview.application?.user.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatDateTime(interview.scheduledDate)}
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            No, Keep Interview
          </Button>
          <Button 
            variant="destructive" 
            onClick={onCancelInterview}
            disabled={isLoading}
          >
            {isLoading ? (
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
  );
};

export default CancelInterviewDialog; 