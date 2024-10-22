import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import CourseModel from "../../models/Course.model";
import User from "../../models/User.model";

export async function handleUserEnrolledCourseFunction(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const uniqueId = req.userUniqueId;

    if (!userId) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { courseId } = req.body;

    if (!courseId) {
        return res.status(400).json({ success: false, message: 'Course ID not provided' });
    }

    const course = await CourseModel.findOne({courseId});
    
    if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    
    try {
        const user = await User.findById(userId);

        const alreadyEnrolledInCourse = course.enrolledBy.includes(uniqueId);
        const alreadyEnrolledInUser = user.enrolledIn.includes(courseId);
    
        if (alreadyEnrolledInCourse && alreadyEnrolledInUser) {
          return res.status(400).json({
            success: false,
            message: "User is already enrolled in this course",
          });
        }

        course.enrolledBy.push(user.uniqueId);
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

export async function handleGetAllCoursesEnrolledByUser(req : AuthenticatedRequest , res: Response) {
    const userId = req.userId;
    const uniqueId = req.userUniqueId;

    if(!userId){
        return res.status(401).json({ success: false, message: 'Unauthoorized'});
    }
    if(!uniqueId){
        return res.status(401).json({ success: false, message: 'Unauthoorized'});
    }
    
    try {
        const courses = await CourseModel.find({$or: [{enrolledBy : uniqueId} , {uploadedBy: uniqueId}]});
        if(!courses){
            return res.status(400).json({success: false , message: "No course Found"})
        }

        const transformedCourses = courses.map(course => ({
            courseName: course.courseName,
            courseId: course.courseId,
            tutorName: course.tutorName,
            courseType: course.courseType,
            description: course.description ?? '', 
            currency: course.currency,
            sellingPrice: course.sellingPrice,
            originalPrice: course.originalPrice,
            thumbnail: course.thumbnail,
            isVerified: course.isVerified,
            uploadedBy: course.uploadedBy,
            ratings: course.ratings ?? [], 
            ratingCount: course.ratings?.length ?? 0, 
            likedBy: course.likedBy ?? [], 
            likedCount: course.likedBy?.length ?? 0,  
            markdownContent: course.markdownContent ?? '', 
            redirectLink: course.redirectLink ?? '', 
            enrolledBy: course.enrolledBy ?? [], 
            enrolledCount: course.enrolledBy?.length ?? 0,
            videos: course.videos ?? [] 
          }));
        
        return res.status(200).json({success: true , messsage : "course courses were fetched" , data: transformedCourses});

    } catch (error) {
        return res.status(500).json({success: false , message: "Internal server error"});  
    }
}
