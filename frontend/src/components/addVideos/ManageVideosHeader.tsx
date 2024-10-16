import { useTheme } from '@/context/ThemeProvider';
import AddIcon from '@/Icons/AddIcon';
import BulbIcon from '@/Icons/BulbIcon';
import { Button } from '@nextui-org/react';
import { motion } from 'framer-motion'
import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const containerVariants = {
    hidden: { opacity: 1, x: -1500, filter: "blur(50px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
  };

interface ManageVideosHeaderProps {
onCategory: (category: string) => void;
}

const ManageVideosHeader: React.FC<ManageVideosHeaderProps> = ({onCategory}) => {
    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
    const {theme} = useTheme();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const courseId = queryParams.get("courseId");
    const courseName = queryParams.get("name");

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
      <motion.div className="flex items-center gap-3 mb-5 px-2">
        <h1 className="text-3xl font-semibold font-libre bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ">
          <span className="text-3xl font-medium font-ubuntu">
            You are managing
          </span>
          ,{" "}
          <Link to={`/course-intro-page?courseId=${courseId}`} className="font-ubuntu underline decoration-purple-500">
            {courseName}!
          </Link>
        </h1>
      </motion.div>

      <motion.div
        className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-5 shadow-inner"
        variants={containerVariants}
      >
      <div className="flex items-start gap-3 font-ubuntu">
            <BulbIcon fillColor="rgb(234 179 8)" size={32} />
            <p className="text-gray-700 dark:text-gray-300">
                If you want to upload a <b>YouTube Course Video</b>, it will be <b>free of cost</b>. 
                Each video will first be <b>verified</b> by the website owner before being added 
                to the course. You will receive an <b>email notification</b> whether the video 
                is approved or rejected.
                <br />
                If you want to upload your own <b>Personal Course Video</b>, you must first <b>top up 
                your wallet</b>. A <b>nominal fee</b> will be charged for each video based on its size.
                <br />
                <b>Pricing:</b> The fee is calculated as <b>X currency / 100MB</b> (via Cloudinary).
            </p>
        </div>
      </motion.div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-5">
        {["Personal Video", "YouTube Video"].map(
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

    </motion.section>
  )
}

export default ManageVideosHeader
