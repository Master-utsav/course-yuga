import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { Response } from "express";
import User from "../../models/User.model";

export async function handleUpdateUserFunction(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const userId = req.userId;
      const {
        firstName,
        lastName,
        userDob,
        role,
        address,
        bio,
        userName,
      } = req.body;
  
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized: No user found" });
      }
  
      // Initialize updateData object with optional fields if they are not null or undefined
      const updateData: {
        firstName?: string;
        lastName?: string;
        userDob?: string;
        role?: string;
        address?: {
          country: string;
          city: string;
          state: string;
        };
        bio?: string;
        userName?: string;
      } = {};
  
      if (firstName != null) updateData.firstName = firstName;
      if (lastName != null) updateData.lastName = lastName;
      if (userDob != null) updateData.userDob = userDob;
      if (role != null) updateData.role = role;
      if (address != null) updateData.address = address;
      if (bio != null) updateData.bio = bio;
      if (userName != null) updateData.userName = userName;
  
      const isUser = await User.find({userName : userName});
      
      if (isUser.length !== 0) {
        return res
          .status(404)
          .json({ success: false, message: "username already exists" });
      }
  
  
      if (Object.keys(updateData).length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No fields to update" });
      }
  
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      );
  
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
  
      await user.save();
  
      return res
        .status(200)
        .json({ success: true, message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }