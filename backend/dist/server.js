"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_config_1 = __importDefault(require("./utils/db.config"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const video_route_1 = __importDefault(require("./routes/video.route"));
// Initialize environment variables
dotenv_1.default.config();
// Create the Express app
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect to the database
(0, db_config_1.default)();
// Define routes
app.get("/", (req, res) => {
    res.send("Welcome to Course-Yuga");
});
app.use("/api/v1/user", user_route_1.default);
app.use("/api/v1/course", course_route_1.default);
app.use("/api/v1/video", video_route_1.default);
// Export as Vercel-compatible handler
exports.default = (req, res) => {
    app(req, res); // Forward request to Express app
};
