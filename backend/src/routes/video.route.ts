import express from "express";
import { authenticateAdminToken } from "../middleware/auth.middleware";
import { upload, uploadVideo } from "../middleware/multer.middleware";
import { handleAddNewPersonalVideoFunction, handleAddNewYoutubeVideoFunction } from "../controllers/video/uploadVideo.controllers";

const videoRoute = express.Router();


videoRoute.post("/add-video/youtube" , authenticateAdminToken , upload.single("youtubeVideoImage") , uploadVideo.single("youtubeVideoFile"),   handleAddNewYoutubeVideoFunction);
videoRoute.post("/add-video/personal" , authenticateAdminToken , upload.single("personalVideoImage"), uploadVideo.single("personalVideoFile"), handleAddNewPersonalVideoFunction);

export default videoRoute;