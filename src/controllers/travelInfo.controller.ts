import { Request, Response } from "express";
import { createTravelInfo, getTravelInfoByApplicationId, updateTravelInfo } from "../services/travelInfo.service";

export const createTravelInfoController = async (req: Request, res: Response) => {
  try {
    const { applicationId, ...travelInfoData } = req.body;
    
    const travelInfo = await createTravelInfo({
      ...travelInfoData,
      applicationId,
    });

    res.status(201).json(travelInfo);
  } catch (error) {
    console.error("Error creating travel info:", error);
    res.status(500).json({ error: "Failed to create travel info" });
  }
};

export const getTravelInfoController = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const travelInfo = await getTravelInfoByApplicationId(applicationId);

    if (!travelInfo) {
      return res.status(404).json({ error: "Travel info not found" });
    }

    res.json(travelInfo);
  } catch (error) {
    console.error("Error getting travel info:", error);
    res.status(500).json({ error: "Failed to get travel info" });
  }
};

export const updateTravelInfoController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const travelInfoData = req.body;

    const travelInfo = await updateTravelInfo(id, travelInfoData);

    if (!travelInfo) {
      return res.status(404).json({ error: "Travel info not found" });
    }

    res.json(travelInfo);
  } catch (error) {
    console.error("Error updating travel info:", error);
    res.status(500).json({ error: "Failed to update travel info" });
  }
}; 