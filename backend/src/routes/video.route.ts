import express from "express";
import { authenticateAdminToken } from "../middleware/auth.middleware";
import { upload, uploadVideo } from "../middleware/multer.middleware";
import { handleAddNewPersonalVideoFunction, handleAddNewYoutubeVideoFunction } from "../controllers/video/uploadVideo.controllers";
import { handleGetAllVideosOfCourse } from "../controllers/video/getVideo.controllers";
import { handleDeleteVideoFunction } from "../controllers/video/deleteVideo.controllers";

const videoRoute = express.Router();

videoRoute.get("/get-videos" , handleGetAllVideosOfCourse);

videoRoute.post("/add-video/youtube" , authenticateAdminToken , upload.single('youtubeVideoImage'), handleAddNewYoutubeVideoFunction);
videoRoute.post("/add-video/personal" , authenticateAdminToken , upload.single('personalVideoImage'), uploadVideo.single('personalVideoFile'), handleAddNewPersonalVideoFunction);

videoRoute.post("/delete-video" , authenticateAdminToken , handleDeleteVideoFunction);

export default videoRoute;