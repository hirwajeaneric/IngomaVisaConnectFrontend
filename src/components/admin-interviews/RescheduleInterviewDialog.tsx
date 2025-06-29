import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Interview } from "@/lib/api/services/interview.service";

interface RescheduleInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview: Interview | null;
  onRescheduleInterview: (data: {
    scheduledDate: string;
    location: string;
    notes: string;
  }) => void;
  isLoading: boolean;
}

const RescheduleInterviewDialog: React.FC<RescheduleInterviewDialogProps> = ({
  open,
  onOpenChange,
  interview,
  onRescheduleInterview,
  isLoading,
}) => {
  const [newInterviewDate, setNewInterviewDate] = useState("");
  const [newInterviewTime, setNewInterviewTime] = useState("");
  const [newInterviewLocation, setNewInterviewLocation] = useState("");
  const [newInterviewNotes, setNewInterviewNotes] = useState("");

  const handleRescheduleInterview = () => {
    if (!newInterviewDate || !newInterviewTime || !interview) return;
    
    const scheduledDate = new Date(`${newInterviewDate}T${newInterviewTime}`);
    
    onRescheduleInterview({
      scheduledDate: scheduledDate.toISOString(),
      location: newInterviewLocation || interview.location,
      notes: newInterviewNotes || interview.notes,
    });
  };

  const resetForm = () => {
    if (interview) {
      const interviewDate = new Date(interview.scheduledDate);
      setNewInterviewDate(interviewDate.toISOString().split('T')[0]);
      setNewInterviewTime(interviewDate.toTimeString().slice(0, 5));
      setNewInterviewLocation(interview.location);
      setNewInterviewNotes(interview.notes);
    } else {
      setNewInterviewDate("");
      setNewInterviewTime("");
      setNewInterviewLocation("");
      setNewInterviewNotes("");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && interview) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  if (!interview) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            <Input value={interview.application?.user.name || ""} disabled />
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
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleRescheduleInterview}
            disabled={isLoading || !newInterviewDate || !newInterviewTime}
          >
            {isLoading ? (
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
  );
};

export default RescheduleInterviewDialog; 