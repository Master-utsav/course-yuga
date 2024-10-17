import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import User from "../../models/User.model";
import mongoose from "mongoose";
import VideoModel from "../../models/Video.model";

export async function handleUserCourseBookmarkfunction(req: AuthenticatedRequest , res: Response){
    const userId = req.userId

    if(!userId){
        return res.status(401).json({success: false , message: 'userId not found'})
    }

    const {courseId} = req.body;

    if(!courseId){
        return res.status(400).json({success: false , message: 'courseId not found'})
    }
    
    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({success: false , message: 'user not found'})
        }
        
        const courseIndex = user.bookmarks.course.findIndex((id : mongoose.Types.ObjectId) =>
          id.equals(courseId)
        );
    
        if (courseIndex !== -1) {
          user.bookmarks.course.splice(courseIndex, 1);
          await user.save();
    
          const courseBookmarks = user.bookmarks.course; 
          return res.status(200).json({
            success: true,
            message: 'Removed from bookmarks',
            courseBookmarks,
          });
        } else {
          user.bookmarks.course.push(courseId);
          await user.save();
    
          const courseBookmarks = user.bookmarks.course;
          return res.status(200).json({
            success: true,
            message: 'Added to bookmarks',
            courseBookmarks,
          });
        }

    } catch (error) {
        return res.status(500).json({success: false , message: "Internal server error"})
    }
}

export async function handleUserVideoBookmarkfunction(req: AuthenticatedRequest , res: Response){
    const userId = req.userId

    if(!userId){
        return res.status(401).json({success: false , message: 'userId not found'})
    }

    const {videoId} = req.body;

    if(!videoId){
        return res.status(400).json({success: false , message: 'videoId not found'})
    }
    
    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({success: false , message: 'user not found'})
        }
        
        const videoIndex = user.bookmarks.video.findIndex((id : mongoose.Types.ObjectId) =>
          id.equals(videoId)
        );
    
        if (videoIndex !== -1) {
          user.bookmarks.video.splice(videoIndex, 1);
          await user.save();
    
          const videoBookmarks = user.bookmarks.video; 
          return res.status(200).json({
            success: true,
            message: 'Removed from bookmarks',
            videoBookmarks,
          });
        } else {
          user.bookmarks.video.push(videoId);
          await user.save();
    
          const videoBookmarks = user.bookmarks.video;
          return res.status(200).json({
            success: true,
            message: 'Added to bookmarks',
            videoBookmarks,
          });
        }

    } catch (error) {
        return res.status(500).json({success: false , message: "Internal server error"})
    }
}

export async function handleUserCourseProgress(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'User ID not found' });
  }

  const { videoId, courseId } = req.body;

  if (!videoId || !courseId) {
    return res.status(400).json({ success: false, message: 'Video ID or Course ID not found' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const videoObjectId = new mongoose.Types.ObjectId(videoId);

    // Find the course progress entry
    let courseProgress = user.progress.find((p: any) => p.courseId.equals(courseObjectId));

    if (courseProgress) {
    
      const videoIndex = courseProgress.completedVideos.findIndex((id: any) => id.equals(videoObjectId));

      if (videoIndex > -1) {
        courseProgress.completedVideos.splice(videoIndex, 1);
        await user.save();

        const count = await calculateProgress(courseObjectId, userId);
        courseProgress.count = count;
        await user.save();
        return res.status(200).json({
          success: true,
          message: 'Marked as incomplete'
        });
      } 
      else {
        courseProgress.completedVideos.push(videoObjectId);
        await user.save();

        const count = await calculateProgress(courseObjectId, userId);
        courseProgress.count = count;
        await user.save();
        return res.status(200).json({
          success: true,
          message: 'Marked as complete'
        });
      }
    } 
    else {
      user.progress.push({
        courseId: courseObjectId,
        completedVideos: [videoObjectId],
      });
      await user.save();
      
      const count = await calculateProgress(courseObjectId, userId);
      user.progress.push({
        count,
      });
      await user.save();
      
      return res.status(200).json({
        success: true,
        message: 'Marked as complete',
      });
    }
  } catch (error) {
    console.error('Error handling course progress:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function calculateProgress(courseId: mongoose.Types.ObjectId, userId: string) {
  try {
   
    const totalVideos = await VideoModel.find({ courseId }).countDocuments();
  
    if (totalVideos === 0) return 0; 

    const user = await User.findById(userId);
    const courseProgress = user?.progress.find((p: any) => p.courseId.equals(courseId));

    const completedVideosCount = courseProgress?.completedVideos.length || 0;

    const progress = (completedVideosCount / totalVideos) * 100;
    return parseFloat(progress.toFixed(0)); 
  } catch (error) {
    console.error('Error calculating progress:', error);
    return 0; 
  }
}
