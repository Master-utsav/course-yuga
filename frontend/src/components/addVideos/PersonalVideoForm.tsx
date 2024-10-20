import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea, Image } from "@nextui-org/react";
import { motion } from "framer-motion";
import AddIcon from "@/Icons/AddIcon";
import { useTheme } from "@/context/ThemeProvider";
import { VIDEO_API } from "@/lib/env";
import { getVerifiedToken } from "@/lib/cookieService";
import axios from "axios";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import { useNavigate } from "react-router-dom";

interface PersonalVideoFormProps{
    courseId: string | null;
    courseName: string | null;
    onRefresh: (fresh : boolean) => void;
}

const personalVideoSchema = z
  .object({
    videoName: z.string().min(3, "Video name must be at least 3 characters"),
    tutorName: z.string().min(2, "Tutor name must be at least 2 characters"),
    description: z
      .string()
      .optional(),
    personalVideo: z.instanceof(File),
    thumbnail: z
      .union([
        z
          .string()
          .url()
          .refine((url) => url !== "", {
            message: "Please enter a valid URL.",
          }),
        z.instanceof(File),
      ])
      .or(z.literal("")),
  })
  .refine(
    (data) =>
      data.thumbnail instanceof File ||
      (typeof data.thumbnail === "string" && data.thumbnail.trim() !== ""),
    {
      message: "You must provide a thumbnail either as a file or a valid URL.",
      path: ["thumbnail"],
    }
  );

  
type PersonalVideoFormData = z.infer<typeof personalVideoSchema>;

const PersonalVideoForm: React.FC<PersonalVideoFormProps> = ({courseId , courseName , onRefresh }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PersonalVideoFormData>({
    resolver: zodResolver(personalVideoSchema),
  });
  
  const [preview, setPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isFileUpload, setIsFileUpload] = useState(true);
  const { theme } = useTheme();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!courseId) {
      navigate("/user/add-videos");
    }
  }, [courseId, navigate]);
   
  async function uploadVideo(videoId: string , data: PersonalVideoFormData){
    const formData = new FormData();
    formData.append('videoId', videoId);
    if (data.personalVideo instanceof File) {
      const blob = new Blob([data.personalVideo], { type: data.personalVideo.type });
      console.log(blob);
      formData.append("personalVideoFile", blob, data.personalVideo.name);
    }

    for (const [key, value] of formData.entries()) {
      console.log(`Key: ${key}, Value:`, value);
    }
    const jwt = getVerifiedToken();
    try {
      const response = await axios.post(
        `${VIDEO_API}/upload-video/personal`,
         formData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response && response.data && response.data.success) {
        SuccessToast(response.data.message);
        onRefresh(true);
      } else {
        ErrorToast(response.data.message);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error.response?.data?.message || "Something went wrong");
    }
  }

  const onSubmit: SubmitHandler<PersonalVideoFormData> = async (data) => {
    const formData = new FormData();
    formData.append("videoName", data.videoName);
    formData.append("tutorName", data.tutorName);
    if (data.description) formData.append("description", data.description); 
    formData.append("courseId", courseId || ""); 
    
    if (data.thumbnail instanceof File) {
      const blob = new Blob([data.thumbnail], { type: data.thumbnail.type });
      formData.append("personalVideoImage", blob, data.thumbnail.name);
    } else {
      formData.append("personalVideoImage", data.thumbnail);
    }

    const jwt = getVerifiedToken();
    try {
      const response = await axios.post(
        `${VIDEO_API}/add-video/personal`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response && response.data && response.data.success) {
        SuccessToast(response.data.message);
        await uploadVideo(response.data.videoId , data);
        onRefresh(true);
      } else {
        ErrorToast(response.data.message);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("thumbnail", file);
      const url = URL.createObjectURL(file);
      setPreview(url);
      setIsFileUpload(true);
    }
  };

  const handleThumbnailUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreview(null);
    const url = e.target.value;
    if (url) {
      setValue("thumbnail", url);
      setPreview(url);
      setIsFileUpload(false);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("personalVideo", file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  return (
    <motion.form
      className="w-full mx-auto p-6 pb-12 bg-white dark:bg-gray-800 rounded-br-xl rounded-bl-xl shadow-md border-t-[1px] border-purple-100/40"
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0.3, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-4xl font-ubuntu font-semibold text-center mb-5 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        Upload Personal Video in course, <span className="underline decoration-purple-500">{courseName}</span> 
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="w-full flex flex-col justify-start items-end">
          <Input
            {...register("videoName")}
            label="Video Title"
            variant="underlined"
            placeholder="Enter Video title"
            className={`text-base rounded-lg dark:text-white text-black font-ubuntu font-medium`}
          />
          {errors.videoName && (
            <p className="text-red-500 text-sm">{errors.videoName.message}</p>
          )}
        </div>
        <div className="w-full flex flex-col justify-start items-end">
          <Input
            {...register("tutorName")}
            label="Tutor Name"
            variant="underlined"
            placeholder="Enter tutor name"
            className={`text-base rounded-lg dark:text-white text-black font-ubuntu font-medium`}
          />
          {errors.tutorName && (
            <p className="text-red-500 text-sm">{errors.tutorName.message}</p>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col justify-start items-end mb-4">
        <Textarea
          {...register("description")}
          label="Description"
          variant="underlined"
          placeholder="Enter video description"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input
            label="Category"
            variant="underlined"
            placeholder="Personal"
            className={`text-base rounded-lg dark:text-white text-black font-ubuntu font-medium`}
          />
        <div className="w-full flex flex-col justify-start items-start">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 text-start">
            Video File (Choose File)
        </label>
        <div className="w-full flex sm:flex-row flex-col items-center space-x-2 ">
              <input
                type="file"
                onChange={handleVideoChange}
                className="w-full flex-grow p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
                accept="video/mp4"
              />
          </div>
          {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="mt-4 max-h-40 aspect-video object-cover rounded-lg shadow-md"
              />
            )}
        </div>
      </div>

      {/* Thumbnail Upload */}
      <div className="w-full relative grid sm:grid-cols-2 grid-cols-1 gap-5 items-start justify-between">
        <div className="mb-4 w-full ">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Thumbnail (Choose File or Enter URL)
          </label>
          <div className="flex flex-col space-y-1 mt-1">
            <div className="flex sm:flex-row flex-col items-center space-x-2">
              <input
                type="file"
                onChange={handleThumbnailChange}
                className="w-full flex-grow p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
                accept="image/*"
              />
              <Button
                onClick={() => setIsFileUpload(!isFileUpload)}
                className="w-full text-sm rounded-lg font-medium"
                variant="light"
              >
                {isFileUpload ? "Switch to URL" : "Switch to File"}
              </Button>
            </div>
            {!isFileUpload && (
              <input
                type="text"
                onChange={handleThumbnailUrlChange}
                placeholder="Enter thumbnail URL"
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 mt-2"
              />
            )}
            {preview && (
              <Image
                src={preview}
                isBlurred
                alt="Thumbnail Preview"
                className="mt-4 max-h-40 w-full aspect-video object-cover rounded-lg shadow-md"
              />
            )}
            {errors.thumbnail && (
              <p className="text-red-500 text-sm text-start">
                {errors.thumbnail.message}
              </p>
            )}
          </div>
        </div>
        <Button
          type="submit"
          className={` w-full text-xl mt-4 p-8 rounded-lg font-medium transition-colors ${
            isSubmitting
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-800 hover:from-indigo-600 hover:to-purple-600 text-white"
          }`}
          isLoading={isSubmitting}
          startContent={
            <AddIcon
              fillColor={theme === "dark" ? "white" : "black"}
              size={32}
            />
          }
        >
          {isSubmitting ? "Uploading..." : "Upload Video"}
        </Button>
      </div>
    </motion.form>
  );
};

export default PersonalVideoForm;
