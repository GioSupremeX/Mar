import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import fs from "fs";
import path from "path";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Your API routes
app.use("/api", router);

// --- 2. ADD THESE LINES TO SERVE THE WEBSITE ---
// Serve the static frontend files
app.use(express.static(path.join(process.cwd(), "dist/public")));

// Catch-all route so refreshing the page works (Express 5 RegExp Syntax)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist/public/index.html"));
});
// -----------------------------------------------

export default app;
