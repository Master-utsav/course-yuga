import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import CourseModel from "../../models/Course.model";
import User from "../../models/User.model";

export async function handleUserEnrolledCourseFunction(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;

    if (!userId) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { courseId } = req.body;

    if (!courseId) {
        return res.status(400).json({ success: false, message: 'Course ID not provided' });
    }

    const course = await CourseModel.findById(courseId);
    
    if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    
    try {
        const user = await User.findById(userId);
        
        const alreadyEnrolledInCourse = course.enrolledBy.includes(userId);
        const alreadyEnrolledInUser = user.enrolledIn.includes(courseId);
    
        if (alreadyEnrolledInCourse && alreadyEnrolledInUser) {
          return res.status(400).json({
            success: false,
            message: "User is already enrolled in this course",
          });
        }

        course.enrolledBy.push(userId);
        await course.save();

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.enrolledIn.push(courseId);
        await user.save();

        return res.status(200).json({ success: true, message: 'User enrolled in course successfully' });
    } catch (error) {
        console.error('Error enrolling user in course:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
