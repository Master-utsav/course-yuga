import { motion } from "framer-motion";
import { Button, Image } from "@nextui-org/react";
import { useTheme } from "@/context/ThemeProvider";
import { getVerifiedToken } from "@/lib/cookieService";
import axios from "axios";
import { COURSE_API, USER_API } from "@/lib/env";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import React from "react";
import { useAuthContext } from "@/context/authContext";
import { debounce } from "@/lib/debounce";
import CircularProgressBar from "../CircularProgressBar";
import { IUserCourseData } from "@/constants";
import { useNavigate } from "react-router-dom";
import AlertIcon from "@/Icons/AlertIcon";

const cardVariants = {
  hidden: (i: number) => ({
    opacity: 1,
    scale: 1,
    x: i * -420,
    filter: "blur(8px)",
    zIndex: i * -1,
  }),
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    zIndex: i * 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      ease: [0.7, 0, 0.84, 0],
    },
  }),
};

const UserEnrolledCourses: React.FC = () => {
  const { theme } = useTheme();
  const { userData } = useAuthContext();
  const [userCourses , setUserCourses] = React.useState<IUserCourseData[] | []>([])
  const navigate = useNavigate();

  const fetchUserEnrolledCourses = React.useCallback(async() => {
    const jwt = getVerifiedToken();

    try {
      const response = await axios.get(`${COURSE_API}/get-user-enrolled-courses`, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })

      if(response && response.data && response.data.success){
        setUserCourses(response.data.data)
      }
      else{
        ErrorToast(response.data.message);
        setUserCourses([]);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error : any) {
      ErrorToast(error?.response.data.message || "Something went wrong")
      setUserCourses([]);
    }

  }, [])

  React.useEffect(() => {
    fetchUserEnrolledCourses();
  } , [fetchUserEnrolledCourses])

  const debouncedHandleBookmark = debounce(async (courseId: string) => {
    const jwt = getVerifiedToken();
    if (!courseId) return;
    try {
      const response = await axios.post(
        `${USER_API}/unenrolled-in-course`,
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response && response.data && response.data.success) {
        SuccessToast(response.data.message);
        setTimeout(async () => {
          await fetchUserEnrolledCourses();
        }, 100);
      } else {
        ErrorToast(response.data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error?.response.data.message || "Something went wrong");
    }
  }, 500);

  const handleUnenrolledClick = (courseId: string | undefined) => {
    if (!courseId) return;
    debouncedHandleBookmark(courseId);
  };

  return (
    <motion.div
      className="w-full relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-5 "
      initial="hidden"
      animate="visible"
    >
      {userCourses.length === 0 ? 
      <div className="w-full flex flex-col justify-center items-center gap-4 p-6 bg-yellow-100 border border-yellow-300 rounded-md shadow-md">
            <p className="text-lg font-ubuntu text-center text-yellow-800">
            Oops! It seems like you haven't enrolled any course yet.
            <br/>
             Or wait we are fetching Data
            </p>
        </div>
        :
        userCourses.map((course, i) => (
            course && course.courseId  && 
            <motion.div
               key={i}
               className="w-full sm:space-y-2 space-y-1 relative bg-white text-start dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
               custom={i}
               variants={cardVariants}
             >
               <div className="w-full relative bg-transparent">
                 <Image
                   isBlurred
                   src={course.thumbnail}
                   alt="NextUI Album Cover"
                   className="z-0 object-cover aspect-video"
                 />
                 <div className="absolute bottom-1 right-1">
                    <CircularProgressBar progress={(userData.progress?.find((p) => p.courseId === course.courseId)?.count) || 0} />
                  </div>
               </div>
     
               <div className="sm:p-3 p-1 space-y-1 overflow-hidden">
                 <h2 className="text-xl font-bold line-clamp-1 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                   {course.courseName}
                 </h2>
     
                 <h4 className="text-base text-gray-600 dark:text-white font-ubuntu">
                   {course.tutorName}
                 </h4>
     
                 <i className="text-gray-600 dark:text-gray-400 text-sm font-extralight font-libre line-clamp-3 mb-3">
                   {course.description}
                 </i>
               </div>
              
                 <Button className="w-full font-medium sm:text-lg text-base font-ubuntu bg-blue-500 text-white hover:bg-blue-600" onClick={() => navigate(`/user/view-course?c=${course.courseId}`)}>
                   View Course
                 </Button>
              
               <div className="flex w-full sm:flex-row flex-col ">
                {userData.id === course.uploadedBy ? 
                <Button
                    isDisabled={true}
                    className="w-full font-medium sm:text-base text-sm font-ubuntu  bg-white-700 hover:bg-white-800 text-black  dark:bg-gray-700 dark:text-white dark:hover:bg-gray-900"
                >
                    <AlertIcon
                        fillColor={
                        theme === "dark" ? "rgb(220 38 38)" : "rgb(127 29 29)"
                        }
                        size={24}
                    />
                    <span className="">Since, creator can't unenrolled</span>
                </Button>
                 :
                <Button
                    className="w-full font-medium sm:text-base text-sm font-ubuntu bg-white-700 hover:bg-white-800 text-black  dark:bg-gray-700 dark:text-white dark:hover:bg-gray-900"
                    onClick={() => handleUnenrolledClick(course.courseId)}
                >
                     <AlertIcon
                        fillColor={
                        theme === "dark" ? "rgb(220 38 38)" : "rgb(127 29 29)"
                        }
                        size={24}
                    />
                    <span className="">Unenroll ??</span>
                </Button>
                 }
                 
               </div>
             </motion.div>
           ))
      }
      
    </motion.div>
  );
};

export default UserEnrolledCourses;
