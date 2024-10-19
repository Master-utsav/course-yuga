import { Response } from "express";
import { AuthenticatedAdminRequest } from "../../middleware/auth.middleware";
import CourseModel from "../../models/Course.model";
import bcrypt from "bcryptjs"
import User from "../../models/User.model";
import mongoose from "mongoose";
import { cloudinaryDeleteCourseImage } from "../../utils/cloudinary.config";

export async function handleDeleteCourseFunction (req: AuthenticatedAdminRequest , res: Response){
    const userId = req.userId;
    const { password , courseId} = req.body;
  
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No user found" });
    }
  
    try {
      const course = await CourseModel.findById(courseId);
  
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: "course not found" });
      }

      
      const user = await User.findById(userId);
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid password" });
      }

      const courseObjectId = new mongoose.Types.ObjectId(courseId);
      user.uploadedCourses = user.uploadedCourses.filter(
        (id: any) => !id.equals(courseObjectId)
      );
      
      if(course.thumbnail){
        await cloudinaryDeleteCourseImage(course.thumbnail);
      }
      
      const deletedCourse = await CourseModel.deleteOne({ _id : courseId });


      if (!deletedCourse) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }
    

      await user.save();

      return res
        .status(200)
        .json({ success: true, message: "Course deleted successfully" });

    } catch (error) {

      console.error("Error deleting account:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
}