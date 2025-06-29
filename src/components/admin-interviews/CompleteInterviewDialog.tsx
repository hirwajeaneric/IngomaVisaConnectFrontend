import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Interview } from "@/lib/api/services/interview.service";

interface CompleteInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview: Interview | null;
  onCompleteInterview: (data: {
    outcome: string;
    notes: string;
  }) => void;
  isLoading: boolean;
}

const CompleteInterviewDialog: React.FC<CompleteInterviewDialogProps> = ({
  open,
  onOpenChange,
  interview,
  onCompleteInterview,
  isLoading,
}) => {
  const [interviewOutcome, setInterviewOutcome] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");

  const handleCompleteInterview = () => {
    if (!interviewOutcome.trim() || !interview) return;
    
    onCompleteInterview({
      outcome: interviewOutcome,
      notes: interviewNotes,
    });
  };

  const resetForm = () => {
    setInterviewOutcome("");
    setInterviewNotes("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  if (!interview) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            <Input value={interview.application?.user.name || ""} disabled />
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
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCompleteInterview}
            disabled={isLoading || !interviewOutcome.trim()}
          >
            {isLoading ? (
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
  );
};

export default CompleteInterviewDialog; 