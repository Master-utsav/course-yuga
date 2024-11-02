import { Response } from "express";
import { AuthenticatedAdminRequest } from "../../middleware/auth.middleware";
import CourseModel from "../../models/Course.model";
import bcrypt from "bcryptjs"
import User from "../../models/User.model";
import { cloudinaryDeleteCourseImage } from "../../utils/cloudinary.config";

export async function handleDeleteCourseFunction(req: AuthenticatedAdminRequest, res: Response) {
  const userId = req.userId;
  const { password, courseId } = req.body;

  if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user found" });
  }

  try {
      const course = await CourseModel.findOne({ courseId });

      if (!course) {
          return res.status(404).json({ success: false, message: "Course not found" });
      }

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ success: false, message: "Invalid password" });
      }

      // Remove the course ID from the user's uploadedCourses
      user.uploadedCourses = user.uploadedCourses.filter((id: string) => id !== course.courseId);

      // Delete the course thumbnail from Cloudinary if it exists
      if (course.thumbnail) {
          await cloudinaryDeleteCourseImage(course.thumbnail);
      }

      // Delete the course
      const deleteResult = await CourseModel.deleteOne({ courseId });
      if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ success: false, message: "Course not found" });
      }

      // Save the user after removing the course ID
      await user.save();

      return res.status(200).json({ success: true, message: "Course deleted successfully" });

  } catch (error) {
      console.error("Error deleting course:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
