import { createContext, useState, useContext, ReactNode} from "react"; // Import the utility function
import React from "react";
import {ICourseData } from "@/constants";
import axios from "axios";
import { COURSE_API } from "@/lib/env";
import { ErrorToast } from "@/lib/toasts";

interface CourseContextType {
  coursesData: ICourseData[] | undefined;
  setCoursesData: React.Dispatch<React.SetStateAction<ICourseData[] | undefined>>;
  updatedCourseData: ICourseData[] | undefined;
  setupdatedCourseData: React.Dispatch<React.SetStateAction<ICourseData[] | undefined>>;
}

export const CourseContext = createContext<CourseContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an CourseContextProvider");
  }
  return context;
};



export const CourseContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coursesData, setCoursesData] = useState<ICourseData[]>();
  const [updatedCourseData , setupdatedCourseData] = useState<ICourseData[]>();

  const fetchCourseData = React.useCallback(async() =>{
    try {
      const response = await axios.get(`${COURSE_API}/get-all-courses`);
  
      if(response && response.data && response.data.success){
        setCoursesData(response.data.data);
      }
      else{
        ErrorToast(response.data.message || "Error in Fetching Courses")
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      ErrorToast(error?.response.data.message)
    }
  } , [])
  
  React.useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData])

 return (
    <CourseContext.Provider
      value={{
        coursesData,
        setCoursesData,
        updatedCourseData , 
        setupdatedCourseData
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
