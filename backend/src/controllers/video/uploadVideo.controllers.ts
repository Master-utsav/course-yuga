import { Response } from "express";
import { AuthenticatedAdminRequest } from "../../middleware/auth.middleware";
import { cloudinaryUploadVideoFiles, cloudinaryUploadVideoImageFiles } from "../../utils/cloudinary.config";
import CourseModel from "../../models/Course.model";
import UserModel from "../../models/User.model";
import fs from "fs"

export async function handleAddNewYoutubeVideoFunction(req: AuthenticatedAdminRequest , res: Response) {
        try {

          const userId = req.userId;

          if(!userId){
            return res.status(400).json({success: false, message: "user not authorized"});
          }
        
          const { videoName, tutorName , courseId , youtubeVideoImage , youtubeVideoFile } = req.body;

          if(!courseId){
            return res.status(400).json({success: false, message: "Missing 'courseId' parameter" });
          }
          let thumbnail = "";
          let videoUrl = "";

          if (req.file) {

            const localFilePath = req.file.path;
      
            if (localFilePath.includes("/public/images")){
                const uploadResult = await cloudinaryUploadVideoImageFiles(localFilePath);
                if (!uploadResult) {
                  return res.status(500).json({success: false, message: "Failed to upload image to Cloudinary." });
                }
          
                thumbnail = uploadResult.url;
          
                fs.unlink(localFilePath, (err: any) => {
                  if (err) console.error("Error deleting local file:", err);
                });
              } 
              if (localFilePath.includes("/public/videos")){
                const uploadResult = await cloudinaryUploadVideoFiles(localFilePath);
                if (!uploadResult) {
                    return res.status(500).json({success: false, message: "Failed to upload image to Cloudinary." });
                  }
            
                  thumbnail = uploadResult.url;
            
                  fs.unlink(localFilePath, (err: any) => {
                    if (err) console.error("Error deleting local file:", err);
                  });
              }
              
            }
            else if(youtubeVideoImage || youtubeVideoFile) {
                if(youtubeVideoImage){
                    thumbnail = youtubeVideoImage;
                }
                if(youtubeVideoFile){
                    videoUrl = youtubeVideoFile;
                }
            } 
          else {
            return res.status(400).json({success: false, message: "No image file or URL provided." });
          }
        
          
          let description = '';
          if (req.body.description) description = req.body.description;

          let videoTimeStamps = [];
          if (req.body.videoTimeStamps) videoTimeStamps = req.body.videoTimeStamps;
          
          // Create new course object
          const newCourse = new CourseModel({
            videoName,
            tutorName,
            videoType: "YOUTUBE",
            thumbnail,
            uploadedBy: userId,
            courseId,
            videoUrl,
            description,
            videoTimeStamps,
            isVerified: false,
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


export async function handleAddNewPersonalVideoFunction(req: AuthenticatedAdminRequest , res: Response) {
    try {

        const userId = req.userId;

        if(!userId){
          return res.status(400).json({success: false, message: "user not authorized"});
        }
      
        const { videoName, tutorName , courseId , youtubeVideoImage , youtubeVideoFile } = req.body;

        if(!courseId){
          return res.status(400).json({success: false, message: "Missing 'courseId' parameter" });
        }
        let thumbnail = "";
        let videoUrl = "";

        if (req.file) {

          const localFilePath = req.file.path;
    
          if (localFilePath.includes("/public/images")){
              const uploadResult = await cloudinaryUploadVideoImageFiles(localFilePath);
              if (!uploadResult) {
                return res.status(500).json({success: false, message: "Failed to upload image to Cloudinary." });
              }
        
              thumbnail = uploadResult.url;
        
              fs.unlink(localFilePath, (err: any) => {
                if (err) console.error("Error deleting local file:", err);
              });
            } 
            if (localFilePath.includes("/public/videos")){
              const uploadResult = await cloudinaryUploadVideoFiles(localFilePath);
              if (!uploadResult) {
                  return res.status(500).json({success: false, message: "Failed to upload image to Cloudinary." });
                }
          
                thumbnail = uploadResult.url;
          
                fs.unlink(localFilePath, (err: any) => {
                  if (err) console.error("Error deleting local file:", err);
                });
            }
            
          }
          else if(youtubeVideoImage || youtubeVideoFile) {
              if(youtubeVideoImage){
                  thumbnail = youtubeVideoImage;
              }
              if(youtubeVideoFile){
                  videoUrl = youtubeVideoFile;
              }
          } 
        else {
          return res.status(400).json({success: false, message: "No image file or URL provided." });
        }
      
        
        let description = '';
        if (req.body.description) description = req.body.description;

        let videoTimeStamps = [];
        if (req.body.videoTimeStamps) videoTimeStamps = req.body.videoTimeStamps;
        
        // Create new course object
        const newCourse = new CourseModel({
          videoName,
          tutorName,
          videoType: "PERSONAL",
          thumbnail,
          uploadedBy: userId,
          courseId,
          videoUrl,
          description,
          videoTimeStamps,
          isVerified: false,
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
    
}
