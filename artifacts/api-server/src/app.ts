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

// Dynamically locate where the frontend build files actually live across the monorepo
const possiblePaths = [
  path.resolve(process.cwd(), "dist/public"),
  path.resolve(process.cwd(), "../portfolio/dist/public"),
  path.resolve(process.cwd(), "../../artifacts/portfolio/dist/public"),
  path.resolve(process.cwd(), "../portfolio/dist"),
];

const staticPath = possiblePaths.find((p) => fs.existsSync(p)) || possiblePaths[0];

// Serve static assets
app.use(express.static(staticPath));

// Catch-all route for frontend (Express 5 RegExp syntax)
app.get(/.*/, (req, res) => {
  const indexPath = path.join(staticPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Frontend index.html not found");
  }
});

export default app;
