import { createContext, useState, useContext, ReactNode} from "react"; // Import the utility function
import React from "react";
import {ICourseData } from "@/constants";
import axios from "axios";
import { COURSE_API } from "@/lib/env";
import { ErrorToast } from "@/lib/toasts";
import { getVerifiedToken } from "@/lib/cookieService";

interface VideoContextType {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  isAlertActive: boolean;
  setIsAlertActive: React.Dispatch<React.SetStateAction<boolean>>;
  userUploadedCourse: ICourseData[] | [];
  setUserUploadedCourse: React.Dispatch<React.SetStateAction<ICourseData[] | []>>;
}

export const VideoContext = createContext<VideoContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an VideoContextProvider");
  }
  return context;
};

export const VideoContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userUploadedCourse, setUserUploadedCourse] = useState<ICourseData[] | []>([]);
    const [isAlertActive , setIsAlertActive] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);

    const fetchUserUploadedCourse = React.useCallback(async() => {
        const jwt = getVerifiedToken();
    
        try {
            const response = await axios.get(`${COURSE_API}/get-admin-courses` , {
                headers:{
                    Authorization: `Bearer ${jwt}`
                }
            })
            if(response && response.data && response.data.success){
              const data = response.data.data
              if(data){
                const personalAndYoutubeCoursesData = data.filter((c:ICourseData) => c.courseType !== "REDIRECT");
                setUserUploadedCourse(personalAndYoutubeCoursesData);
                setRefresh(false);
              }
            }
            else{
                setIsAlertActive(true);
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error :any) {
            ErrorToast(error?.response.data.message || "Something went wrong in the server" );
        }
      } , [])
    
      React.useEffect(() => {
        fetchUserUploadedCourse();
      } , [fetchUserUploadedCourse , refresh])

 return (
    <VideoContext.Provider
      value={{
        refresh,
        setRefresh,
        isAlertActive,
        setIsAlertActive,
        userUploadedCourse,
        setUserUploadedCourse
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
