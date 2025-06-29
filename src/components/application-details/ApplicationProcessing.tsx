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
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

interface ApplicationProcessingProps {
  processingStatus: string;
  setProcessingStatus: (status: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  onUpdateStatus: () => void;
  onAddNote: () => void;
}

export const ApplicationProcessing: React.FC<ApplicationProcessingProps> = ({
  processingStatus,
  setProcessingStatus,
  notes,
  setNotes,
  onUpdateStatus,
  onAddNote,
}) => {
  const navigate = useNavigate();
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
            <div className="flex items-center justify-between gap-4 mt-1">
              <Button className="mt-2" variant="outline" onClick={onAddNote}>
                Add Note
              </Button>
              <Button className="mt-2" variant="secondary" onClick={() => navigate('/dashboard/interviews')}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 