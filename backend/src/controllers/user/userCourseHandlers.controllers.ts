import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import User from "../../models/User.model";
import { Schema, Types } from "mongoose";
import { ICourse } from "../../models/Course.model";
import VideoModel from "../../models/Video.model";

export async function handleUserBookmarksfunction(req: AuthenticatedRequest , res: Response){
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

        if(user.bookmarks.includes(courseId)){
            user.bookmarks = user.bookmarks.filter((id: Types.ObjectId) => id !== courseId)
            await user.save();
            return res.status(200).json({success: true , message: 'removed from bookmarks'})
        }else{
            user.bookmarks.push(courseId)
            await user.save();
            return res.status(200).json({success: true , message: 'added to bookmarks'})
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

    const courseObjectId = new Schema.Types.ObjectId(courseId);
    const videoObjectId = new Schema.Types.ObjectId(videoId);

    // Find the course progress entry
    let courseProgress = user.progress.find((p: any) => p.courseId.equals(courseObjectId));

    if (courseProgress) {
    
      const videoIndex = courseProgress.completedVideos.findIndex((id: any) => id.equals(videoObjectId));

      if (videoIndex > -1) {
       
        courseProgress.completedVideos.splice(videoIndex, 1);
        await user.save();
        return res.status(200).json({
          success: true,
          message: 'Marked as incomplete',
          progress: await calculateProgress(courseObjectId, userId),
        });
      } else {
      
        courseProgress.completedVideos.push(videoObjectId);
        await user.save();
        return res.status(200).json({
          success: true,
          message: 'Marked as complete',
          progress: await calculateProgress(courseObjectId, userId),
        });
      }
    } else {
     
      user.progress.push({
        courseId: courseObjectId,
        completedVideos: [videoObjectId],
      });
      await user.save();
      return res.status(200).json({
        success: true,
        message: 'Marked as complete',
        progress: await calculateProgress(courseObjectId, userId),
      });
    }
  } catch (error) {
    console.error('Error handling course progress:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function calculateProgress(courseId: Schema.Types.ObjectId, userId: string) {
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
