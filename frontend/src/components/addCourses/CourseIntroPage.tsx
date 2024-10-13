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
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get("courseId");
  const [courseData, setCourseData] = useState<ICourseData>(courseDataTemplate);
  const [markdown, setMarkdown] = useState<string>("");
  const [preview, setPreview] = useState<string>(courseData?.thumbnail);
  const { userData } = useAuthContext();


  const fetchCourseData = useCallback(async () => {
    if (!courseId) return;

    try {
      const response = await axios.post(`${COURSE_API}/get-course`, {
        courseId,
      });
      console.log("Fetched course data:", response.data);

      if (!response.data.success) {
        ErrorToast(response.data.message);
      }
      const fetchedCourseData = response.data.course;
      setCourseData(fetchedCourseData);
      setMarkdown(fetchedCourseData.markdownContent || "");
      setPreview(fetchedCourseData.thumbnail);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error.response?.data?.message || "Something went wrong");
    }
  }, [courseId]);

  useEffect(() => {
      fetchCourseData();
  }, [fetchCourseData]);

  const handleSave = async () => {
    const jwt = getVerifiedToken();
    if (!courseId) return;
    const type = courseData.courseType.toLowerCase();
    
    if (!["youtube", "redirect", "personal"].includes(type)) {
      return;
    }
    try {
      const updatedCourse: IUpdateCourse = { ...courseData, markdownContent: markdown };
      console.log("Updated course:", updatedCourse);

      const formData = new FormData();
      formData.append("courseId" , courseId);
      formData.append("courseName", updatedCourse.courseName);
      formData.append("tutorName", updatedCourse.tutorName);
      formData.append("description", updatedCourse.description);
      formData.append("markdownContent" , markdown)

      if (updatedCourse.thumbnail instanceof File) {
          const blob = new Blob([updatedCourse.thumbnail], { type: updatedCourse.thumbnail.type });
          formData.append("youtubeCourseImage", blob, updatedCourse.thumbnail.name);
      } else {
        formData.append("youtubeCourseImage", updatedCourse.thumbnail);
      }
      
      console.log(formData);
      const response = await axios.put(`${COURSE_API}/update-course/${type}`, formData , {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "multipart/form-data",
        }
      });

      
      if(response && response.data && response.data.success){
        SuccessToast(response.data.message);
      }
      else{
        ErrorToast(response.data.message);
      }
      setCourseData(updatedCourse as ICourseData);
      fetchCourseData();
    
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    ErrorToast(error.response?.data?.message || "Something went wrong");
  }
};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditCourse = (updatedCourse: any) => {
    console.log("Updated Course:", updatedCourse);
    setCourseData((c) => ({
      ...c,
      ...updatedCourse,
    }));
  };

  const handlePreviewCardImage = (preview: string) => {
    setPreview(preview);
  };

  if (!courseData) return <p>Loading course data...</p>; // Handle loading state

  return (
    <div className="flex flex-col w-full mx-auto pt-40  px-20 min-h-screen bg-gray-100 dark:bg-gray-900   overflow-auto hide-scrollbar">
    <div className="flex w-full mx-auto   overflow-auto hide-scrollbar">
      {/* Left Section: Editable Content */}
      <div className="flex-1 p-8 space-y-2 overflow-auto font-ubuntu">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          {courseData.courseName || "Course Name"}
        </h1>

        <h2 className="text-2xl text-gray-600 dark:text-white font-medium">
          {courseData.tutorName || "Tutor Name"}
        </h2>
        <p className="text-lg text-gray-800 dark:text-gray-300">
          {courseData.description || "Description"}
        </p>

        {markdown && (
          <div className="w-full text-black dark:text-white mt-6 bg-transparent ">
            <MDEditor.Markdown
              source={markdown}
              className="prose dark:prose-invert bg-transparent text-black dark:text-white font-ubuntu"
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
        <div className="bg-transparent mt-6">
          <MDEditor
            value={markdown}
            height={500}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
            className="bg-transparent text-black dark:text-white"
            onChange={(value) => setMarkdown(value || "")}
          />
        </div>
        <Button
          onClick={handleSave}
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
