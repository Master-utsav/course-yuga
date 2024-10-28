"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteVideoFunction = handleDeleteVideoFunction;
const Video_model_1 = __importDefault(require("../../models/Video.model"));
const Course_model_1 = __importDefault(require("../../models/Course.model"));
const cloudinary_config_1 = require("../../utils/cloudinary.config");
async function handleDeleteVideoFunction(req, res) {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { videoId } = req.body;
    if (!videoId) {
        return res.status(400).json({ success: false, message: "Video ID is required" });
    }
    try {
        const videoById = await Video_model_1.default.findOne({ videoId });
        if (videoById.thumbnail) {
            await (0, cloudinary_config_1.cloudinaryDeleteVideoImage)(videoById.thumbnail);
        }
        if (videoById.videoUrl) {
            await (0, cloudinary_config_1.cloudinaryDeleteVideoFile)(videoById.videoUrl);
        }
        const video = await Video_model_1.default.findOneAndDelete({ videoId });
        if (!video) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }
        const course = await Course_model_1.default.findById(video.courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        course.videos = course.videos.filter((id) => !id.equals(videoId));
        await video.save();
        await course.save();
        return res.status(200).json({ success: true, message: "Video deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
