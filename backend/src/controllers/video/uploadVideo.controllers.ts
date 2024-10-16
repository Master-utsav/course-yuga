import { Response } from "express";
import { AuthenticatedAdminRequest } from "../../middleware/auth.middleware";
import { cloudinaryUploadVideoFiles, cloudinaryUploadVideoImageFiles } from "../../utils/cloudinary.config";
import CourseModel from "../../models/Course.model";
import fs from "fs"
import VideoModel from "../../models/Video.model";


export async function handleAddNewYoutubeVideoFunction(req: AuthenticatedAdminRequest, res: Response) {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User not authorized" });
        }

        const { videoName, tutorName, courseId , videoUrl } = req.body;

        if (!courseId) {
            return res.status(400).json({ success: false, message: "Missing 'courseId' parameter" });
        }

        let thumbnail = "";

        if (req.file) {
            const localFilePath = req.file.path;

            const uploadResult = await cloudinaryUploadVideoImageFiles(localFilePath);
            if (!uploadResult) {
                return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            }

            thumbnail = uploadResult.url;

            fs.unlink(localFilePath, (err: any) => {
                if (err) console.error("Error deleting local file:", err);
            });
        } else if (req.body.youtubeVideoImage) {
            thumbnail = req.body.youtubeVideoImage;
        }

        if (!thumbnail && !videoUrl) {
            return res.status(400).json({ success: false, message: "No image file or URL provided." });
        }

        const description = req.body.description || '';
        const videoTimeStamps = req.body.videoTimeStamps || [];

        const newVideo = new VideoModel({
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

        await newVideo.save();

        // Optionally update the user who uploaded the course
        const updatedCourse = await CourseModel.findByIdAndUpdate(
            courseId,
            { $push: { videos: newVideo._id } },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }

        res.status(201).json({ success: true, message: "Video uploaded successfully", videoId: newVideo._id });

    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ success: false, message: "An error occurred while adding the course." });
    }
}


export async function handleAddNewPersonalVideoFunction(req: AuthenticatedAdminRequest , res: Response) {
  try {
      const userId = req.userId;

      if (!userId) {
          return res.status(400).json({ success: false, message: "User not authorized" });
      }

      console.log("Inside YouTube video upload handle");

      const { videoName, tutorName, courseId } = req.body;

      if (!courseId) {
          return res.status(400).json({ success: false, message: "Missing 'courseId' parameter" });
      }

      let thumbnail = "";
      let videoUrl = "";

      const imageFiles = (req.files as { [key: string]: Express.Multer.File[] })['personalVideoImage'];
      const videoFiles = (req.files as { [key: string]: Express.Multer.File[] })['personalVideoFile'];

      if (imageFiles && imageFiles.length > 0) {
          const localFilePath = imageFiles[0].path; 

          const uploadResult = await cloudinaryUploadVideoImageFiles(localFilePath);
          if (!uploadResult) {
              return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
          }

          thumbnail = uploadResult.url;

          fs.unlink(localFilePath, (err: any) => {
              if (err) console.error("Error deleting local file:", err);
          });
      } else if (req.body.personalVideoImage) {
          thumbnail = req.body.personalVideoImage;
      }

      if (videoFiles && videoFiles.length > 0) {
          const localFilePath = videoFiles[0].path; 

          const uploadResult = await cloudinaryUploadVideoFiles(localFilePath);
          if (!uploadResult) {
              return res.status(500).json({ success: false, message: "Failed to upload video to Cloudinary." });
          }

          videoUrl = uploadResult.url;

          fs.unlink(localFilePath, (err: any) => {
              if (err) console.error("Error deleting local file:", err);
          });
      } else if (req.body.personalVideoFile) {
          videoUrl = req.body.personalVideoFile;
      }

      if (!thumbnail && !videoUrl) {
          return res.status(400).json({ success: false, message: "No image file or URL provided." });
      }

      const description = req.body.description || '';
      const videoTimeStamps = req.body.videoTimeStamps || [];

      const newVideo = new VideoModel({
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

      await newVideo.save();

      const updatedCourse = await CourseModel.findByIdAndUpdate(
          courseId,
          { $push: { videos: newVideo._id } },
          { new: true }
      );

      if (!updatedCourse) {
          return res.status(404).json({ success: false, message: "Course not found." });
      }

      res.status(201).json({ success: true, message: "Video uploaded successfully", videoId: newVideo._id });

    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ success: false, message: "An error occurred while adding the course." });
    }
}
