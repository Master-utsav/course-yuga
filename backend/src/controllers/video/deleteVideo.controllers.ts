import { Response } from "express";
import { AuthenticatedAdminRequest } from "../../middleware/auth.middleware";
import VideoModel from "../../models/Video.model";
import CourseModel from "../../models/Course.model";
import mongoose  from "mongoose";

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

        const video = await VideoModel.findByIdAndDelete(videoId);
        if (!video) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }

        const course = await CourseModel.findById(video.courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        
        const videoObjectId = new mongoose.Types.ObjectId(videoId);
      
        course.videos = course.videos.filter(
            (id: any) => !id.equals(videoObjectId)
        );

        await course.save();

        return res.status(200).json({ success: true, message: "Video deleted successfully" }); 

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
