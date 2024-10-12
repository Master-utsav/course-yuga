import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthContext } from "@/context/authContext";
import AddIcon from "@/Icons/AddIcon";
import BulbIcon from "@/Icons/BulbIcon";
import AfternoonSunIcon from "@/Icons/AfternoonSunIcon";
import MorningEveningSunIcon from "@/Icons/MorningEveningSunIcon";
import { Button } from "@nextui-org/react";
import { useTheme } from "@/context/ThemeProvider";
import NightMoonIcon from "@/Icons/NightMoonIcon";

interface HeaderProps {
  onCategory: (category: string) => void;
}
const Header: React.FC<HeaderProps> = ({ onCategory }) => {
  const [timeGreeting, setTimeGreeting] = useState("Hello");
  const { userData } = useAuthContext();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { theme } = useTheme();

  // Determine greeting based on the current time
  useEffect(() => {
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

  // Framer Motion animation variants
  const containerVariants = {
    hidden: { opacity: 1, x: -1500, filter: "blur(50px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
  };

  function handleCategoryClick() {
    if (selectedCategory !== null) {
      onCategory(selectedCategory);
      setSelectedCategory(null);
    } else {
      setSelectedCategory(null);
    }
  }

  return (
    <motion.section
      className="w-full mx-auto p-5 rounded-tr-xl rounded-tl-xl shadow-lg transition-all duration-300 bg-white dark:bg-gray-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.5,
      }}
    >
      {/* Greeting Section */}
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

      {/* Quote Section */}
      <motion.div
        className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-5 shadow-inner"
        variants={containerVariants}
      >
        <div className="flex items-start gap-3 font-ubuntu">
          <BulbIcon fillColor="rgb(234 179 8)" size={32} />
          <p className="text-gray-700 dark:text-gray-300">
            If you want to create a <b>Personal Course</b>, you need to select a
            category and pay a nominal fee for uploading. <br />
            If you're creating a <b>YouTube Course</b>, it will be free of cost.{" "}
            <br />
            If you want to build a <b>Redirecting Course Template</b> that links
            to your course site, you can choose that too.
          </p>
        </div>
      </motion.div>

      {/* Category Selection Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mb-5">
        {["Personal Course", "YouTube Course", "Redirecting Course"].map(
          (category) => (
            <Button
              key={category}
              className={`w-full p-6 text-base rounded-lg dark:text-white text-black font-ubuntu font-medium border-[1px] transition-colors ${
                selectedCategory === category
                  ? "dark:bg-indigo-800 bg-indigo-100 dark:border-indigo-400 border-indigo-500"
                  : "bg-black/10 dark:bg-black/30 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          )
        )}
        <Button
          className={`w-full p-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
            selectedCategory
              ? "bg-gradient-to-r from-blue-600 to-indigo-800 hover:from-indigo-600 hover:to-purple-600 text-white"
              : "bg-gray-300 dark:bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!selectedCategory}
          onClick={handleCategoryClick}
        >
          <AddIcon fillColor={theme === "dark" ? "white" : "black"} />
          Create Course
        </Button>
      </div>

      {/* Create Course Button */}
    </motion.section>
  );
};

export default Header;
