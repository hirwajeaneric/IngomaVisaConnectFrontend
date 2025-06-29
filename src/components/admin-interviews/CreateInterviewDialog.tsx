import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ApplicationForInterview, Officer } from "@/lib/api/services/interview.service";

interface CreateInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applications: ApplicationForInterview[];
  officers: Officer[];
  onCreateInterview: (data: {
    applicationId: string;
    assignedOfficerId: string;
    scheduledDate: string;
    location: string;
    notes: string;
  }) => void;
  isLoading: boolean;
}

const CreateInterviewDialog: React.FC<CreateInterviewDialogProps> = ({
  open,
  onOpenChange,
  applications,
  officers,
  onCreateInterview,
  isLoading,
}) => {
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [selectedAssignedOfficerId, setSelectedAssignedOfficerId] = useState("");
  const [newInterviewDate, setNewInterviewDate] = useState("");
  const [newInterviewTime, setNewInterviewTime] = useState("");
  const [newInterviewLocation, setNewInterviewLocation] = useState("");
  const [newInterviewNotes, setNewInterviewNotes] = useState("");

  const handleCreateInterview = () => {
    if (!selectedApplicationId || !selectedAssignedOfficerId || !newInterviewDate || !newInterviewTime || !newInterviewLocation) {
      return;
    }
    
    const scheduledDate = new Date(`${newInterviewDate}T${newInterviewTime}`);
    
    onCreateInterview({
      applicationId: selectedApplicationId,
      assignedOfficerId: selectedAssignedOfficerId,
      scheduledDate: scheduledDate.toISOString(),
      location: newInterviewLocation,
      notes: newInterviewNotes,
    });
  };

  const resetForm = () => {
    setSelectedApplicationId("");
    setSelectedAssignedOfficerId("");
    setNewInterviewDate("");
    setNewInterviewTime("");
    setNewInterviewLocation("");
    setNewInterviewNotes("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>
            Set up an interview with a visa applicant. You'll be able to add this to your calendar.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Application *</label>
            <Select value={selectedApplicationId} onValueChange={setSelectedApplicationId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an application" />
              </SelectTrigger>
              <SelectContent>
                {applications.map((application) => (
                  <SelectItem key={application.id} value={application.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{application.applicationNumber}</span>
                      <span className="text-sm text-muted-foreground">
                        {application.applicantName} - {application.visaTypeName}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Assign Officer *</label>
            <Select value={selectedAssignedOfficerId} onValueChange={setSelectedAssignedOfficerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an officer to assign" />
              </SelectTrigger>
              <SelectContent>
                {officers.map((officer) => (
                  <SelectItem key={officer.id} value={officer.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{officer.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {officer.department} {officer.title && `- ${officer.title}`}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Interview Date *</label>
            <Input 
              type="date" 
              value={newInterviewDate}
              onChange={(e) => setNewInterviewDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Interview Time *</label>
            <Input 
              type="time" 
              value={newInterviewTime}
              onChange={(e) => setNewInterviewTime(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Location *</label>
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
            onClick={handleCreateInterview}
            disabled={isLoading || !selectedApplicationId || !selectedAssignedOfficerId || !newInterviewDate || !newInterviewTime || !newInterviewLocation}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scheduling...
              </>
            ) : (
              'Schedule Interview'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInterviewDialog; 