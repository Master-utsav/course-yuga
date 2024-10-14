import React from "react"
import UserCourseCard from "@/components/UserCourseCard";
import { courses } from "@/constants";
import { useAuthContext } from "@/context/authContext";
// import StaggeredBlurTextEffect from "@/Effects/StaggeredBlurTextEffect";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeProvider";
import AfternoonSunIcon from "@/Icons/AfternoonSunIcon";
import MorningEveningSunIcon from "@/Icons/MorningEveningSunIcon";
import NightMoonIcon from "@/Icons/NightMoonIcon";

const DashBoard = () => {
  console.log("DashBoard rendered");
  const { userData } = useAuthContext();
  const [timeGreeting, setTimeGreeting] = React.useState("Hello");
  const { theme } = useTheme();

  // Determine greeting based on the current time
  React.useEffect(() => {
    const hour = new Date().getHours();
    console.log(hour);
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
        {/* <div className="font-ubuntu flex text-5xl overflow-hidden bg-clip-text  text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          {"Welcome! ".split("").map((char, i) => (
            <motion.p
              initial={{ fontWeight: "100", opacity: 0, x: 0 }}
              animate={{ fontWeight: "500", opacity: 1, x: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.1 * i,
                type: "spring",
                damping: 8,
                stiffness: 200,
              }}
              key={i}
              className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            >
              {char}
            </motion.p>
          ))}
          <motion.i
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.5, ease: "easeIn" }}
            className="px-2 underline decoration-purple-500"
          >
            {"  "}
            <StaggeredBlurTextEffect
              text={userData.firstName}
              className="font-libre text-5xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              delayNumber={0.3}
            />
          </motion.i>
        </div> */}
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
          <i className="font-libre underline decoration-purple-500">
            {userData.fullName}!
          </i>
        </h1>
      </motion.div>

        <motion.p
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          className="text-base text-gray-700 dark:text-gray-400 font-libre w-3/4 overflow-y-hidden font-extralight"
        >
          <i>
            {`We're excited to have you here. You’ve made great progress so far, and
        your journey continues with the courses you’ve enrolled in. Keep up the
        fantastic work as you explore and master new skills in your current
        courses. Let's dive into learning and achieve your goals!`}
          </i>
        </motion.p>

        <UserCourseCard courses={courses} />
      </motion.div>
  );
};

export default DashBoard;
