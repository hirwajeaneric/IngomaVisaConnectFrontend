import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video } from "lucide-react";
import { Interview } from "@/lib/api/services/interview.service";
import InterviewCard from "./InterviewCard";

interface ApplicationInterviewProps {
  interviews: Interview[];
  onConfirmInterview: (interviewId: string) => void;
  isConfirming: boolean;
}

const ApplicationInterview: React.FC<ApplicationInterviewProps> = ({
  interviews,
  onConfirmInterview,
  isConfirming,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Schedule</CardTitle>
        <CardDescription>
          Details of your upcoming visa interview
        </CardDescription>
      </CardHeader>
      <CardContent>
        {interviews.length > 0 ? (
          <div className="space-y-8">
            {interviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                onConfirmInterview={onConfirmInterview}
                isConfirming={isConfirming}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Video className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
            <p className="mt-2 text-muted-foreground">
              No interview has been scheduled yet
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
              If an interview is required for your application, you will be notified
              and the details will appear here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationInterview; 