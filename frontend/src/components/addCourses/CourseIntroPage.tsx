/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@nextui-org/react";
import { courseDataTemplate, ICourseData, IUpdateCourse } from "@/constants";
import rehypeSanitize from "rehype-sanitize";
import DisplayCourseCardIntoPage from "./DisplayCourseCardIntoPage";
import EditPersonalCourseForm from "./EditPersonalCourseForm";
import EditYoutubeCourseForm from "./EditYoutubeCourseForm";
import EditRedirectingCourseForm from "./EditRedirectingCourseForm";
import { COURSE_API } from "@/lib/env";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import { useAuthContext } from "@/context/authContext";
import { getVerifiedToken } from "@/lib/cookieService";

const CourseIntroPage: React.FC = () => {
  const location = useLocation();
  const [courseData, setCourseData] = useState<ICourseData>(courseDataTemplate);
  const [courseId , setCourseId] = useState<string>("")
  const [activeEditor, setActiveEditor] = useState("markdown");
  const [markdown, setMarkdown] = useState<string>("");
  const [preview, setPreview] = useState<string>(courseData?.thumbnail);
  const { userData } = useAuthContext();

  const fetchCourseData = useCallback(async (courseId : string) => {
    if (!courseId) return;
    
    try {
      const response = await axios.post(`${COURSE_API}/get-course`, {
        courseId,
      });

      if (!response.data.success) {
        ErrorToast(response.data.message);
      }
      const fetchedCourseData = response.data.course;
      setCourseData(fetchedCourseData);
      setMarkdown(fetchedCourseData.markdownContent || "");
      setPreview(fetchedCourseData.thumbnail);

    } catch (error: any) {
      ErrorToast(error.response?.data?.message || "Something went wrong");
    }
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
     const courseId = queryParams.get("c");
     if (courseId) {
      setCourseId(courseId);
      fetchCourseData(courseId);
    }
    
  }, [fetchCourseData, location.search]);

  const handleSave = async (courseId: string) => {
    const jwt = getVerifiedToken();
    if (!courseId) return;
    const type = courseData.courseType.toLowerCase();

    if (!["youtube", "redirect", "personal"].includes(type)) {
      return;
    }
    try {
      const updatedCourse: IUpdateCourse = {
        ...courseData,
        markdownContent: markdown,
      };
      console.log("Updated course:", updatedCourse);

      const formData = new FormData();
      formData.append("courseId", courseId);
      formData.append("courseName", updatedCourse.courseName);
      formData.append("tutorName", updatedCourse.tutorName);
      formData.append("description", updatedCourse.description);
      formData.append("markdownContent", markdown);
      formData.append("redirectLink" , updatedCourse.redirectLink?? "");
      formData.append("sellingPrice" , updatedCourse.sellingPrice?.toString() ?? "0");
      formData.append("originalPrice" , updatedCourse.originalPrice?.toString() ?? "1");
      formData.append("currency" , updatedCourse.currency?.toString() ?? "$");


      if (updatedCourse.thumbnail instanceof File) {
        const blob = new Blob([updatedCourse.thumbnail], {
          type: updatedCourse.thumbnail.type,
        });
        if(type === "youtube"){
          formData.append("youtubeCourseImage", blob, updatedCourse.thumbnail.name);
        }
        else if(type === "personal"){
          formData.append("personalCourseImage", blob, updatedCourse.thumbnail.name);
        }
        else{
          formData.append("redirectCourseImage", blob, updatedCourse.thumbnail.name);
        }
      } else {
        if(type === "youtube"){
          formData.append("youtubeCourseImage", updatedCourse.thumbnail);
        }
        else if(type === "personal"){
          formData.append("personalCourseImage", updatedCourse.thumbnail);
        }
        else{
          formData.append("redirectCourseImage", updatedCourse.thumbnail);
        }
      }

      console.log(formData);
      const response = await axios.put(
        `${COURSE_API}/update-course/${type}`,
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
      } else {
        ErrorToast(response.data.message);
      }
      setCourseData(updatedCourse as ICourseData);
      fetchCourseData(courseId);

    } catch (error: any) {
      ErrorToast(error.response?.data?.message || "Something went wrong");
    }
  };

 
  const handleEditCourse = (updatedCourse: any) => {
    setCourseData((c) => ({
      ...c,
      ...updatedCourse,
    }));
  };

  const handlePreviewCardImage = (preview: string) => {
    setPreview(preview);
  };

  if (!courseData) return <p>Loading course data...</p>; 
  
  return (
    <div className="flex flex-col w-full mx-auto pt-40 sm:pt-48 xl:pt-28 lg:px-20 px-4 min-h-screen bg-gray-100 dark:bg-gray-900   overflow-auto hide-scrollbar">
      <div className="flex w-full mx-auto  overflow-auto hide-scrollbar  relative overflow-x-hidden md:flex-row flex-col">
        {/* Left Section: Editable Content */}
        <div className="flex-1 p-8 space-y-2 overflow-auto font-ubuntu w-full relative">
          <h1 className="w-full text-4xl font-extrabold  bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            {courseData.courseName || "Course Name"}
          </h1>

          <h2 className="text-2xl text-gray-600 dark:text-white font-medium">
            {courseData.tutorName || "Tutor Name"}
          </h2>
          <p className="text-lg text-gray-800 dark:text-gray-300 w-full">
            {courseData.description || "Description"}
          </p>

          {markdown && (
            <div className="w-full text-black dark:text-white mt-6 bg-transparent ">
              <MDEditor.Markdown
                source={markdown}
                className="prose dark:prose-invert bg-transparent font-ubuntu text-black dark:text-white"
              />
            </div>
          )}
          
        </div>

        {/* Right Section: Course Card */}
        <DisplayCourseCardIntoPage
          courseData={courseData}
          previewImage={preview}
        />
      </div>
      {courseData.uploadedBy === userData.id && (
        <>
          {courseData.courseType === "YOUTUBE" && (
            <EditYoutubeCourseForm
              course={courseData}
              onEditCourse={handleEditCourse}
              setCourseCardImagePreview={handlePreviewCardImage}
            />
          )}
          {courseData.courseType === "REDIRECT" && (
            <EditRedirectingCourseForm
              course={{
                ...courseData,
                redirectLink: courseData.redirectLink || "",
              }}
              onEditCourse={handleEditCourse}
              setCourseCardImagePreview={handlePreviewCardImage}
            />
          )}
          {courseData.courseType === "PERSONAL" && (
            <EditPersonalCourseForm
              course={courseData}
              onEditCourse={handleEditCourse}
              setCourseCardImagePreview={handlePreviewCardImage}
            />
          )}

          {/* Markdown Editor */}
          <div className="bg-transparent mt-6 w-full ">
          <div className="flex space-x-4 mb-4">
              <div
                onClick={() => setActiveEditor("markdown")}
                className={`flex-1 cursor-pointer p-4 rounded-lg transition-all duration-300 ease-in-out space-y-1 ${
                  activeEditor === "markdown"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-300 dark:bg-gray-700 dark:text-white"
                }`}
              >
                <h3 className="font-ubuntu text-xl font-semibold">Markdown Editor</h3>
                <p className="font-ubuntu text-base text-gray-600 dark:text-gray-100">
                  Write using Markdown syntax. Perfect for formatting text with headers, lists, links, and images easily. 
                  <br /> 
                  <i className="font-libre">*Ideal for documentation, notes, and quick text editing!*</i>
                </p>
              </div>
              <div
                onClick={() => setActiveEditor("quill")}
                className={`flex-1 cursor-pointer p-4 rounded-lg transition-all duration-300 ease-in-out space-y-1 ${
                  activeEditor === "quill"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-300 dark:bg-gray-700 dark:text-white"
                }`}
              >
                <h3 className="font-ubuntu text-xl font-semibold">Quill Editor</h3>
                <p className="font-ubuntu text-base text-gray-600 dark:text-gray-100">
                  Rich text editor with various formatting options. Easily create styled content with bold, italics, lists, and more. 
                  <br /> 
                  <i className="font-libre">*Great for blogs, articles, and any content requiring complex formatting!*</i>
                </p>
              </div>
            </div>

            {activeEditor === "markdown" ? (
              <MDEditor
                value={markdown}
                height={500}
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]],
                }}
                className="bg-transparent text-black dark:text-white"
                onChange={(value) => setMarkdown(value || "")}
              />
            ) : (
              <div className="w-full border-[1px] border-slate-800 dark:border-white-500 rounded-xl min-h-40 justify-center items-center flex ">
                <h1 className="text-xl font-ubuntu">
                  Quill is under maintainance
                </h1>
              </div>
            )}
          </div>
          <Button
            onClick={() => handleSave(courseId)}
            className="my-4 w-full font-medium text-lg bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Upload Changes
          </Button>
        </>
      )}
    </div>
  );
};
export default CourseIntroPage;
