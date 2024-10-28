"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdateYoutubeCourseFunction = handleUpdateYoutubeCourseFunction;
exports.handleUpdatePersonalCourseFunction = handleUpdatePersonalCourseFunction;
exports.handleUpdateRedirectCourseFunction = handleUpdateRedirectCourseFunction;
const cloudinary_config_1 = require("../../utils/cloudinary.config");
const Course_model_1 = __importDefault(require("../../models/Course.model"));
const fs_1 = __importDefault(require("fs"));
async function handleUpdateYoutubeCourseFunction(req, res) {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found." });
        }
        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID is required." });
        }
        const updateData = {};
        const courseData = await Course_model_1.default.findOne({ courseId });
        if (req.body.courseName)
            updateData.courseName = req.body.courseName;
        if (req.body.tutorName)
            updateData.tutorName = req.body.tutorName;
        if (req.body.description)
            updateData.description = req.body.description;
        if (req.body.currency)
            updateData.currency = req.body.currency;
        if (req.body.markdownContent)
            updateData.markdownContent = req.body.markdownContent;
        if (req.file) {
            if (courseData.thumbnail) {
                await (0, cloudinary_config_1.cloudinaryDeleteCourseImage)(courseData.thumbnail);
            }
            const localFilePath = req.file.path;
            const uploadResult = await (0, cloudinary_config_1.cloudinaryUploadCourseImageFiles)(localFilePath);
            if (!uploadResult) {
                return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            }
            fs_1.default.unlink(localFilePath, (err) => {
                if (err)
                    console.error("Error deleting local file:", err);
            });
            updateData.thumbnail = uploadResult.url;
        }
        else if (req.body.youtubeCourseImage) {
            updateData.thumbnail = req.body.youtubeCourseImage;
        }
        const updatedCourse = await Course_model_1.default.findOneAndUpdate({ courseId }, updateData, { new: true, runValidators: true });
        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }
        res.status(200).json({ success: true, message: "Course updated successfully" });
    }
    catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ success: false, message: "An error occurred while updating the course." });
    }
}
async function handleUpdatePersonalCourseFunction(req, res) {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found." });
        }
        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID is required." });
        }
        const updateData = {};
        const courseData = await Course_model_1.default.findOne({ courseId });
        if (req.body.courseName)
            updateData.courseName = req.body.courseName;
        if (req.body.tutorName)
            updateData.tutorName = req.body.tutorName;
        if (req.body.description)
            updateData.description = req.body.description;
        if (req.body.currency)
            updateData.currency = req.body.currency;
        if (req.body.sellingPrice)
            updateData.sellingPrice = req.body.sellingPrice;
        if (req.body.originalPrice)
            updateData.originalPrice = req.body.originalPrice;
        if (req.body.markdownContent)
            updateData.markdownContent = req.body.markdownContent;
        if (req.file) {
            if (courseData.thumbnail) {
                await (0, cloudinary_config_1.cloudinaryDeleteCourseImage)(courseData.thumbnail);
            }
            const localFilePath = req.file.path;
            const uploadResult = await (0, cloudinary_config_1.cloudinaryUploadCourseImageFiles)(localFilePath);
            if (!uploadResult) {
                return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            }
            fs_1.default.unlink(localFilePath, (err) => {
                if (err)
                    console.error("Error deleting local file:", err);
            });
            updateData.thumbnail = uploadResult.url;
        }
        else if (req.body.personalCourseImage) {
            updateData.thumbnail = req.body.personalCourseImage;
        }
        const updatedCourse = await Course_model_1.default.findOneAndUpdate({ courseId }, updateData, { new: true, runValidators: true });
        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }
        res.status(200).json({ success: true, message: "Course updated successfully" });
    }
    catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ success: false, message: "An error occurred while updating the course." });
    }
}
async function handleUpdateRedirectCourseFunction(req, res) {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found." });
        }
        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID is required." });
        }
        const updateData = {};
        const courseData = await Course_model_1.default.findOne({ courseId });
        if (req.body.courseName)
            updateData.courseName = req.body.courseName;
        if (req.body.tutorName)
            updateData.tutorName = req.body.tutorName;
        if (req.body.description)
            updateData.description = req.body.description;
        if (req.body.currency)
            updateData.currency = req.body.currency;
        if (req.body.sellingPrice)
            updateData.sellingPrice = req.body.sellingPrice;
        if (req.body.originalPrice)
            updateData.originalPrice = req.body.originalPrice;
        if (req.body.redirectLink)
            updateData.redirectLink = req.body.redirectLink;
        if (req.body.markdownContent)
            updateData.markdownContent = req.body.markdownContent;
        if (req.file) {
            if (courseData.thumbnail) {
                await (0, cloudinary_config_1.cloudinaryDeleteCourseImage)(courseData.thumbnail);
            }
            const localFilePath = req.file.path;
            const uploadResult = await (0, cloudinary_config_1.cloudinaryUploadCourseImageFiles)(localFilePath);
            if (!uploadResult) {
                return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            }
            fs_1.default.unlink(localFilePath, (err) => {
                if (err)
                    console.error("Error deleting local file:", err);
            });
            updateData.thumbnail = uploadResult.url;
        }
        else if (req.body.redirectCourseImage) {
            updateData.thumbnail = req.body.redirectCourseImage;
        }
        const updatedCourse = await Course_model_1.default.findOneAndUpdate({ courseId }, updateData, { new: true, runValidators: true });
        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }
        res.status(200).json({ success: true, message: "Course updated successfully" });
    }
    catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ success: false, message: "An error occurred while updating the course." });
    }
}
