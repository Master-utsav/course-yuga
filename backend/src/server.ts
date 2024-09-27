import express, {Response , Request} from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.config";
import userRoute from "./routes/user.route";
import courseRoute from "./routes/course.route";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8001;

connectDB();

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Yugpath-Shiksha");
});

app.use("/api/user" , userRoute);
app.use("/api/course" , courseRoute);

app.listen(PORT, () => {
    console.log("Server started on port : " + PORT);
});

