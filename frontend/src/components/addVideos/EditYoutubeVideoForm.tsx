import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {Button, Input, Textarea, Image} from "@nextui-org/react";
import { motion } from "framer-motion";
import AddTimeStamps, { TimeStamp } from "./AddTimeStamps";

const youtubeVideoRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S+)?$/;

const youtubeVideoSchema = z
  .object({
    videoName: z.string().min(3, "Video name must be at least 3 characters"),
    tutorName: z.string().min(2, "Tutor name must be at least 2 characters"),
    description: z
      .string()
      .optional(),
    videoUrl: z.string().regex(youtubeVideoRegex, { message: "Invalid YouTube URL" }),
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

  
type YoutubeVideoFormData = z.infer<typeof youtubeVideoSchema>;

interface EditYoutubeCourseFormProps {
  video: YoutubeVideoFormData; // The initial course data to edit
  onEditVideo: (updatedVideo: YoutubeVideoFormData) => void; // Callback to pass updated data to parent
  setVideoCardImagePreview: (url: string) => void;
  onEditTimeStamps: (timestamps : TimeStamp[]) => void;
  timestamp: TimeStamp[];
}


const EditYoutubeCourseForm: React.FC<EditYoutubeCourseFormProps> = ({video, onEditVideo, setVideoCardImagePreview , onEditTimeStamps , timestamp}) => {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
      } = useForm<YoutubeVideoFormData>({
        resolver: zodResolver(youtubeVideoSchema),
        defaultValues: video
      });

  const [preview, setPreview] = useState<string>(video.thumbnail as string);
  const [timeStamps , setTimeStamps] = useState<TimeStamp[]>(timestamp);
  const [isFileUpload, setIsFileUpload] = useState(typeof video.thumbnail === "object");

  const onSubmit: SubmitHandler<YoutubeVideoFormData> = async (data) => {
    onEditVideo(data);
    onEditTimeStamps(timeStamps);
    setVideoCardImagePreview(preview);
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
    const url = e.target.value;
    if (url) {
      setValue("thumbnail", url);
      setPreview(url);
      setIsFileUpload(false);
    }
  };

  const handleTimeStamps = (timestamps : {text: string , time : string}[]) => {
    setTimeStamps(timestamps);
  }

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
        Edit Youtube Video
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="w-full flex flex-col justify-start items-end">
          <Input
            {...register("videoName")}
            label="Video Name"
            variant="underlined"
            placeholder="Enter video name"
            className="text-base rounded-lg dark:text-white text-black font-ubuntu font-medium"
          />
          {errors.videoName && <p className="text-red-500 text-sm">{errors.videoName.message}</p>}
        </div>
        <div className="w-full flex flex-col justify-start items-end">
          <Input
            {...register("tutorName")}
            label="Tutor Name"
            variant="underlined"
            placeholder="Enter tutor name"
            className="text-base rounded-lg dark:text-white text-black font-ubuntu font-medium"
          />
          {errors.tutorName && <p className="text-red-500 text-sm">{errors.tutorName.message}</p>}
        </div>
    
        <Input
        {...register("videoUrl")}
        label="Change Url"
        variant="underlined"
        placeholder="Enter video url"
        className="text-base rounded-lg dark:text-white text-black font-ubuntu font-medium"
        />
        {errors.videoUrl && <p className="text-red-500 text-sm">{errors.videoUrl.message}</p>}
      </div>

      <Textarea
        {...register("description")}
        label="Description"
        variant="underlined"
        placeholder="Enter course description"
      />
      {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}


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
        <div className="flex gap-2 flex-col">
            <AddTimeStamps timeStamps={timeStamps} onTimeStamps={handleTimeStamps}/>
            <Button
            type="submit"
            className={`w-full text-xl mt-4 p-8 rounded-lg font-medium transition-colors ${
                isSubmitting
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-800 hover:from-indigo-600 hover:to-purple-600 text-white"
            }`}
            isLoading={isSubmitting}
            >
            {isSubmitting ? "Applying..." : "Preview Changes"}
            </Button>
        </div>
      </div>
    </motion.form>
  );
};

export default EditYoutubeCourseForm;
