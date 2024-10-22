import { Request, Response } from "express";
import VideoModel from "../../models/Video.model";

export async function handleGetAllVideosOfCourse(req: Request, res: Response) {
  const { courseId } = req.query;

  if (!courseId) {
    return res.status(400).json({ success: false, message: "Course ID is required" });
  }

  try {
    const videos = await VideoModel.find({ courseId });

    if (!videos || videos.length === 0) {
      return res.status(404).json({ success: false, message: "No videos found for the given course" });
    }

    // Transform videos based on their type
    const transformedVideos = videos.map((video) => {
      const videoResponse = {
        videoName: video.videoName,
        tutorName: video.tutorName,
        videoType: video.videoType,
        courseId: video.courseId,
        videoId: video.videoId,
        uploadedBy: video.uploadedBy,
        thumbnail: video.thumbnail,
        videoUrl: video.videoType === "YOUTUBE" ? video.videoUrl : video.pub_id,
        description: video.description ?? '', 
        watchedBy: video.watchedBy ?? [], 
        watchCount: video.watchCount ?? 0, 
        videoTimeStamps: video.videoTimeStamps ?? [], 
        isVerified: video.isVerified,
        markdownContent: video.markdownContent ?? '', 
        pub_id: video.pub_id ?? '', 
      };

      return videoResponse;
    });

    return res.status(200).json({
      success: true,
      message: "All videos of the given course",
      videos: transformedVideos,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function handleGetVideoDataById(req: Request, res: Response) {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ success: false, message: "Video ID is required" });
  }

  try {
    const video = await VideoModel.findOne({ videoId });

    if (!video) {
      return res.status(404).json({ success: false, message: "No video found for the given ID" });
    }

    // Construct the response based on video type
    const responseData = {
      videoName: video.videoName,
      tutorName: video.tutorName,
      videoType: video.videoType,
      courseId: video.courseId,
      videoId: video.videoId,
      uploadedBy: video.uploadedBy,
      thumbnail: video.thumbnail,
      videoUrl: video.videoType === "YOUTUBE" ? video.videoUrl : video.pub_id, 
      description: video.description ?? '', 
      watchedBy: video.watchedBy ?? [], 
      watchCount: video.watchCount ?? 0, 
      videoTimeStamps: video.videoTimeStamps ?? [], 
      isVerified: video.isVerified,
      markdownContent: video.markdownContent ?? '', 
      pub_id: video.pub_id ?? '', 
    };

    return res.status(200).json({
      success: true,
      message: "Video data fetched successfully",
      video: responseData,
    });
  } catch (error) {
    console.error("Error fetching video data:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
