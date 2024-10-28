"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdateYoutubeVideoFunction = handleUpdateYoutubeVideoFunction;
exports.handleUpdatePersonalVideoFunction = handleUpdatePersonalVideoFunction;
const Video_model_1 = __importDefault(require("../../models/Video.model"));
const cloudinary_config_1 = require("../../utils/cloudinary.config");
const fs_1 = __importDefault(require("fs"));
async function handleUpdateYoutubeVideoFunction(req, res) {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found." });
        }
        const { videoId } = req.body;
        if (!videoId) {
            return res.status(400).json({ success: false, message: "Video ID is required." });
        }
        const updateData = {};
        const videoData = await Video_model_1.default.findOne({ videoId });
        if (req.body.videoName)
            updateData.videoName = req.body.videoName;
        if (req.body.tutorName)
            updateData.tutorName = req.body.tutorName;
        if (req.body.description)
            updateData.description = req.body.description;
        if (req.body.markdownContent)
            updateData.markdownContent = req.body.markdownContent;
        if (req.body.videoTimeStamps)
            updateData.videoTimeStamps = JSON.parse(req.body.videoTimeStamps);
        if (req.file) {
            if (videoData.thumbnail) {
                await (0, cloudinary_config_1.cloudinaryDeleteVideoImage)(videoData.thumbnail);
            }
            const localFilePath = req.file.path;
            const uploadResult = await (0, cloudinary_config_1.cloudinaryUploadVideoImageFiles)(localFilePath);
            if (!uploadResult) {
                return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            }
            fs_1.default.unlink(localFilePath, (err) => {
                if (err)
                    console.error("Error deleting local file:", err);
            });
            updateData.thumbnail = uploadResult.url;
        }
        else if (req.body.youtubeVideoImage) {
            updateData.thumbnail = req.body.youtubeVideoImage;
        }
        const updatedVideo = await Video_model_1.default.findOneAndUpdate({ videoId }, updateData, { new: true, runValidators: true });
        if (!updatedVideo) {
            return res.status(404).json({ success: false, message: "Video not found." });
        }
        res.status(200).json({ success: true, message: "Video updated successfully" });
    }
    catch (error) {
        console.error("Error updating video:", error);
        res.status(500).json({ success: false, message: "An error occurred while updating the video." });
    }
}
async function handleUpdatePersonalVideoFunction(req, res) {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found." });
        }
        const { videoId } = req.body;
        if (!videoId) {
            return res.status(400).json({ success: false, message: "Video ID is required." });
        }
        const updateData = {};
        const videoData = await Video_model_1.default.findOne({ videoId });
        if (req.body.videoName)
            updateData.videoName = req.body.videoName;
        if (req.body.tutorName)
            updateData.tutorName = req.body.tutorName;
        if (req.body.description)
            updateData.description = req.body.description;
        if (req.body.markdownContent)
            updateData.markdownContent = req.body.markdownContent;
        if (req.body.videoTimeStamps)
            updateData.videoTimeStamps = JSON.parse(req.body.videoTimeStamps);
        if (req.file) {
            if (videoData.thumbnail) {
                await (0, cloudinary_config_1.cloudinaryDeleteVideoImage)(videoData.thumbnail);
            }
            const localFilePath = req.file.path;
            const uploadResult = await (0, cloudinary_config_1.cloudinaryUploadVideoImageFiles)(localFilePath);
            if (!uploadResult) {
                return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            }
            fs_1.default.unlink(localFilePath, (err) => {
                if (err)
                    console.error("Error deleting local file:", err);
            });
            updateData.thumbnail = uploadResult.url;
        }
        else if (req.body.personalVideoImage) {
            updateData.thumbnail = req.body.personalVideoImage;
        }
        const updatedVideo = await Video_model_1.default.findOneAndUpdate({ videoId }, updateData, { new: true, runValidators: true });
        if (!updatedVideo) {
            return res.status(404).json({ success: false, message: "Video not found." });
        }
        res.status(200).json({ success: true, message: "Video updated successfully" });
    }
    catch (error) {
        console.error("Error updating video:", error);
        res.status(500).json({ success: false, message: "An error occurred while updating the video." });
    }
}
