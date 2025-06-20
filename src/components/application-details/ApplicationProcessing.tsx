import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApplicationProcessingProps {
  processingStatus: string;
  setProcessingStatus: (status: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  interviewDate: string;
  setInterviewDate: (date: string) => void;
  onUpdateStatus: () => void;
  onAddNote: () => void;
  onScheduleInterview: () => void;
}

export const ApplicationProcessing: React.FC<ApplicationProcessingProps> = ({
  processingStatus,
  setProcessingStatus,
  notes,
  setNotes,
  interviewDate,
  setInterviewDate,
  onUpdateStatus,
  onAddNote,
  onScheduleInterview
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Processing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Update Status</label>
            <div className="flex items-center gap-4 mt-1">
              <Select 
                value={processingStatus}
                onValueChange={setProcessingStatus}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="document-requested">Document Requested</SelectItem>
                  <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={onUpdateStatus}>Update</Button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Officer Notes</label>
            <Textarea 
              placeholder="Add your notes about this application..."
              className="mt-1"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button className="mt-2" variant="outline" onClick={onAddNote}>
              Add Note
            </Button>
          </div>
          
          <div>
            <label className="text-sm font-medium">Schedule Interview</label>
            <div className="flex items-center gap-4 mt-1">
              <Input 
                type="datetime-local" 
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
              />
              <Button variant="outline" onClick={onScheduleInterview}>
                Schedule
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 