import { AuthenticatedAdminRequest } from "../../middleware/auth.middleware";
import { Request, Response } from "express";
import CourseModel, { ICourse } from "../../models/Course.model";

export async function handleFetchCourseByIdFunction(req: Request, res: Response) {

  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ success: false, message: "Missing 'courseId' parameter" });
  }
   
  try {
    let course = await CourseModel.findOne({courseId});

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    course = {
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
    };

    return res.status(200).json({ success: true, course });
  } 
  catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}


export async function handleFetchAllCoursesFunction(req: Request, res: Response) {

  try {
    const courses: ICourse[] = await CourseModel.find().select(
      "tutorName courseId courseName description ratingCount rating thumbnail sellingPrice currency courseType originalPrice"
    );
    
    if (!courses || courses.length === 0) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    
    const coursesData = courses.map((course) => ({
      tutorName: course.tutorName,
      courseId: course.courseId,
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

// Helper function to build the sort query
function buildSortQuery(order?: string): string {
  switch (order) {
    case "Latest":
      return "-createdAt"; // Newest first
    case "Oldest":
      return "createdAt"; // Oldest first
    case "A to Z":
      return "courseName"; // Alphabetical order (ascending)
    case "Z to A":
      return "-courseName"; // Alphabetical order (descending)
    default:
      return "-createdAt"; // Default: Newest first
  }
}

export async function handleFetchAllCoursesAsPerParams(req: Request, res: Response) {
  try {
    const { order, category } = req.query;

    // Build the filter object only if category is provided
    const filter: Record<string, any> = category
      ? { courseType: category }
      : {};

    // Build the sort query
    const sort = buildSortQuery(order as string);

    // Fetch courses from MongoDB using Mongoose
    const courses = await CourseModel.find(filter).sort(sort).exec();

    if(!courses){
      return res.status(400).json({ success: false, message: "No Course found" });
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

    return res.status(200).json({ success: true, data: transformedCourses});

  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function handleGetCourseBySearchParams(req: Request, res: Response) {
  try {
    const { searchTerm } = req.query; // Get searchTerm from query parameters

    // Ensure searchTerm is defined and is a string
    if (typeof searchTerm !== 'string') {
      return res.status(400).json({ success: false, message: "Invalid search term" });
    }

    // Build a regular expression for case-insensitive search
    const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive

    // Fetch courses matching the search term in courseName or tutorName
    const updatedCourseData = await CourseModel.find({
      $or: [
        { courseName: { $regex: regex } },
        { tutorName: { $regex: regex } },
      ],
    });

    if(!updatedCourseData){
      return res.status(400).json({ success: false, message: "No Course found" });
    }
    const transformedCourses = updatedCourseData.map(course => ({
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

    return res.status(200).json({ success: true, data: transformedCourses});
  }
  catch(error){
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function handleGetCoursesByUserIdFunction (req: AuthenticatedAdminRequest, res: Response) {
  const userId = req.userId;
  const uniqueId = req.userUniqueId;

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  if(!uniqueId){
    return res.status(400).json({ success: false, message: "Unique ID is required" });
  }

  try {
    const courses = await CourseModel.find({ uploadedBy: uniqueId });
    
    if (courses.length === 0) {
      return res.status(404).json({ success: false, message: "No courses found" });
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

    return res.status(200).json({ success: true, data: transformedCourses});

  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


