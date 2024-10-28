"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAddNewYoutubeVideoFunction = handleAddNewYoutubeVideoFunction;
exports.handleAddNewPersonalVideoFunction = handleAddNewPersonalVideoFunction;
exports.handleUploadPersonalVideoFunction = handleUploadPersonalVideoFunction;
const cloudinary_config_1 = require("../../utils/cloudinary.config");
const Course_model_1 = __importDefault(require("../../models/Course.model"));
const Video_model_1 = __importDefault(require("../../models/Video.model"));
const fs_1 = __importDefault(require("fs"));
async function handleAddNewYoutubeVideoFunction(req, res) {
    try {
        const userId = req.userId;
        const uniqueId = req.userUniqueId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User not authorized" });
        }
        if (!uniqueId) {
            return res.status(400).json({ success: false, message: "User not authorized" });
        }
        const { videoName, tutorName, courseId, videoUrl } = req.body;
        if (!courseId) {
            return res.status(400).json({ success: false, message: "Missing 'courseId' parameter" });
        }
        let thumbnail = "";
        if (req.file) {
            const localFilePath = req.file.path;
            const uploadResult = await (0, cloudinary_config_1.cloudinaryUploadVideoImageFiles)(localFilePath);
            if (!uploadResult) {
                return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            }
            thumbnail = uploadResult.url;
            fs_1.default.unlink(localFilePath, (err) => {
                if (err)
                    console.error("Error deleting local file:", err);
            });
        }
        else if (req.body.youtubeVideoImage) {
            thumbnail = req.body.youtubeVideoImage;
        }
        if (!thumbnail && !videoUrl) {
            return res.status(400).json({ success: false, message: "No image file or URL provided." });
        }
        const description = req.body.description || '';
        const videoTimeStamps = req.body.videoTimeStamps || [];
        const { nanoid } = await import('nanoid');
        const newVideo = new Video_model_1.default({
            videoId: nanoid(),
            videoName,
            tutorName,
            videoType: "YOUTUBE",
            thumbnail,
            uploadedBy: uniqueId,
            courseId,
            videoUrl,
            description,
            videoTimeStamps,
            isVerified: false,
        });
        await newVideo.save();
        // Optionally update the user who uploaded the course
        const updatedCourse = await Course_model_1.default.findOneAndUpdate({ courseId }, { $push: { videos: newVideo.videoId } }, { new: true });
        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }
        res.status(201).json({ success: true, message: "Video uploaded successfully", videoId: newVideo.videoId });
    }
    catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ success: false, message: "An error occurred while adding the course." });
    }
}
async function handleAddNewPersonalVideoFunction(req, res) {
    try {
        const userId = req.userId;
        const uniqueId = req.userUniqueId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User not authorized" });
        }
        if (!uniqueId) {
            return res.status(400).json({ success: false, message: "User not authorized" });
        }
        const { videoName, tutorName, courseId } = req.body;
        if (!courseId) {
            return res.status(400).json({ success: false, message: "Missing 'courseId' parameter" });
        }
        let thumbnail = "";
        if (req.file) {
            const localFilePath = req.file.path;
            const uploadResult = await (0, cloudinary_config_1.cloudinaryUploadVideoImageFiles)(localFilePath);
            if (!uploadResult) {
                return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            }
            thumbnail = uploadResult.url;
            fs_1.default.unlink(localFilePath, (err) => {
                if (err)
                    console.error("Error deleting local file:", err);
            });
        }
        else if (req.body.personalVideoImage) {
            thumbnail = req.body.personalVideoImage;
        }
        if (!thumbnail) {
            return res.status(400).json({ success: false, message: "No image file or URL provided." });
        }
        const description = req.body.description || '';
        const videoTimeStamps = req.body.videoTimeStamps || [];
        const { nanoid } = await import('nanoid');
        const newVideo = new Video_model_1.default({
            videoId: nanoid(),
            videoName,
            tutorName,
            videoType: "PERSONAL",
            thumbnail,
            uploadedBy: uniqueId,
            courseId,
            videoUrl: "dummy_url_beacause_video_upload_failed",
            description,
            videoTimeStamps,
            isVerified: false,
        });
        await newVideo.save();
        // Optionally update the user who uploaded the course
        const updatedCourse = await Course_model_1.default.findOneAndUpdate({ courseId }, { $push: { videos: newVideo.videoId } }, { new: true });
        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }
        res.status(201).json({ success: true, message: "Video uploading please wait...", videoId: newVideo.videoId });
    }
    catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ success: false, message: "An error occurred while adding the course." });
    }
}
async function handleUploadPersonalVideoFunction(req, res) {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User not authorized" });
        }
        const { videoId } = req.body;
        if (!videoId) {
            return res.status(400).json({ success: false, message: "Missing videoId parameter" });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No video file uploaded.' });
        }
        const video = await Video_model_1.default.findOne({ videoId });
        if (req.file) {
            const localFilePath = req.file.path;
            const uploadResult = await (0, cloudinary_config_1.cloudinaryUploadVideoFiles)(localFilePath);
            if (!uploadResult) {
                return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            }
            video.videoUrl = uploadResult.url;
            video.pub_id = (0, cloudinary_config_1.getPublicIdFromPath)(uploadResult.public_id);
            fs_1.default.unlink(localFilePath, (err) => {
                if (err)
                    console.error("Error deleting local file:", err);
            });
        }
        else {
            return res.status(400).json({ success: false, message: "No Video file provided." });
        }
        await video.save();
        // Optionally update the user who uploaded the course
        res.status(201).json({ success: true, message: "Video uploaded successfully", videoId: video.videoId });
    }
    catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ success: false, message: "An error occurred while adding the course." });
    }
}
