import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Calendar, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { visaApplicationService } from "@/lib/api/services/visaapplication.service";
import { notesService, Note } from "@/lib/api/services/notes.service";
import { format } from "date-fns";

interface ApplicationProcessingProps {
  applicationId: string;
  currentStatus: string;
  onStatusUpdate: (newStatus: string) => void;
}

export const ApplicationProcessing: React.FC<ApplicationProcessingProps> = ({
  applicationId,
  currentStatus,
  onStatusUpdate,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [processingStatus, setProcessingStatus] = useState(currentStatus);
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [addingNote, setAddingNote] = useState(false);

  // Load notes on component mount
  useEffect(() => {
    loadNotes();
  }, [applicationId]);

  const loadNotes = async () => {
    try {
      const response = await notesService.getApplicationNotes(applicationId);
      setNotes(response.data);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleUpdateStatus = async () => {
    if (processingStatus === currentStatus) {
      toast({
        title: "No Changes",
        description: "The status is already set to this value.",
      });
      return;
    }

    setUpdatingStatus(true);
    try {
      await visaApplicationService.updateApplicationStatus(applicationId, processingStatus);
      onStatusUpdate(processingStatus);
      toast({
        title: "Status Updated",
        description: `Application status has been updated to ${processingStatus}.`,
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update application status.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast({
        title: "Empty Note",
        description: "Please enter a note before adding.",
        variant: "destructive",
      });
      return;
    }

    setAddingNote(true);
    try {
      await notesService.createNote({
        applicationId,
        content: newNote.trim()
      });
      setNewNote("");
      await loadNotes(); // Reload notes
      toast({
        title: "Note Added",
        description: "Your note has been added successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to Add Note",
        description: error.message || "Failed to add note.",
        variant: "destructive",
      });
    } finally {
      setAddingNote(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Processing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Status */}
          <div>
            <label className="text-sm font-medium">Current Status</label>
            <div className="mt-1">
              <Badge className={getStatusColor(currentStatus)}>
                {currentStatus.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Update Status */}
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
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleUpdateStatus} 
                disabled={updatingStatus || processingStatus === currentStatus}
              >
                {updatingStatus ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update'
                )}
              </Button>
            </div>
          </div>

          {/* Add Note */}
          <div>
            <label className="text-sm font-medium">Add Note</label>
            <Textarea
              placeholder="Add your notes about this application..."
              className="mt-1"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              disabled={addingNote}
            />
            <div className="flex items-center justify-between gap-4 mt-2">
              <Button 
                className="mt-2" 
                variant="outline" 
                onClick={handleAddNote}
                disabled={addingNote || !newNote.trim()}
              >
                {addingNote ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Note'
                )}
              </Button>
              <Button 
                className="mt-2" 
                variant="secondary" 
                onClick={() => navigate('/dashboard/interviews')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            </div>
          </div>

          {/* Notes List */}
          <div>
            <label className="text-sm font-medium">Recent Notes</label>
            <div className="mt-2 space-y-3 max-h-60 overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notes yet</p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm">{note.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {note.officer.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(note.createdAt), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 