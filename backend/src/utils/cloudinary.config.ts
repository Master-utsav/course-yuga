import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export function getPublicIdFromPath(cloudinaryPath: string): string {
  const parts = cloudinaryPath.split('/');
  return parts[parts.length - 1]; // Returns the last part as public ID
}

export const getSignedVideoUrl = (publicId: string): string => {
  return cloudinary.url(publicId, {
    resource_type: "video",
    type: "upload",
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 15, // 15 mins expiry
  });
};

export async function cloudinaryUploadUserImageFiles(localFilePath: string) {
  if (!localFilePath) {
    return null;
  } else {
    try {
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
        folder: "userImages",
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

export async function cloudinaryUploadCourseImageFiles(localFilePath: string) {
  if (!localFilePath) {
    return null;
  } else {
    try {
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
        folder: "courseImages",
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

export async function cloudinaryUploadVideoImageFiles(localFilePath: string) {
  if (!localFilePath) {
    return null;
  } else {
    try {
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
        folder: "videoImages",
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

export async function cloudinaryUploadVideoFiles(localFilePath: string) {
  if (!localFilePath) {
    return null;
  } else {
    try {
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
        folder: "VideoFiles",
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

export async function cloudinaryDeleteUserImage(ImageUrl: string) {
  if (!ImageUrl) {
    return null;
  }

  const publicId = `userImages/${extractPublicIdFromUrl(ImageUrl)}`;

  if (!publicId) {
    return null;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return result;
  } catch (error) {
    console.error("Error deleting user image:", error);
    return null;
  }
}

export async function cloudinaryDeleteCourseImage(ImageUrl: string) {
  if (!ImageUrl) {
    return null;
  }

  const publicId = `courseImages/${extractPublicIdFromUrl(ImageUrl)}`;

  if (!publicId) {
    return null;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return result;
  } catch (error) {
    console.error("Error deleting course image:", error);
    return null;
  }
}

export async function cloudinaryDeleteVideoImage(ImageUrl: string) {
  if (!ImageUrl) {
    return null;
  }

  const publicId = `videoImages/${extractPublicIdFromUrl(ImageUrl)}`;

  if (!publicId) {
    return null;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return result;
  } catch (error) {
    console.error("Error deleting course image:", error);
    return null;
  }
}

export async function cloudinaryDeleteVideoFile(VideoUrl: string) {
  if (!VideoUrl) {
    return null;
  }

  const publicId = `VideoFiles/${extractPublicIdFromUrl(VideoUrl)}`;

  if (!publicId) {
    return null;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    return result;
  } catch (error) {
    console.error("Error deleting course video:", error);
    return null;
  }
}

function extractPublicIdFromUrl(url: string): string | null {
  const regex = /\/([^\/]+)\.(jpg|jpeg|png|gif|webp|tiff|bmp)$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
