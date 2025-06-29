import React from "react";
import { ApplicationMessagesTab } from "@/components/dashboard";
import { VisaApplication } from "@/types";

interface ApplicationMessagesProps {
  application: VisaApplication;
}

const ApplicationMessages: React.FC<ApplicationMessagesProps> = ({ application }) => {
  return (
    <ApplicationMessagesTab 
      applicationId={application.id}
      applicantName={`${application.personalInfo?.firstName} ${application.personalInfo?.lastName}`}
      applicantId={application.userId}
      officerId={application.officer?.id || ''}
    />
  );
};

export default ApplicationMessages;   