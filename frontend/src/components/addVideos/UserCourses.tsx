import React from "react";
import VideoCourseCard from "./VideoCourseCard";
import Seperator from "../Seperator";
import { useVideoContext } from '@/context/videoContext'

const UserCourses: React.FC = () => {
  
const {userUploadedCourse} = useVideoContext();

  return (
         userUploadedCourse.map((courseData , i) => {
            return (
                <div className="w-full" key={i}>
                <Seperator text={courseData.courseName}/>
                <VideoCourseCard
                    key={i}
                    courseData={courseData}
                />
                </div>
            );
         })
  );
};

export default UserCourses;
