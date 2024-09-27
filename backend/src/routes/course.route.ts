import express from "express";
import { handleAddNewCourseFunction, handleDeleteCourseFunction, handleFetchAllCourseFunction, handleFetchAllCoursesOfUserFunction, handleSelectedCourseFunction, handleUpdateCourseFunction } from "../controllers/course.controllers";
import { authenticateToken } from "../middleware/auth.middleware";
const courseRoute = express.Router();

courseRoute.get("/" , handleFetchAllCourseFunction);
courseRoute.get("/:slug" , handleSelectedCourseFunction);
courseRoute.get("/userCourses" , authenticateToken , handleFetchAllCoursesOfUserFunction);
courseRoute.post("/addCourse" , handleAddNewCourseFunction);
courseRoute.put("/updateCourse/:slug" , handleUpdateCourseFunction);
courseRoute.delete("/rm-course" , handleDeleteCourseFunction);

export default courseRoute;