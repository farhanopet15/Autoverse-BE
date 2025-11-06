import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import health from "./routes/health";
import profile from "./routes/profile";
import vehicles from "./routes/vehicles";
import describe from "./routes/auto.describe";
import ideas from "./routes/ideas"

dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? "*", credentials: true }));
app.use(morgan("dev"));

app.use("/health", health);
app.use("/api/profile", profile);
app.use("/api/vehicles", vehicles);
app.use("/api/ai/describe", describe);
app.use("/api/ideas", ideas);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`✅ API running on port ${port}`));