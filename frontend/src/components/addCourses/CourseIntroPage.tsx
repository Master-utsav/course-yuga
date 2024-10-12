import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@nextui-org/react";
import { CourseData, courses } from "@/constants";
import rehypeSanitize from "rehype-sanitize";
import DisplayCourseCardIntoPage from "./DisplayCourseCardIntoPage";
import EditPersonalCourseForm from "./EditPersonalCourseForm";

const CourseIntroPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
//   const navigate = useNavigate();
  const [courseData, setCourseData] = useState<CourseData>(courses[0]);
  const [markdown, setMarkdown] = useState<string>("");
  const [preview , setPreview] = useState<string>(courseData?.thumbnail)

  // Fetch course data based on courseId
  const fetchCourseData = useCallback(async () => {
    try {
      const response = await axios.post(`/api/courses/getCourse`, { courseId });
      console.log("Fetched course data:", response.data);
      setCourseData(response.data);
      setMarkdown(response.data.markdownContent || "");
    } catch (error) {
      console.error("Failed to fetch course data:", error);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) fetchCourseData();
  }, [courseId, fetchCourseData]);

  const handleSave = async () => {
    try {
      const updatedCourse = { ...courseData, markdownContent: markdown };
      console.log("Updated course:", updatedCourse);

      await axios.post(`/api/courses/updateCourse`, {
        courseId,
        data: updatedCourse,
      });

      alert("Course updated successfully!");
      setCourseData(updatedCourse as CourseData); 
      fetchCourseData(); 
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditCourse = (updatedCourse : any) => {
    console.log("Updated Course:", updatedCourse);
    setCourseData((c) => ({
      ...c, 
      ...updatedCourse
    }));
  };

  const handlePreviewCardImage = (preview: string) => {
    setPreview(preview)
  }
  

  if (!courseData) return <p>Loading course data...</p>; // Handle loading state

  return (
    <div className="flex w-full  bg-gray-100 dark:bg-gray-900 overflow-auto hide-scrollbar">
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
        {/* edit the fileds component */}   
        <EditPersonalCourseForm course={courseData} onEditCourse={handleEditCourse} setCourseCardImagePreview={handlePreviewCardImage} />
        {/* Markdown Editor */}
        {markdown && (
          <div className="w-full text-black dark:text-white mt-6 bg-transparent ">
            <MDEditor.Markdown
              source={markdown}
              className="prose dark:prose-invert bg-transparent text-black dark:text-white font-ubuntu"
            />
          </div>
        )}
        {/* Markdown Editor */}
        <div className="bg-transparent mt-6">
          <MDEditor
            value={markdown}
            previewOptions={{
                rehypePlugins: [[rehypeSanitize]],
              }}
            className="bg-transparent text-black dark:text-white"
            onChange={(value) => setMarkdown(value || "")}
          />
        </div>
        <Button
          onClick={handleSave}
          className="mt-4 w-full font-medium text-lg bg-blue-500 text-white rounded hover:bg-blue-600"
          >
          Upload Changes
        </Button>
      </div>

      {/* Right Section: Course Card */}
      <DisplayCourseCardIntoPage  courseData={courseData} previewImage={preview} />
    </div>
  );
};

export default CourseIntroPage;
