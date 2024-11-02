import { Response } from "express";
import { AuthenticatedAdminRequest } from "../../middleware/auth.middleware";
import VideoModel from "../../models/Video.model";
import CourseModel from "../../models/Course.model";
import { cloudinaryDeleteVideoFile, cloudinaryDeleteVideoImage } from "../../utils/cloudinary.config";

export async function handleDeleteVideoFunction(req: AuthenticatedAdminRequest, res: Response) {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { videoId } = req.body;

    if (!videoId) {
        return res.status(400).json({ success: false, message: "Video ID is required" });
    }

    try {
        // Find the video by ID
        const video = await VideoModel.findOne({ videoId });
        
        if (!video) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }

        // Delete thumbnail from Cloudinary if it exists
        if (video.thumbnail) {
            await cloudinaryDeleteVideoImage(video.thumbnail);
        }

        // Delete video file from Cloudinary if the URL is valid
        if (video.videoUrl && video.videoUrl.includes("https://res.cloudinary.com")) {
            await cloudinaryDeleteVideoFile(video.videoUrl);
        }

        // Remove the video from the database
        await VideoModel.findOneAndDelete({ videoId });

        // Find the course associated with the video
        const courseId = video.courseId;
        const course = await CourseModel.findOne({courseId});
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Remove the video ID from the course's videos array
        course.videos = course.videos.filter((id: string) => id !== videoId);
        
        // Save the updated course
        await course.save();

        return res.status(200).json({ success: true, message: "Video deleted successfully" }); 

    } catch (error) {
        console.error("Error deleting video:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

