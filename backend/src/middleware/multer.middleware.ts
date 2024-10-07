import multer from "multer";
import path from "path"; // Import path module

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use path.join to construct the absolute path
    cb(null, path.join(__dirname, '../../public/userImages'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Create multer upload instance
export const upload = multer({ storage });
