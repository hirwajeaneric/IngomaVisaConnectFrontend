import React from "react";
import { ApplicationMessagesTab } from "@/components/dashboard";
import { VisaApplicationResponse } from "@/types";

interface ApplicationMessagesProps {
  application: VisaApplicationResponse;
}

const ApplicationMessages: React.FC<ApplicationMessagesProps> = ({ application }) => {
  return (
    <ApplicationMessagesTab 
      applicationId={application.id}
      applicantName={`${application.personalInfo.firstName} ${application.personalInfo.lastName}`}
      applicantId={application.userId}
      officerId={application.officerId}
    />
  );
};

export default ApplicationMessages; 