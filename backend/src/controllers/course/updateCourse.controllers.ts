import { Response } from "express";
import { AuthenticatedAdminRequest } from "../../middleware/auth.middleware";
import { cloudinaryDeleteCourseImage, cloudinaryUploadCourseImageFiles } from "../../utils/cloudinary.config";
import CourseModel, { ICourse } from "../../models/Course.model";
import fs from "fs"

export async function handleUpdateYoutubeCourseFunction(req: AuthenticatedAdminRequest, res: Response) {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found." });
        }

        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID is required." });
        }

        const updateData: Partial<ICourse> = {};
        const courseData = await CourseModel.findById(courseId);

        if (req.body.courseName) updateData.courseName = req.body.courseName;
        if (req.body.tutorName) updateData.tutorName = req.body.tutorName;
        if (req.body.description) updateData.description = req.body.description;
        if (req.body.currency) updateData.currency = req.body.currency;
        if (req.body.markdownContent) updateData.markdownContent = req.body.markdownContent;

        if (req.file) {
            if (courseData.thumbnail) {
                await cloudinaryDeleteCourseImage(courseData.thumbnail);
            }

            const localFilePath = req.file.path;
            const uploadResult = await cloudinaryUploadCourseImageFiles(localFilePath);
            if (!uploadResult) {
                return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            }

            fs.unlink(localFilePath, (err: any) => {
                if (err) console.error("Error deleting local file:", err);
            });

            updateData.thumbnail = uploadResult.url;
        } else if (req.body.thumbnail) {
            updateData.thumbnail = req.body.thumbnail;
        }

        const updatedCourse = await CourseModel.findByIdAndUpdate(courseId, updateData, { new: true });
        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }

        res.status(200).json({ success: true, message: "Course updated successfully" });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ success: false, message: "An error occurred while updating the course." });
    }
}

export async function handleUpdatePersonalCourseFunction(req: AuthenticatedAdminRequest , res: Response) {
    
}
export async function handleUpdateRedirectCourseFunction(req: AuthenticatedAdminRequest , res: Response) {
    
}