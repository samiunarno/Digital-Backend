import { Portfolio } from "../models/Portfolio.js";
import { initialPortfolioData } from "../../src/data/portfolioData.js";
import { PortfolioContentSchema } from "../../src/lib/validation.js";
import { z } from "zod";

export const getPortfolioData = async () => {
  let data = await Portfolio.findOne();
  if (!data) {
    console.log("Database empty on GET, seeding...");
    data = await Portfolio.create(initialPortfolioData);
  }
  return data;
};

export const updatePortfolioData = async (updateData: any) => {
  const count = await Portfolio.countDocuments();
  console.log(`Updating portfolio data... Current count: ${count}`);
  
  // Clean data
  const dataToUpdate = { ...updateData };
  delete dataToUpdate._id;
  delete dataToUpdate.__v;
  delete dataToUpdate.createdAt;
  delete dataToUpdate.updatedAt;

  // Validation using Zod
  try {
    console.log("Validating portfolio data with Zod...");
    PortfolioContentSchema.parse(dataToUpdate);
    console.log("Zod validation successful.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join('; ');
      console.error("Zod validation failed:", errorMessages);
      throw new Error(`Validation Error: ${errorMessages}`);
    }
    throw error;
  }

  try {
    let doc = await Portfolio.findOne();
    if (!doc) {
      console.log("No existing portfolio found, creating new one...");
      doc = new Portfolio(dataToUpdate);
    } else {
      console.log("Existing portfolio found, overwriting content...");
      // Use overwrite() to completely replace the document's data with new data
      doc.overwrite(dataToUpdate);
    }
    
    const savedDoc = await doc.save();
    
    if (savedDoc) {
      console.log("Portfolio saved successfully. Saved keys:", Object.keys(savedDoc.toObject()));
      
      // Emit socket event for real-time update
      const { ioInstance } = await import("../socket/index.js");
      if (ioInstance) {
        console.log("Emitting portfolio_update event...");
        ioInstance.emit("portfolio_update", savedDoc);
      }

      return savedDoc;
    } else {
      console.warn("Portfolio save returned null savedDoc");
      throw new Error("Failed to save portfolio data");
    }
  } catch (error) {
    console.error("Error in updatePortfolioData:", error);
    throw error;
  }
};
