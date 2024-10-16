import express from "express";
import { authenticateAdminToken, authenticateToken } from "../middleware/auth.middleware";
import { handleAddNewPersonalCourseFunction, handleAddNewRedirectCourseFunction, handleAddNewYoutubeCourseFunction } from "../controllers/course/uploadCourse.controllers";
import { upload } from "../middleware/multer.middleware";
import { handleFetchAllCoursesFunction, handleFetchCourseByIdFunction, handlegetCoursesByUserIdFunction } from "../controllers/course/getCourses.controllers";
import { handleUpdatePersonalCourseFunction, handleUpdateRedirectCourseFunction, handleUpdateYoutubeCourseFunction } from "../controllers/course/updateCourse.controllers";
import { handleUserEnrolledCourseFunction } from "../controllers/course/enrolledCourses.controllers";
import { handleDeleteCourseFunction } from "../controllers/course/deleteCourse.controllers";

const courseRoute = express.Router();

// courseRoute.get("/" , handleFetchAllCourseFunction);
// courseRoute.get("/:slug" , handleSelectedCourseFunction);

courseRoute.post("/get-course" , handleFetchCourseByIdFunction);
courseRoute.get("/get-all-courses" , handleFetchAllCoursesFunction);
courseRoute.get("/get-admin-courses" , authenticateAdminToken ,  handlegetCoursesByUserIdFunction);

courseRoute.post("/enroll-in-course" , authenticateToken , handleUserEnrolledCourseFunction);

courseRoute.post("/add-course/youtube" , authenticateAdminToken , upload.single("youtubeCourseImage"),   handleAddNewYoutubeCourseFunction);
courseRoute.post("/add-course/personal" , authenticateAdminToken , upload.single("personalCourseImage"), handleAddNewPersonalCourseFunction);
courseRoute.post("/add-course/redirect" , authenticateAdminToken , upload.single("redirectCourseImage"),  handleAddNewRedirectCourseFunction);

courseRoute.put("/update-course/youtube" , authenticateAdminToken , upload.single("youtubeCourseImage"),   handleUpdateYoutubeCourseFunction);
courseRoute.put("/update-course/personal" , authenticateAdminToken , upload.single("personalCourseImage"),   handleUpdatePersonalCourseFunction);
courseRoute.put("/update-course/redirect" , authenticateAdminToken , upload.single("redirectCourseImage"),   handleUpdateRedirectCourseFunction);

courseRoute.delete("/delete-course" , authenticateAdminToken, handleDeleteCourseFunction);

export default courseRoute;