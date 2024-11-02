import express, {Request} from "express";
import { authenticateAdminToken, authenticateToken } from "../middleware/auth.middleware";
// import { upload, uploadVideo } from "../middleware/multer.middleware";
import multer from 'multer';
import { handleAddNewPersonalVideoFunction, handleAddNewYoutubeVideoFunction, handleUploadPersonalVideoFunction } from "../controllers/video/uploadVideo.controllers";
import { handleGetAllVideosOfCourse, handleGetVideoDataById } from "../controllers/video/getVideo.controllers";
import { handleDeleteVideoFunction } from "../controllers/video/deleteVideo.controllers";
import { handleUpdatePersonalVideoFunction, handleUpdateYoutubeVideoFunction } from "../controllers/video/updateVideo.controllers";
import { handleVideoStreamingFunction } from "../controllers/video/streamVideo.controllers";
import path from 'path';
const videoRoute = express.Router();

const storage = multer.memoryStorage();

const videoFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === '.mp4' && file.mimetype === 'video/mp4') {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Only MP4 videos are allowed!')); 
    }
};

// Export the video upload middleware
export const upload = multer({ storage });
export const uploadVideo = multer({ storage, fileFilter: videoFileFilter });

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