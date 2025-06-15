import { prisma } from "../lib/prisma";
import { TravelInfoCreateInput } from "@prisma/client";

export const createTravelInfo = async (data: Omit<TravelInfoCreateInput, "application"> & { applicationId: string }) => {
  const { 
    applicationId, 
    intendedEntryDate, 
    intendedExitDate,
    previousVisits = false,
    ...rest 
  } = data;
  
  return prisma.travelInfo.create({
    data: {
      entryDate: intendedEntryDate,
      exitDate: intendedExitDate,
      previousVisits,
      purposeOfTravel: rest.purposeOfTravel,
      portOfEntry: rest.portOfEntry,
      accommodationDetails: rest.accommodationDetails,
      travelItinerary: rest.travelItinerary,
      previousVisitDetails: rest.previousVisitDetails,
      hostDetails: rest.hostDetails,
      finalDestination: rest.finalDestination,
      countriesVisitedOfAfterBurundi: rest.countriesVisitedOfAfterBurundi,
      application: {
        connect: {
          id: applicationId,
        },
      },
    },
  });
};

export const getTravelInfoByApplicationId = async (applicationId: string) => {
  return prisma.travelInfo.findUnique({
    where: {
      applicationId,
    },
  });
};

export const updateTravelInfo = async (id: string, data: Partial<TravelInfoCreateInput>) => {
  const { 
    intendedEntryDate, 
    intendedExitDate,
    previousVisits,
    ...rest 
  } = data;
  
  return prisma.travelInfo.update({
    where: {
      id,
    },
    data: {
      ...(intendedEntryDate && { entryDate: intendedEntryDate }),
      ...(intendedExitDate && { exitDate: intendedExitDate }),
      ...(typeof previousVisits === 'boolean' && { previousVisits }),
      purposeOfTravel: rest.purposeOfTravel,
      portOfEntry: rest.portOfEntry,
      accommodationDetails: rest.accommodationDetails,
      travelItinerary: rest.travelItinerary,
      previousVisitDetails: rest.previousVisitDetails,
      hostDetails: rest.hostDetails,
      finalDestination: rest.finalDestination,
      countriesVisitedOfAfterBurundi: rest.countriesVisitedOfAfterBurundi,
    },
  });
}; 