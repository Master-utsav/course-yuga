import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Textarea,
  Image,
} from "@nextui-org/react";
import { motion } from "framer-motion";

// Zod Schema (same as your original one)
const PersonalCourseFormSchema = z
  .object({
    courseName: z.string().min(3, "Course name must be at least 3 characters"),
    tutorName: z.string().min(2, "Tutor name must be at least 2 characters"),
    description: z
      .string()
      .min(150, "Description must be at least 150 characters"),
    thumbnail: z.union([
      z.string().url().refine((url) => url !== "", { message: "Please enter a valid URL." }),
      z.instanceof(File),
    ]),
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

export type PersonalCourseFormData = z.infer<typeof PersonalCourseFormSchema>;

interface EditYoutubeCourseFormProps {
  course: PersonalCourseFormData; // The initial course data to edit
  onEditCourse: (updatedCourse: PersonalCourseFormData) => void; // Callback to pass updated data to parent
  setCourseCardImagePreview: (url: string) => void;
}

const EditYoutubeCourseForm: React.FC<EditYoutubeCourseFormProps> = ({
  course,
  onEditCourse,
  setCourseCardImagePreview
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PersonalCourseFormData>({
    resolver: zodResolver(PersonalCourseFormSchema),
    defaultValues: course,
  });

  const [preview, setPreview] = useState<string>(course.thumbnail as string);
  const [isFileUpload, setIsFileUpload] = useState(typeof course.thumbnail === "object");

  const onSubmit: SubmitHandler<PersonalCourseFormData> = async (data) => {
    onEditCourse(data);
    setCourseCardImagePreview(preview);
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
        Edit Youtube Course
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="w-full flex flex-col justify-start items-end">
          <Input
            {...register("courseName")}
            label="Course Name"
            variant="underlined"
            placeholder="Enter course name"
            className="text-base rounded-lg dark:text-white text-black font-ubuntu font-medium"
          />
          {errors.courseName && <p className="text-red-500 text-sm">{errors.courseName.message}</p>}
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
        <Button
          type="submit"
          className={` w-full text-xl mt-4 p-8 rounded-lg font-medium transition-colors ${
            isSubmitting
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-800 hover:from-indigo-600 hover:to-purple-600 text-white"
          }`}
          isLoading={isSubmitting}
        >
          {isSubmitting ? "Applying..." : "Preview Changes"}
        </Button>
      </div>
    </motion.form>
  );
};

export default EditYoutubeCourseForm;
