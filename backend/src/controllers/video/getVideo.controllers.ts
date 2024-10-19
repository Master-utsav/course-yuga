import { Request, Response } from "express";
import VideoModel, { IVideo } from "../../models/Video.model";


export async function handleGetAllVideosOfCourse(req: Request, res: Response) {
  const { courseId } = req.query;

  if (!courseId) {
    return res.status(400).json({ success: false, message: "Course ID is required" });
  }

  try {
    const videos: IVideo[] = await VideoModel.find({ courseId });

    if (!videos || videos.length === 0) {
      return res.status(404).json({ success: false, message: "No videos found for the given course" });
    }

    // Transform videos based on their type
    const transformedVideos = videos.map((video) => {
      if (video.videoType === "YOUTUBE") {
        return {
          ...video.toObject(),
          videoUrl: video.videoUrl, // Send videoUrl for YOUTUBE videos
        };
      } else if (video.videoType === "PERSONAL") {
        return {
          ...video.toObject(),
          videoUrl: video.pub_id, 
        };
      }
      return video;
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
      const video: IVideo | null = await VideoModel.findById(videoId);
  
      if (!video) {
        return res.status(404).json({ success: false, message: "No video found for the given ID" });
      }
  
      // Transform the video based on its type
      let responseData;
  
      if (video.videoType === "YOUTUBE") {
        responseData = {
          ...video.toObject(),
          videoUrl: video.videoUrl, 
        };
      } else if (video.videoType === "PERSONAL") {
        responseData = {
          ...video.toObject(),
          videoUrl: video.pub_id, 
        };
      } else {
        responseData = video.toObject(); 
      }
  
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

