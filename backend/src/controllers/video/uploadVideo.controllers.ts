import { Response } from "express";
import { AuthenticatedAdminRequest } from "../../middleware/auth.middleware";
import { cloudinaryUploadVideoFiles, cloudinaryUploadVideoImageFiles, getPublicIdFromPath } from "../../utils/cloudinary.config";
import CourseModel from "../../models/Course.model";
import VideoModel from "../../models/Video.model";
// import fs from "fs"

export async function handleAddNewYoutubeVideoFunction(req: AuthenticatedAdminRequest, res: Response) {
    try {
        const userId = req.userId;
        const uniqueId = req.userUniqueId;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User not authorized" });
        }
        if(!uniqueId){
            return res.status(400).json({ success: false, message: "User not authorized" });
        }

        const { videoName, tutorName, courseId , videoUrl } = req.body;

        if (!courseId) {
            return res.status(400).json({ success: false, message: "Missing 'courseId' parameter" });
        }

        let thumbnail = "";

        if (req.file) {
            // const localFilePath = req.file.path;

            // const uploadResult = await cloudinaryUploadVideoImageFiles(localFilePath);
            const uploadResult = await cloudinaryUploadVideoImageFiles(req.file.buffer) as { url: string; public_id: string };
            if (!uploadResult) {
                return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            }

            thumbnail = uploadResult.url;

            // fs.unlink(localFilePath, (err: any) => {
            //     if (err) console.error("Error deleting local file:", err);
            // });
        } else if (req.body.youtubeVideoImage) {
            thumbnail = req.body.youtubeVideoImage;
        }

        if (!thumbnail && !videoUrl) {
            return res.status(400).json({ success: false, message: "No image file or URL provided." });
        }

        const description = req.body.description || '';
        const videoTimeStamps = req.body.videoTimeStamps || [];
        
        const { nanoid } = await import('nanoid');
        const newVideo = new VideoModel({
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
        const updatedCourse = await CourseModel.findOneAndUpdate(
            {courseId},
            { $push: { videos: newVideo.videoId } },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }

        res.status(201).json({ success: true, message: "Video uploaded successfully", videoId: newVideo.videoId });

    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ success: false, message: "An error occurred while adding the course." });
    }
}


export async function handleAddNewPersonalVideoFunction(req: AuthenticatedAdminRequest, res: Response) {
    try {
        const userId = req.userId;
        const uniqueId = req.userUniqueId;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User not authorized" });
        }
        if(!uniqueId){
            return res.status(400).json({ success: false, message: "User not authorized" });
        }

        const { videoName, tutorName, courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ success: false, message: "Missing 'courseId' parameter" });
        }

        let thumbnail = "";

        if (req.file) {
            // const localFilePath = req.file.path;

            // const uploadResult = await cloudinaryUploadVideoImageFiles(localFilePath);
            const uploadResult = await cloudinaryUploadVideoImageFiles(req.file.buffer) as { url: string; public_id: string };
            if (!uploadResult) {
                return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            }

            thumbnail = uploadResult.url;

            // fs.unlink(localFilePath, (err: any) => {
            //     if (err) console.error("Error deleting local file:", err);
            // });
        } else if (req.body.personalVideoImage) {
            thumbnail = req.body.personalVideoImage;
        }

        if (!thumbnail) {
            return res.status(400).json({ success: false, message: "No image file or URL provided." });
        }

        const description = req.body.description || '';
        const videoTimeStamps = req.body.videoTimeStamps || [];
        
        const { nanoid } = await import('nanoid');
        const newVideo = new VideoModel({
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
        const updatedCourse = await CourseModel.findOneAndUpdate(
            {courseId},
            { $push: { videos: newVideo.videoId } },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }

        res.status(201).json({ success: true, message: "Video uploading please wait...", videoId: newVideo.videoId });

    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ success: false, message: "An error occurred while adding the course." });
    }
}

export async function handleUploadPersonalVideoFunction(req: AuthenticatedAdminRequest, res: Response) {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User not authorized" });
        }

        const {videoId} = req.body;

        if (!videoId) {
            return res.status(400).json({ success: false, message: "Missing videoId parameter" });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No video file uploaded.' });
        }

        const video = await VideoModel.findOne({videoId});
     
        if (req.file) {
            // const localFilePath = req.file.path;

            // const uploadResult = await cloudinaryUploadVideoFiles(localFilePath);
            const uploadResult = await cloudinaryUploadVideoFiles(req.file.buffer) as { url: string; public_id: string };
            if (!uploadResult) {
                return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            }

            video.videoUrl = uploadResult.url;
            video.pub_id = getPublicIdFromPath(uploadResult.public_id);

            // fs.unlink(localFilePath, (err: any) => {
            //     if (err) console.error("Error deleting local file:", err);
            // });
        } 
        else{
            return res.status(400).json({ success: false, message: "No Video file provided." });
        }
 
        await video.save();

        // Optionally update the user who uploaded the course
        res.status(201).json({ success: true, message: "Video uploaded successfully", videoId: video.videoId });

    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ success: false, message: "An error occurred while adding the course." });
    }
}


