import React from "react"
import UserCourseCard from "@/components/UserCourseCard";
import { IUserCourseData } from "@/constants";
import { useAuthContext } from "@/context/authContext";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeProvider";
import AfternoonSunIcon from "@/Icons/AfternoonSunIcon";
import MorningEveningSunIcon from "@/Icons/MorningEveningSunIcon";
import NightMoonIcon from "@/Icons/NightMoonIcon";
import { getVerifiedToken } from "@/lib/cookieService";
import axios from "axios";
import { COURSE_API } from "@/lib/env";
import { ErrorToast } from "@/lib/toasts";
import TextFlipSmoothRevealEffect from "@/Effects/TextFlipSmoothRevealEffect";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import MakeAdminModal from "@/components/modals/MakeAdminModal";

const DashBoard = () => {
  const { userData } = useAuthContext();
  const [timeGreeting, setTimeGreeting] = React.useState("Hello");
  const [userCourses , setUserCourses] = React.useState<IUserCourseData[] | []>([])
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Determine greeting based on the current time
  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12 && hour >= 4) {
      setTimeGreeting("Good Morning");
    } else if (hour < 16 && hour >= 12) {
      setTimeGreeting("Good Afternoon");
    } else if (hour >= 16 && hour < 21) {
      setTimeGreeting("Good Evening");
    } else {
      setTimeGreeting("Night Owl");
    }
    
  }, []);

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


  return (
      <motion.div
        className="w-full flex flex-col gap-2 rounded-lg p-2 "
        variants={{
          hidden: { opacity: 0.3, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 },
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div className="flex items-center gap-3 mb-5 px-2">
        {timeGreeting === "Good Afternoon" ? (
          <AfternoonSunIcon fillColor="rgb(253 224 71)" />
        ) : timeGreeting === "Night Owl" ? (
          <NightMoonIcon fillColor={theme === "dark" ? "white" : "black"} size={40}  />
        ) : (
          <MorningEveningSunIcon fillColor="rgb(253 224 71)" />
        )}
        <h1 className="text-3xl font-semibold font-libre bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ">
          <span className="text-4xl font-medium font-ubuntu">
            {timeGreeting}
          </span>
          ,{" "}
          <TextFlipSmoothRevealEffect text={`${userData.fullName}!`} className="text-3xl font-libre underline" />
        </h1>
      </motion.div>

        <motion.p
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          className="text-base text-gray-700 dark:text-gray-400 font-libre w-3/4 overflow-y-hidden font-extralight line-clamp-4"
        >
          <i>
            {`We're excited to have you here. You’ve made great progress so far, and
        your journey continues with the courses you’ve enrolled in. Keep up the
        fantastic work as you explore and master new skills in your current
        courses. Let's dive into learning and achieve your goals!`}
          </i>
        </motion.p>
             
        {userData.role === "STUDENT" && <MakeAdminModal />}
        {userCourses.length === 0 ? 
        (<div className="w-full flex flex-col justify-center items-center gap-4 p-6 bg-yellow-100 border border-yellow-300 rounded-md shadow-md">
                <p className="text-lg font-ubuntu text-center text-yellow-800">
                Oops! It seems like you haven't Enroll in any course yet. <br />
               
                  <Button variant="bordered" onClick={() => navigate("/courses")} className="w-full flex justify-center items-center mt-4 px-4 py-2 bg-yellow-600 text-white font-ubuntu text-sm rounded-md shadow-md hover:bg-yellow-500 transition-all duration-300 ease-in-out">
                      Enroll Now
                  </Button>

        
                <br />
                
                </p>
            </div>) : (
              <UserCourseCard courses={userCourses} />
            )}

        
      </motion.div>
  );
};

export default DashBoard;
