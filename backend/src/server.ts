import express, {Response , Request} from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.config";
import userRoute from "./routes/user.route";
import courseRoute from "./routes/course.route";
import videoRoute from "./routes/video.route";
import { VercelRequest, VercelResponse } from "@vercel/node";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8001;

connectDB();

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Course-Yuga");
});

app.use("/api/v1/user" , userRoute);
app.use("/api/v1/course" , courseRoute);
app.use("/api/v1/video" , videoRoute);

export default (req: VercelRequest, res: VercelResponse) => {
    app(req, res);
};
