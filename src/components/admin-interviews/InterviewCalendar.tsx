import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Interview } from "@/lib/api/services/interview.service";

interface InterviewCalendarProps {
  viewDate: Date;
  todaysInterviews: Interview[];
  onNavigateDate: (direction: 'prev' | 'next') => void;
  onViewInterview: (interview: Interview) => void;
  onCreateInterview: () => void;
}

const InterviewCalendar: React.FC<InterviewCalendarProps> = ({
  viewDate,
  todaysInterviews,
  onNavigateDate,
  onViewInterview,
  onCreateInterview,
}) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
        <CardDescription>View and manage scheduled interviews</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Calendar</h3>
          <Button variant="outline" size="sm" onClick={() => onNavigateDate('today')}>
            Today
          </Button>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => onNavigateDate('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-medium">{formatDate(viewDate)}</h3>
          <Button variant="ghost" size="icon" onClick={() => onNavigateDate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Today's Interviews */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            {todaysInterviews.length} Interviews
          </h4>
          {todaysInterviews.length > 0 ? (
            <div className="space-y-3">
              {todaysInterviews.map((interview) => (
                <div 
                  key={interview.id} 
                  className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => onViewInterview(interview)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                          {interview.application?.user.name.split(" ").map((name: string) => name[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{interview.application?.user.name}</p>
                        <p className="text-xs text-muted-foreground">{formatTime(interview.scheduledDate)}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-muted">
                      {interview.application?.visaType.name}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">No interviews scheduled</p>
              <Button variant="link" size="sm" onClick={onCreateInterview} className="mt-2">
                Schedule Interview
              </Button>
            </div>
          )}
        </div>

        {/* Quick Schedule Button */}
        <Button onClick={onCreateInterview} className="w-full mt-6">
          <Plus className="h-4 w-4 mr-2" />
          Schedule New Interview
        </Button>
      </CardContent>
    </Card>
  );
};

export default InterviewCalendar; 