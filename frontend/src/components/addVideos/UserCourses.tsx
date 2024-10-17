import React from "react";
import VideoCourseCard from "./VideoCourseCard";
import { useVideoContext } from '@/context/videoContext'

const UserCourses: React.FC = () => {
  
const {userUploadedCourse} = useVideoContext();

  return (
    <div className="w-full relative ">
      {
        userUploadedCourse.map((courseData , i) => {
           return (
               <VideoCourseCard
                   key={i}
                   courseData={courseData}
               />
           );
        })
      }
    </div>
  );
};

export default UserCourses;
