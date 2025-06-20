import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { TravelInfo } from "./types";

interface TravelInfoProps {
  travelInfo: TravelInfo;
}

export const ApplicationTravelInfo: React.FC<TravelInfoProps> = ({ travelInfo }) => {
  const calculateDuration = () => {
    return Math.ceil((new Date(travelInfo.exitDate).getTime() - 
      new Date(travelInfo.entryDate).getTime()) / 
      (1000 * 60 * 60 * 24));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Travel Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Purpose of Visit</p>
            <p className="mt-1">{travelInfo.purposeOfTravel}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Entry Date</p>
            <p className="mt-1">{formatDate(travelInfo.entryDate)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Exit Date</p>
            <p className="mt-1">{formatDate(travelInfo.exitDate)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Duration</p>
            <p className="mt-1">{calculateDuration()} days</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-muted-foreground">Accommodation Details</p>
            <p className="mt-1">{travelInfo.accommodationDetails}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Previous Visits to Burundi</p>
            <p className="mt-1">{travelInfo.previousVisits ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Port of Entry</p>
            <p className="mt-1">{travelInfo.portOfEntry}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Travel Itinerary</p>
            <p className="mt-1">{travelInfo.travelItinerary}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Host Details</p>
            <p className="mt-1">{travelInfo.hostDetails}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 