"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteCourseFunction = handleDeleteCourseFunction;
const Course_model_1 = __importDefault(require("../../models/Course.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_model_1 = __importDefault(require("../../models/User.model"));
const cloudinary_config_1 = require("../../utils/cloudinary.config");
async function handleDeleteCourseFunction(req, res) {
    const userId = req.userId;
    const { password, courseId } = req.body;
    if (!userId) {
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized: No user found" });
    }
    try {
        const course = await Course_model_1.default.findOne({ courseId });
        if (!course) {
            return res
                .status(404)
                .json({ success: false, message: "course not found" });
        }
        const user = await User_model_1.default.findById(userId);
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid password" });
        }
        user.uploadedCourses = user.uploadedCourses.filter((id) => !id.equals(courseId));
        if (course.thumbnail) {
            await (0, cloudinary_config_1.cloudinaryDeleteCourseImage)(course.thumbnail);
        }
        const deletedCourse = await Course_model_1.default.deleteOne({ courseId });
        if (!deletedCourse) {
            return res
                .status(404)
                .json({ success: false, message: "Course not found" });
        }
        await user.save();
        return res
            .status(200)
            .json({ success: true, message: "Course deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting account:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
}
