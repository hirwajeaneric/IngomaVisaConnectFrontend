
import { CheckIcon } from "lucide-react";

interface StepsProps {
  currentStep: number;
}

export const Steps = ({ currentStep }: StepsProps) => {
  const steps = [
    { label: "Personal Information", id: 1 },
    { label: "Travel Information", id: 2 },
    { label: "Financial Information", id: 3 },
    { label: "Documents", id: 4 },
    { label: "Review & Submit", id: 5 },
  ];

  return (
    <div className="relative">
      <div className="flex items-center justify-between w-full mb-2">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 bg-white
                ${currentStep === step.id 
                  ? "border-primary bg-primary text-white" 
                  : currentStep > step.id 
                  ? "border-green-500 bg-green-500 text-white" 
                  : "border-gray-300 text-gray-500"}
              `}
            >
              {currentStep > step.id ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                step.id
              )}
            </div>
            <span className={`mt-2 text-xs md:text-sm font-medium 
              ${currentStep === step.id ? "text-primary" : 
                currentStep > step.id ? "text-green-600" : "text-gray-500"}
            `}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
      
      {/* Progress line */}
      <div className="hidden md:block absolute top-5 left-0 right-0 h-0.5 bg-gray-200" style={{ zIndex: 0 }}>
        <div 
          className="h-full bg-green-500 transition-all duration-300" 
          style={{ width: `${Math.max(0, (currentStep - 1) * 25)}%` }}
        />
      </div>
    </div>
  );
};
