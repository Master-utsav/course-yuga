import { createContext, useState, useContext, ReactNode} from "react"; // Import the utility function
import React from "react";
import { CourseProps, courses } from "@/constants";

interface CourseContextType {
  coursesData: CourseProps[];
  setCoursesData: React.Dispatch<React.SetStateAction<CourseProps[]>>;
  updatedCourseData: CourseProps[];
  setupdatedCourseData: React.Dispatch<React.SetStateAction<CourseProps[]>>;
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
  const [coursesData, setCoursesData] = useState<CourseProps[]>(courses);
  const [updatedCourseData , setupdatedCourseData] = useState<CourseProps[]>(courses);
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
