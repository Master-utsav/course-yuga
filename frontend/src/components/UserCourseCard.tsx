import { motion } from "framer-motion";
import CircularProgressBar from "./CircularProgressBar";
import { Button , Image} from "@nextui-org/react"; // Assuming you're using NextUI's Button component
import { IUserCourseData } from "@/constants";
import { Link } from "react-router-dom";
import BookmarkIcon2 from "@/Icons/BookmarkIcon2";
import { useTheme } from "@/context/ThemeProvider";
import { getVerifiedToken } from "@/lib/cookieService";
import axios from "axios";
import { USER_API } from "@/lib/env";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import React from "react";
import { useAuthContext } from "@/context/authContext";
import { getUserData } from "@/lib/authService";
import { debounce } from "@/lib/debounce";
import RedirectLinkIcon from "@/Icons/RedirectLinkIcon";
import YoutubeIcon from "@/Icons/YoutubeIcon";
// import { courses } from "@/constants";

const cardVariants = {
  hidden: (i : number) => ({ opacity: 1, scale: 1, x: i * -420 , filter: "blur(8px)", zIndex: i * -1}),
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    zIndex: i * 1,
    x: 0,
    transition: {
      delay: i * 0.3, 
      ease: [0.7, 0, 0.84, 0]
    },
  }),
};

interface CoursesInterface{
  courses: IUserCourseData[] | [];
}

const UserCourseCard: React.FC<CoursesInterface> = ({ courses }) => {
  const {theme} = useTheme();
  const {userData , setUserData} = useAuthContext();

  const debouncedHandleBookmark = debounce(async(courseId : string) =>{
    const jwt = getVerifiedToken();
    if(!courseId) return;
    try {
      const response = await axios.post(`${USER_API}/user-course-bookmarks` , {courseId} , {
        headers: {
          Authorization : `Bearer ${jwt}`,
          "Content-Type" : "application/json"
        }
      })
   
      if(response && response.data && response.data.success){
        SuccessToast(response.data.message)
        setTimeout(async() => {
          const userData = await getUserData();
          if (userData) setUserData(userData);
        } , 100) 
      }
      else{
        ErrorToast(response.data.message);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error : any) {
      ErrorToast(error?.response.data.message || "Something went wrong")
    }
  } , 500)

  const handleBookmarkClick = (courseId: string | undefined) => {
    if (!courseId) return;
    debouncedHandleBookmark(courseId);
  };
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-5 "
      initial="hidden"
      animate="visible"
    >
      {courses.map((course, i) => (
        <motion.div
        key={course._id}
        className="w-full space-y-2 relative bg-white text-start dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
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
              <CircularProgressBar progress={(userData.progress?.find((p) => p.courseId === course._id)?.count) || 0} />
            </div>
          </div>

          <div className="p-3 space-y-1">
            <h2 className="text-xl line-clamp-1 font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              {course.courseName}
            </h2>
            
            <h4 className="text-base text-gray-600 dark:text-white font-ubuntu">
              {course.tutorName}
            </h4>

            <i className="text-gray-600 dark:text-gray-400 text-sm font-extralight font-libre line-clamp-3 mb-3">
              {course.description}
            </i>
          </div>
          {course && course.courseType === "REDIRECT" ? 
            <Link to={`/course-intro-page?courseId=${course._id}`}>
              <Button className="w-full font-medium text-lg font-ubuntu bg-blue-500 text-white hover:bg-blue-600">
                <RedirectLinkIcon fillColor="white" size={24}/> View Course
              </Button>
            </Link>
          : 
            <Link to={`/user/view-course?courseId=${course._id}`}>
              <Button className="w-full font-medium text-lg font-ubuntu bg-blue-500 text-white hover:bg-blue-600">
               <YoutubeIcon fillColor="white" size={24} /> View Course
              </Button>
            </Link>
          }
            <Button className="w-full font-medium text-lg font-ubuntu bg-white-600 hover:bg-white-800 text-black dark:bg-gray-700 dark:text-white dark:hover:bg-gray-900" onClick={() => handleBookmarkClick(course._id)}>
              {course && course._id ? 
              userData.bookmarks?.course.includes(course._id) ? 
              (<>
               <BookmarkIcon2 fillColor={theme === "dark" ? "white" : "black"} size={24}/> 
               <span>Bookmarked</span>
              </>) : (
                <>
                  <BookmarkIcon2 fillColor="none" size={24} strokeColor={theme === "dark" ? "white" : "black"}/> 
                  <span>Bookmark</span>
                 </>
                )
                :
                <>
                </>
              }
            </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default UserCourseCard;
