"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAddNewYoutubeCourseFunction = handleAddNewYoutubeCourseFunction;
exports.handleAddNewPersonalCourseFunction = handleAddNewPersonalCourseFunction;
exports.handleAddNewRedirectCourseFunction = handleAddNewRedirectCourseFunction;
const cloudinary_config_1 = require("../../utils/cloudinary.config");
const Course_model_1 = __importDefault(require("../../models/Course.model"));
const User_model_1 = __importDefault(require("../../models/User.model"));
const fs_1 = __importDefault(require("fs"));
async function handleAddNewYoutubeCourseFunction(req, res) {
    try {
        const userId = req.userId;
        const uniqueId = req.userUniqueId;
        const { courseName, tutorName, description, currency, youtubeCourseImage } = req.body;
        let thumbnail = "";
        if (req.file) {
            const localFilePath = req.file.path;
            // Upload to Cloudinary
            const uploadResult = await (0, cloudinary_config_1.cloudinaryUploadCourseImageFiles)(localFilePath);
            if (!uploadResult) {
                return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            }
            thumbnail = uploadResult.url;
            fs_1.default.unlink(localFilePath, (err) => {
                if (err)
                    console.error("Error deleting local file:", err);
            });
        }
        else if (youtubeCourseImage) {
            thumbnail = youtubeCourseImage;
        }
        else {
            return res.status(400).json({ success: false, message: "No image file or URL provided." });
        }
        const { nanoid } = await import('nanoid');
        // Create new course object
        const newCourse = new Course_model_1.default({
            courseId: nanoid(),
            courseName,
            tutorName,
            courseType: "YOUTUBE",
            description,
            currency,
            sellingPrice: 0,
            originalPrice: 1,
            thumbnail,
            isVerified: false,
            uploadedBy: uniqueId,
        });
        await newCourse.save();
        // Optionally update the user who uploaded the course
        const updatedUser = await User_model_1.default.findByIdAndUpdate(userId, { $push: { uploadedCourses: newCourse.courseId, enrolledIn: newCourse.courseId } }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.status(201).json({ success: true, message: "Course created successfully", courseId: newCourse.courseId });
    }
    catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ success: false, message: "An error occurred while adding the course." });
    }
}
;
async function handleAddNewPersonalCourseFunction(req, res) {
    try {
        const userId = req.userId;
        const uniqueId = req.userUniqueId;
        const { courseName, tutorName, description, currency, sellingPrice, originalPrice, personalCourseImage } = req.body;
        let thumbnail = "";
        if (req.file) {
            const localFilePath = req.file.path;
            // Upload to Cloudinary
            const uploadResult = await (0, cloudinary_config_1.cloudinaryUploadCourseImageFiles)(localFilePath);
            if (!uploadResult) {
                return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            }
            thumbnail = uploadResult.url;
            fs_1.default.unlink(localFilePath, (err) => {
                if (err)
                    console.error("Error deleting local file:", err);
            });
        }
        else if (personalCourseImage) {
            thumbnail = personalCourseImage;
        }
        else {
            return res.status(400).json({ success: false, message: "No image file or URL provided." });
        }
        const { nanoid } = await import('nanoid');
        // Create new course object
        const newCourse = new Course_model_1.default({
            courseId: nanoid(),
            courseName,
            tutorName,
            courseType: "PERSONAL",
            description,
            currency,
            sellingPrice,
            originalPrice,
            thumbnail,
            isVerified: false,
            uploadedBy: uniqueId,
        });
        await newCourse.save();
        // Optionally update the user who uploaded the course
        const updatedUser = await User_model_1.default.findByIdAndUpdate(userId, { $push: { uploadedCourses: newCourse.courseId, enrolledIn: newCourse.courseId } }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.status(201).json({ success: true, message: "Course created successfully", courseId: newCourse.courseId });
    }
    catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ success: false, message: "An error occurred while adding the course." });
    }
}
async function handleAddNewRedirectCourseFunction(req, res) {
    try {
        const userId = req.userId;
        const uniqueId = req.userUniqueId;
        const { courseName, tutorName, description, currency, sellingPrice, originalPrice, redirectCourseImage, redirectLink } = req.body;
        let thumbnail = "";
        if (req.file) {
            const localFilePath = req.file.path;
            // Upload to Cloudinary
            const uploadResult = await (0, cloudinary_config_1.cloudinaryUploadCourseImageFiles)(localFilePath);
            if (!uploadResult) {
                return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            }
            thumbnail = uploadResult.url;
            fs_1.default.unlink(localFilePath, (err) => {
                if (err)
                    console.error("Error deleting local file:", err);
            });
        }
        else if (redirectCourseImage) {
            thumbnail = redirectCourseImage;
        }
        else {
            return res.status(400).json({ success: false, message: "No image file or URL provided." });
        }
        const { nanoid } = await import('nanoid');
        // Create new course object
        const newCourse = new Course_model_1.default({
            courseId: nanoid(),
            courseName,
            tutorName,
            courseType: "REDIRECT",
            description,
            currency,
            sellingPrice,
            originalPrice,
            thumbnail,
            redirectLink,
            isVerified: false,
            uploadedBy: uniqueId,
        });
        await newCourse.save();
        // Optionally update the user who uploaded the course
        const updatedUser = await User_model_1.default.findByIdAndUpdate(userId, { $push: { uploadedCourses: newCourse.courseId, enrolledIn: newCourse.courseId } }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.status(201).json({ success: true, message: "Course created successfully", courseId: newCourse.courseId });
    }
    catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ success: false, message: "An error occurred while adding the course." });
    }
}
