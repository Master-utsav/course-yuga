import { Response } from "express";
import { AuthenticatedAdminRequest } from "../../middleware/auth.middleware";
import { cloudinaryUploadCourseImageFiles } from "../../utils/cloudinary.config";
import CourseModel from "../../models/Course.model";
import UserModel from "../../models/User.model";
import fs from "fs"

export async function handleAddNewYoutubeCourseFunction(req: AuthenticatedAdminRequest , res: Response) {
        try {

          const userId = req.userId;

          const { courseName, tutorName, description, currency, thumbnail: thumbnailURL } = req.body;
          let thumbnail = "";
      
          if (req.file) {
            const localFilePath = req.file.path;
      
            // Upload to Cloudinary
            const uploadResult = await cloudinaryUploadCourseImageFiles(localFilePath);
            if (!uploadResult) {
              return res.status(500).json({success: false, message: "Failed to upload image to Cloudinary." });
            }
      
            thumbnail = uploadResult.url;
      
            fs.unlink(localFilePath, (err: any) => {
              if (err) console.error("Error deleting local file:", err);
            });
          } 
          else if (thumbnailURL) {
            thumbnail = thumbnailURL;
          } 
          else {
            return res.status(400).json({success: false, message: "No image file or URL provided." });
          }
      
          // Create new course object
          const newCourse = new CourseModel({
            courseName,
            tutorName,
            courseType: "YOUTUBE",
            description,
            currency,
            sellingPrice: 0,
            originalPrice: 1,
            thumbnail,
            isVerified: false,
            uploadedBy: userId,
          });
      
          await newCourse.save();
      
          // Optionally update the user who uploaded the course
          const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $push: { uploadedCourses: newCourse._id } },
            { new: true }
          );
      
          if (!updatedUser) {
            return res.status(404).json({success: false, message: "User not found." });
          }
      
          res.status(201).json({success: true, message: "Course created successfully", courseId: newCourse._id});
        } catch (error) {
          console.error("Error adding course:", error);
          res.status(500).json({success: false, message: "An error occurred while adding the course." });
        }
};


export async function handleAddNewPersonalCourseFunction(req: AuthenticatedAdminRequest , res: Response) {
    
}
export async function handleAddNewRedirectCourseFunction(req: AuthenticatedAdminRequest , res: Response) {
    
}