import express from "express";
import { authenticateAdminToken, authenticateToken } from "../middleware/auth.middleware";
import { handleAddNewPersonalCourseFunction, handleAddNewRedirectCourseFunction, handleAddNewYoutubeCourseFunction } from "../controllers/course/uploadCourse.controllers";
import { upload } from "../middleware/multer.middleware";
import { handleFetchCourseByIdFunction } from "../controllers/course/getCourses.cntrollers";
import { handleUpdateYoutubeCourseFunction } from "../controllers/course/updateCourse.controllers";
const courseRoute = express.Router();

// courseRoute.get("/" , handleFetchAllCourseFunction);
// courseRoute.get("/:slug" , handleSelectedCourseFunction);

courseRoute.post("/get-course" , handleFetchCourseByIdFunction);

courseRoute.post("/add-course/youtube" , authenticateAdminToken , upload.single("youtubeCourseImage"),   handleAddNewYoutubeCourseFunction);
courseRoute.post("/add-course/personal" , authenticateAdminToken , upload.single("personalCourseImage"), handleAddNewPersonalCourseFunction);
courseRoute.post("/add-course/redirect" , authenticateAdminToken , upload.single("redirectCourseImage"),  handleAddNewRedirectCourseFunction);

courseRoute.put("/update-course/youtube" , authenticateAdminToken , upload.single("youtubeCourseImage"),   handleUpdateYoutubeCourseFunction);
// courseRoute.delete("/rm-course" , handleDeleteCourseFunction);

export default courseRoute;