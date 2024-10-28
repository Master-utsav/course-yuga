// server.ts
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.config";
import userRoute from "./routes/user.route";
import courseRoute from "./routes/course.route";
import videoRoute from "./routes/video.route";
import { VercelRequest, VercelResponse } from "@vercel/node";

// Initialize environment variables
dotenv.config();

// Create the Express app
const app = express();
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Define routes
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Course-Yuga");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/video", videoRoute);

// Export as Vercel-compatible handler
export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res); // Forward request to Express app
};
