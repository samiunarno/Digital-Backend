import mongoose from "mongoose";
import { Portfolio } from "../models/Portfolio.js";
import { Analytics } from "../models/Analytics.js";
import { User } from "../models/User.js";
import { initialPortfolioData } from "../../src/data/portfolioData.js";

export const connectDB = async () => {
  let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";
  
  const connectWithRetry = async (uri: string) => {
    try {
      await mongoose.connect(uri);
      console.log("Connected to MongoDB");
      
      // Test the connection by running a simple command to trigger any case sensitivity errors immediately
      await mongoose.connection.db?.admin().command({ ping: 1 });
      
      // Auto-seed if empty
      const count = await Portfolio.countDocuments();
      if (count === 0) {
        console.log("Seeding database with initial data...");
        await Portfolio.create(initialPortfolioData);
        console.log("Database seeded!");
      }

      // Initialize analytics if not exists
      const analyticsCount = await Analytics.countDocuments();
      if (analyticsCount === 0) {
        await Analytics.create({ visitorCount: 0 });
      }

      // Seed default admin if no users exist
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log("Seeding default admin user...");
        const adminUsername = process.env.ADMIN_USERNAME || "admin";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
        await User.create({
          username: adminUsername,
          password: adminPassword,
          role: "admin",
        });
        console.log("Default admin user created!");
      }
    } catch (err: any) {
      if (err.message && err.message.includes("already exists with different case already have: [")) {
        const match = err.message.match(/already have: \[([^\]]+)\]/);
        if (match && match[1]) {
          const correctDbName = match[1];
          console.log(`Fixing case sensitivity issue. Reconnecting to correct database: ${correctDbName}`);
          const uriParts = uri.split('?');
          const basePath = uriParts[0];
          const query = uriParts[1] ? '?' + uriParts[1] : '';
          const lastSlashIndex = basePath.lastIndexOf('/');
          if (lastSlashIndex > 8) {
            const newUri = basePath.substring(0, lastSlashIndex + 1) + correctDbName + query;
            MONGODB_URI = newUri; // Update the global URI just in case
            
            // Disconnect first
            await mongoose.disconnect();
            
            // Retry with correct URI
            try {
              await mongoose.connect(newUri);
              console.log("Connected to MongoDB with corrected case");
              
              // Retry seeding
              const count = await Portfolio.countDocuments();
              if (count === 0) {
                console.log("Seeding database with initial data...");
                await Portfolio.create(initialPortfolioData);
                console.log("Database seeded!");
              }

              const analyticsCount = await Analytics.countDocuments();
              if (analyticsCount === 0) {
                await Analytics.create({ visitorCount: 0 });
              }
            } catch (retryErr) {
              console.error("MongoDB connection error after retry:", retryErr);
            }
          }
        }
      } else {
        console.error("MongoDB connection error:", err);
      }
    }
  };

  await connectWithRetry(MONGODB_URI);
};
