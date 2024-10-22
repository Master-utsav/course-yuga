import CourseCard from "@/components/courses/CourseCard";
import React from "react";
import CoursesNavbar from "@/components/courses/CoursesNav";
import Seperator from "@/components/Seperator";
import { CourseContextProvider } from "@/context/courseContext";
// import VideoCard from "@/components/courses/VideoCard";

const Courses: React.FC = () => {
  return (
    <CourseContextProvider>
      <section className="max-w-7xl mx-auto flex-col flex xl:pt-24 md:pt-56 px-5">
        <CoursesNavbar />
        <Seperator text="COURSES" />
        <CourseCard />
        {/* <VideoCard /> */}
        
      </section>
     
    </CourseContextProvider>
  );
};

export default Courses;
