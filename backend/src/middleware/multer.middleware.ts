import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express"; 

// Storage for images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../cloud/images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});


const storageVideo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../cloud/videos')); // Video directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Video file filter to allow only MP4 files
const videoFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === '.mp4' && file.mimetype === 'video/mp4') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only MP4 videos are allowed!')); // Reject other files
  }
};

// Export the video upload middleware
export const uploadVideo = multer({
  storage: storageVideo,
  fileFilter: videoFileFilter,
});

export const upload = multer({ storage });
