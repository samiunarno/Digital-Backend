import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import { connectDB } from "./server/db/connect.js";
import { initSocket } from "./server/socket/index.js";
import apiRoutes from "./server/routes/index.js";
import { errorHandler } from "./server/middleware/errorHandler.js";
import { requestLogger } from "./server/middleware/logger.js";
import { AppError } from "./server/utils/AppError.js";

dotenv.config();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  console.error('Unhandled Promise Rejection:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = Number(process.env.PORT) || 3000;

  // Security HTTP headers
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for Vite dev server compatibility
  }));

  app.use(express.json({ limit: '50mb' }));

  
  // Request Logger Middleware
  app.use(requestLogger);

  // Connect to MongoDB
  await connectDB();

  // Initialize Socket.io
  initSocket(io);

  // API Routes
  app.use("/api", apiRoutes);

  // Handle unhandled API routes
  app.all("/api/*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  // Global Error Handler Middleware
  app.use(errorHandler);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  httpServer.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} is already in use.`);
      console.error(`   → Kill the process with: kill -9 $(lsof -t -i:${PORT})`);
      console.error(`   → Or use a different port: PORT=3005 npm run dev\n`);
      process.exit(1);
    } else {
      throw err;
    }
  });
}

startServer();
