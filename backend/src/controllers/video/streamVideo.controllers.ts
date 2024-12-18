import { Request, Response } from "express";
import { getSignedVideoUrl } from "../../utils/cloudinary.config";
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import VideoModel from "../../models/Video.model";
import User from "../../models/User.model";
dotenv.config();

// Helper function to verify JWT token
async function checkAuth(token: string): Promise<{ userId: string , uniqueId: string} | string> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        return resolve("Invalid token");
      }
      if (decoded && typeof decoded === "object" && "id" in decoded) {
        resolve({ userId: (decoded as { id: string }).id , uniqueId : (decoded as { uniqueId: string }).uniqueId });
      } else {
        resolve("Invalid token");
      }
    });
  });
}

export async function handleVideoStreamingFunction(req: Request, res: Response) {
  const { publicId } = req.params;
  const { token } = req.query as { token: string };
  const range = req.headers.range;

  if (!token) {
    return res.status(400).send("Requires token header");
  }

  const authData = await checkAuth(token);

  if (typeof authData === "string") {
    return res.status(401).send(authData); // "Invalid token"
  }

  const { userId , uniqueId} = authData;
  if (!userId) {
    return res.status(400).send("User ID not found");
  }

  if (!publicId) {
    return res.status(400).send("Public ID not found");
  }
  
  const video = await VideoModel.findOne({$and : [{pub_id : publicId} , {videoType : "PERSONAL"}]})

  if (!video) {
    return res.status(404).send("Video not found");
  }

  if (!range) {
    return res.status(400).send("Requires Range header");
  }

  try {
    // Generate a signed URL for the Cloudinary video
    const signedUrl = getSignedVideoUrl(`VideoFiles/${publicId}`);

    // Fetch the video using Axios with the Range header
    const response = await axios.get(signedUrl, {
      headers: { Range: range },
      responseType: "stream", // Important for streaming
    });

    if (response.status !== 206) {
      return res.status(response.status).send("Error fetching video");
    }

    // Set response headers for streaming video
    res.writeHead(206, {
      "Content-Range": response.headers["content-range"],
      "Accept-Ranges": "bytes",
      "Content-Length": response.headers["content-length"],
      "Content-Type": "video/mp4",
    });

    // Stream the video data to the frontend
    response.data.pipe(res);

    if (!video.watchedBy.includes(uniqueId)) {
      video.watchedBy.push(uniqueId);
    }
    await handleUserHistoryVideoOrder(video.videoId , userId);

    await video.save();
  } catch (error) {
    console.error("Error streaming video:", error);
    res.status(500).send("An error occurred while streaming the video.");
  }
}

async function handleUserHistoryVideoOrder(videoId: string, userId: string) {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      console.error("User not found");
      return;
    }

    // Check if the video is already in history
    const videoIndex = user.history.findIndex((item: any) => item.video === videoId);

    if (videoIndex !== -1) {
      // If it exists, update the timestamp
      user.history[videoIndex].time = new Date();
    } else {
      // Add new entry if not found
      user.history.push({ video: videoId, time: new Date() });
    }
    
    await user.save();

  } catch (error) {
    console.error("Error updating user history:", error);
  }
}
