/**
 * Express Server Entry Point
 * 
 * This is the main server file that initializes and configures the Express application.
 * It sets up middleware, registers API routes, configures Vite for development,
 * and starts the daily data synchronization scheduler.
 * 
 * Key components:
 * - Express middleware for JSON/URL-encoded request parsing
 * - Request/response logging middleware for API calls
 * - API route registration
 * - Vite dev server (development) or static file serving (production)
 * - Daily scheduler for Taiwan stock market data sync (14:30 Taiwan time, Mon-Fri)
 * - Server listening on port 5000 (or PORT environment variable)
 */

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Initialize Express application
const app = express();

// Middleware for parsing JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Request/Response Logging Middleware
 * 
 * Logs all API requests with timing information and response data.
 * Only logs requests to /api/* endpoints to reduce noise.
 * 
 * Logged information includes:
 * - HTTP method and path
 * - Response status code
 * - Request duration in milliseconds
 * - Response JSON body (truncated if longer than 80 characters)
 */
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Capture JSON response for logging
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Log request details when response is finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      // Truncate long log lines
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

/**
 * Async Server Initialization
 * 
 * This IIFE (Immediately Invoked Function Expression) handles the asynchronous
 * setup and startup of the Express server.
 */
(async () => {
  // Register all API routes and create HTTP server
  const server = await registerRoutes(app);

  /**
   * Global Error Handler Middleware
   * 
   * Catches all errors from route handlers and sends appropriate JSON responses.
   * Must be registered after all routes.
   */
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  /**
   * Vite Development Server Setup (Development Only)
   * 
   * In development mode, sets up Vite's dev server for hot module replacement (HMR).
   * In production, serves pre-built static files instead.
   * 
   * IMPORTANT: Must be set up AFTER all API routes to avoid catch-all route conflicts.
   */
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  /**
   * Daily Data Synchronization Scheduler
   * 
   * Initializes the cron job that syncs Taiwan stock market data daily at 14:30 Taiwan time
   * (after market close at 13:30 + buffer time). Runs Monday-Friday only.
   */
  const { scheduler } = await import("./services/scheduler");
  scheduler.startDailySync();
  log('[Scheduler] Daily sync scheduler initialized');

  /**
   * Start HTTP Server
   * 
   * Binds to 0.0.0.0 to accept external connections (required for Replit).
   * Uses PORT environment variable (default: 5000) which is forwarded to ports 80/443 in production.
   * This single port serves both the API and the client application.
   */
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
