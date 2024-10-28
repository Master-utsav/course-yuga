"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleVideoStreamingFunction = handleVideoStreamingFunction;
const cloudinary_config_1 = require("../../utils/cloudinary.config");
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const Video_model_1 = __importDefault(require("../../models/Video.model"));
dotenv_1.default.config();
// Helper function to verify JWT token
async function checkAuth(token) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return resolve("Invalid token");
            }
            if (decoded && typeof decoded === "object" && "id" in decoded) {
                resolve({ userId: decoded.id });
            }
            else {
                resolve("Invalid token");
            }
        });
    });
}
async function handleVideoStreamingFunction(req, res) {
    const { publicId } = req.params;
    const { token } = req.query;
    const range = req.headers.range;
    if (!token) {
        return res.status(400).send("Requires token header");
    }
    const authData = await checkAuth(token);
    if (typeof authData === "string") {
        return res.status(401).send(authData); // "Invalid token"
    }
    const { userId } = authData;
    if (!userId) {
        return res.status(400).send("User ID not found");
    }
    if (!publicId) {
        return res.status(400).send("Public ID not found");
    }
    const video = await Video_model_1.default.findOne({ $and: [{ pub_id: publicId }, { videoType: "PERSONAL" }] });
    if (!video) {
        return res.status(404).send("Video not found");
    }
    if (!range) {
        return res.status(400).send("Requires Range header");
    }
    try {
        // Generate a signed URL for the Cloudinary video
        const signedUrl = (0, cloudinary_config_1.getSignedVideoUrl)(`VideoFiles/${publicId}`);
        // Fetch the video using Axios with the Range header
        const response = await axios_1.default.get(signedUrl, {
            headers: { Range: range },
            responseType: "stream", // Important for streaming
        });
        if (response.status !== 206) {
            return res.status(response.status).send("Error fetching video");
        }
        // Set response headers for streaming video
        res.writeHead(206, {
            "Content-Range": response.headers["content-range"],
            "Accept-Ranges": "bytes",
            "Content-Length": response.headers["content-length"],
            "Content-Type": "video/mp4",
        });
        // Stream the video data to the frontend
        response.data.pipe(res);
        //watchedBy: [{ type: Schema.Types.ObjectId, ref: "User" }], 
        video.watchedBy.push(userId);
        await video.save();
    }
    catch (error) {
        console.error("Error streaming video:", error);
        res.status(500).send("An error occurred while streaming the video.");
    }
}
