import { AuthenticatedAdminRequest } from "../../middleware/auth.middleware";
import {Response} from "express"
import VideoModel, { IVideo } from "../../models/Video.model";
import { cloudinaryDeleteVideoImage, cloudinaryUploadVideoImageFiles } from "../../utils/cloudinary.config";
import fs from "fs";

export async function handleUpdateYoutubeVideoFunction(req: AuthenticatedAdminRequest, res: Response) {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found." });
        }

        const { videoId } = req.body;
        if (!videoId) {
            return res.status(400).json({ success: false, message: "Video ID is required." });
        }

        const updateData: Partial<IVideo> = {};
        const videoData = await VideoModel.findById(videoId);

        if (req.body.videoName) updateData.videoName = req.body.videoName;
        if (req.body.tutorName) updateData.tutorName = req.body.tutorName;
        if (req.body.description) updateData.description = req.body.description;
        if (req.body.markdownContent) updateData.markdownContent = req.body.markdownContent;
        if(req.body.videoTimeStamps) updateData.videoTimeStamps = JSON.parse(req.body.videoTimeStamps);

        if (req.file) {
            if (videoData.thumbnail) {
                await cloudinaryDeleteVideoImage(videoData.thumbnail);
            }

            const localFilePath = req.file.path;
            const uploadResult = await cloudinaryUploadVideoImageFiles(localFilePath);
            if (!uploadResult) {
                return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            }

            fs.unlink(localFilePath, (err: any) => {
                if (err) console.error("Error deleting local file:", err);
            });

            updateData.thumbnail = uploadResult.url;
        } 
        else if (req.body.youtubeVideoImage) {
            updateData.thumbnail = req.body.youtubeVideoImage;
        }

        const updatedVideo = await VideoModel.findByIdAndUpdate(videoId, updateData, { new: true });
        if (!updatedVideo) {
            return res.status(404).json({ success: false, message: "Video not found." });
        }

        res.status(200).json({ success: true, message: "Video updated successfully" });
    } catch (error) {
        console.error("Error updating video:", error);
        res.status(500).json({ success: false, message: "An error occurred while updating the video." });
    }
}

export async function handleUpdatePersonalVideoFunction(req: AuthenticatedAdminRequest, res: Response) {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found." });
        }

        const { videoId } = req.body;
        if (!videoId) {
            return res.status(400).json({ success: false, message: "Video ID is required." });
        }

        const updateData: Partial<IVideo> = {};
        const videoData = await VideoModel.findById(videoId);

        if (req.body.videoName) updateData.videoName = req.body.videoName;
        if (req.body.tutorName) updateData.tutorName = req.body.tutorName;
        if (req.body.description) updateData.description = req.body.description;
        if (req.body.markdownContent) updateData.markdownContent = req.body.markdownContent;
        if(req.body.videoTimeStamps) updateData.videoTimeStamps = JSON.parse(req.body.videoTimeStamps);

        if (req.file) {
            if (videoData.thumbnail) {
                await cloudinaryDeleteVideoImage(videoData.thumbnail);
            }

            const localFilePath = req.file.path;
            const uploadResult = await cloudinaryUploadVideoImageFiles(localFilePath);
            if (!uploadResult) {
                return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            }

            fs.unlink(localFilePath, (err: any) => {
                if (err) console.error("Error deleting local file:", err);
            });

            updateData.thumbnail = uploadResult.url;
        } 
        else if (req.body.youtubeVideoImage) {
            updateData.thumbnail = req.body.youtubeVideoImage;
        }

        const updatedVideo = await VideoModel.findByIdAndUpdate(videoId, updateData, { new: true });
        if (!updatedVideo) {
            return res.status(404).json({ success: false, message: "Video not found." });
        }

        res.status(200).json({ success: true, message: "Video updated successfully" });
    } catch (error) {
        console.error("Error updating video:", error);
        res.status(500).json({ success: false, message: "An error occurred while updating the video." });
    }
}