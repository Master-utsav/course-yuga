import { Request, Response } from "express";
import { getSignedVideoUrl } from "../../utils/cloudinary.config";
import axios from "axios";

export async function handleVideoStreamingFunction(req: Request, res: Response) {
  const { publicId } = req.params;
  const range = req.headers.range;

  if (!range) {
    return res.status(400).send("Requires Range header");
  }
  
  try {
    // Generate a signed URL for the Cloudinary video
    const signedUrl = getSignedVideoUrl(`VideoFiles/${publicId}`);
     
    console.log("Signed URL:", signedUrl);
    console.log("Range header:", range);

    // Fetch the video using Axios with the Range header
    const response = await axios.get(signedUrl, {
      headers: { Range: range },
      responseType: 'stream', // Important for streaming
    });

    // Check if the response is okay
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
  } catch (error) {
    console.error("Error streaming video:", error);
    res.status(500).send("An error occurred while streaming the video.");
  }
}
