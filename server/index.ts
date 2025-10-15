// 在啟動時自動載入專案根目錄的 .env 檔（若存在），使開發時可以直接使用環境變數。
// 使用 dotenv 而非在 shell 中手動設定，可提升跨平台開發體驗。
import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { exec } from 'child_process';

// 在開發時自動嘗試開啟預設瀏覽器連到應用首頁（跨平台）
// 可透過設定 NO_OPEN=1 或在 CI 環境變數中停用
function openBrowser(url: string) {
  try {
    if (process.env.NO_OPEN === '1' || process.env.CI) return;
    const plat = process.platform;
    let cmd = '';
    if (plat === 'win32') {
      // start is a cmd internal command; use cmd /c start with empty title
      cmd = `start "" "${url}"`;
    } else if (plat === 'darwin') {
      cmd = `open "${url}"`;
    } else {
      // assume Linux
      cmd = `xdg-open "${url}"`;
    }
    exec(cmd, (err) => {
      if (err) {
        // 不把錯誤視為致命，僅在 console 顯示
        console.error('openBrowser failed:', err.message || err);
      }
    });
  } catch (e) {
    console.error('openBrowser exception:', e);
  }
}
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const { scheduler } = await import("./services/scheduler");
  scheduler.startDailySync();
  log('[Scheduler] Daily sync scheduler initialized');

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  // 在 Windows (win32) 平台上不支援 reusePort，會造成 ENOTSUP 錯誤。
  // 因此僅在非 Windows 平台啟用 reusePort。
  const listenOptions: any = {
    port,
    host: "0.0.0.0",
  };

  if (process.platform !== 'win32') {
    listenOptions.reusePort = true;
  }

  server.listen(listenOptions, () => {
    log(`serving on port ${port}`);
  });
})();
