import { AuthenticatedAdminRequest, AuthenticatedRequest } from "../../middleware/auth.middleware";
import { Request, Response } from "express";
import CourseModel, { ICourse } from "../../models/Course.model";

export async function handleFetchCourseByIdFunction(req: Request, res: Response) {

  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ success: false, message: "Missing 'courseId' parameter" });
  }

  try {
    const course = await CourseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    return res.status(200).json({ success: true, course });
  } 
  catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}


export async function handleFetchAllCoursesFunction(req: Request, res: Response) {

  try {
    const courses: ICourse[] = await CourseModel.find().select(
      "tutorName _id courseName description ratingCount rating thumbnail sellingPrice currency courseType originalPrice"
    );
    
    if (!courses || courses.length === 0) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    
    const coursesData = courses.map((course) => ({
      tutorName: course.tutorName,
      courseId: course._id,
      courseName: course.courseName,
      description: course.description,
      ratingCount: course.ratingCount,
      rating: course.rating,
      thumbnail: course.thumbnail,
      currency: course.currency,
      sellingPrice: course.sellingPrice,
      courseType: course.courseType,
      originalPrice: course.originalPrice,
    }));
    
    return res.status(200).json({ success: true, data: coursesData });
  } 
  catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
  
}

export async function handlegetCoursesByUserIdFunction (req: AuthenticatedAdminRequest, res: Response) {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    const courses = await CourseModel.find({ uploadedBy: userId });

    if (courses.length === 0) {
      return res.status(404).json({ success: false, message: "No courses found" });
    }

    return res.status(200).json({ success: true, data: courses });

  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


