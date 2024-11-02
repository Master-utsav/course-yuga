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
        
        const videoById = await VideoModel.findOne({videoId});
        if (videoById.thumbnail) {
            await cloudinaryDeleteVideoImage(videoById.thumbnail);
        }
        if (videoById.videoUrl.includes("https://res.cloudinary.com")) {
            await cloudinaryDeleteVideoFile(videoById.videoUrl);
        }

        const video = await VideoModel.findOneAndDelete({videoId});
        if (!video) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }

        const course = await CourseModel.findById(video.courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
      
        course.videos = course.videos.filter(
            (id: string) => id !== video.videoId
        );
        
        await video.save();
        await course.save();

        return res.status(200).json({ success: true, message: "Video deleted successfully" }); 

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
