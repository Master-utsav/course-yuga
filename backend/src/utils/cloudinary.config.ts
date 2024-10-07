import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function cloudinaryUploadFile(localFilePath: string) {
  if (!localFilePath) {
    return null;
  } else {
    try {
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });

      return {
        url: response.secure_url,
        public_id: response.public_id,
      };
    } catch (error) {

      return null;
    }
  }
}
