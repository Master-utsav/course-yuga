import express from "express";
import { authenticateAdminToken } from "../middleware/auth.middleware";
import { upload, uploadVideo } from "../middleware/multer.middleware";
import { handleAddNewPersonalVideoFunction, handleAddNewYoutubeVideoFunction, handleUploadPersonalVideoFunction } from "../controllers/video/uploadVideo.controllers";
import { handleGetAllVideosOfCourse, handleGetVideoDataById } from "../controllers/video/getVideo.controllers";
import { handleDeleteVideoFunction } from "../controllers/video/deleteVideo.controllers";
import { handleUpdatePersonalVideoFunction, handleUpdateYoutubeVideoFunction } from "../controllers/video/updateVideo.controllers";
import { handleVideoStreamingFunction } from "../controllers/video/streamVideo.controllers";

const videoRoute = express.Router();

videoRoute.get("/get-videos" , handleGetAllVideosOfCourse);
videoRoute.get("/get-video-by-id" , handleGetVideoDataById);

videoRoute.post("/add-video/youtube" , authenticateAdminToken , upload.single('youtubeVideoImage'), handleAddNewYoutubeVideoFunction);
videoRoute.post("/add-video/personal" , authenticateAdminToken , upload.single('personalVideoImage'), handleAddNewPersonalVideoFunction);
videoRoute.post("/upload-video/personal" , authenticateAdminToken , uploadVideo.single('personalVideoFile'), handleUploadPersonalVideoFunction);

videoRoute.put("/update-video/youtube" , authenticateAdminToken , upload.single('youtubeVideoImage'), handleUpdateYoutubeVideoFunction);
videoRoute.put("/update-video/personal" , authenticateAdminToken , upload.single('personalVideoImage'), handleUpdatePersonalVideoFunction);

videoRoute.post("/delete-video" , authenticateAdminToken , handleDeleteVideoFunction);

videoRoute.get("/stream-video/:publicId" , handleVideoStreamingFunction)

export default videoRoute;