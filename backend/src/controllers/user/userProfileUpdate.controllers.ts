import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import {Response} from "express"
import { cloudinaryUploadFile } from "../../utils/cloudinary.config";
import User from "../../models/User.model";
import fs from "fs";

export async function handleUpdateUserImageFunction(req : AuthenticatedRequest, res: Response) {
    try {
      const userId = req.userId;
  
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded." });
      }
  
      const localFilePath = req.file.path;
  
      const uploadResult = await cloudinaryUploadFile(localFilePath);
      
      if (!uploadResult) {
        return res.status(500).json({ message: "Failed to upload image to Cloudinary." });
      }
  
      fs.unlink(localFilePath, (err:any) => {
        if (err) {
          console.error("Error deleting local file:", err);
        }
      });
  
      const updatedUser = await User.findByIdAndUpdate(userId , {
        $set : {
          profileImageUrl : uploadResult.url
        }
      })
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
      }
  
      await updatedUser.save();
      
      return res.status(200).json({
        success: true,
        message: "Image uploaded successfully.",
      });
    } catch (error) {
      console.error("Error updating user image:", error);
      return res.status(500).json({success: false, message: "An error occurred while uploading the image." });
    }
  }