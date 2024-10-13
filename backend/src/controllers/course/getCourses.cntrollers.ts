import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { Request, Response } from "express";
import CourseModel from "../../models/Course.model";

export async function handleFetchCourseByIdFunction(
  req: Request,
  res: Response
) {

  const { courseId } = req.body;

  if (!courseId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing 'courseId' parameter" });
  }

  try {
    const course = await CourseModel.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    return res.status(200).json({ success: true, course });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
