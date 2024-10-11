import FavoriteIcon from "@/Icons/FavoriteIcon";
import { Button, Chip, Image } from "@nextui-org/react";
import { motion } from "framer-motion";
import React from "react";
import RatingComponent from "../RatingComponent";
import PercentageOffIcon from "@/Icons/PercentageOffIcon";
import { useCourseContext } from "@/context/courseContext";

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
      delay: i * 0.3,
      ease: [0.7, 0, 0.84, 0],
    },
  }),
};

const CourseCard: React.FC = () => {
  const [checkedItems, setCheckedItems] = React.useState<{
    [key: number]: boolean;
  }>({});
  
  const {updatedCourseData} = useCourseContext();
  const handleCheckboxChange = (courseId: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [courseId]: !prev[courseId], // Toggle the checked state for the clicked card
    }));
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-5"
      initial="hidden"
      animate="visible"
    >
      {updatedCourseData.map((course, i) => (
        <motion.div
          key={course.id}
          className="w-full relative bg-white text-start dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
          custom={i}
          variants={cardVariants}
        >
          <div className="relative w-full">
            <Image
              isBlurred
              src={course.image}
              alt="course-img"
              className="z-0 object-cover aspect-video rounded-tr-[6rem] p-2"
            />
            <div className="absolute right-2 bottom-[-1rem] dark:bg-gray-600/50 backdrop-blur-lg bg-white/50 p-2 rounded-xl rounded-br-[2rem] rounded-bl-[2rem] shadow-[rgba(100,_100,_111,_0.2)_0px_0px_15px_0px] text-xl font-libre font-semibold flex gap-1">
              <span className="text-xl font-libre font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                {course.currency}
              </span>
              <span className="dark:text-violet-100  text-gray-950">
                {course.sellingPrice}
              </span>
            </div>
          </div>
          <label
            htmlFor={`favourite-${course.id}`}
            className="absolute cursor-pointer top-2 right-2"
          >
            <input
              type="checkbox"
              name={`favourite-${course.id}`}
              id={`favourite-${course.id}`}
              className="absolute inset-0 hidden"
              onChange={() => handleCheckboxChange(course.id)}
              checked={checkedItems[course.id] || false} // Maintain checked state
            />
            <FavoriteIcon
              fillColor={checkedItems[course.id] ? "rgb(239 68 68)" : "none"}
            />
          </label>

          <div className="p-3 space-y-2">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              {course.courseName}
            </h2>

            <h4 className="text-lg text-gray-600 dark:text-white font-ubuntu">
              {course.tutorName}
            </h4>

            <i className="text-gray-600 dark:text-gray-400 text-sm font-extralight font-libre line-clamp-3">
              {course.description}
            </i>
            <div className="flex justify-between items-center">
              <div className="flex justify-start items-center gap-2">
                <RatingComponent rating={course.rating} />
                <span className="font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  {`( `}
                  <i className="dark:text-white font-libre text-sm text-center font-medium text-black">
                    {course.ratingCount}
                  </i>
                  {` )`}
                </span>
              </div>
              <Chip
                startContent={<PercentageOffIcon fillColor="green" size={24} />}
                variant="faded"
                color="success"
                className="font-libre text-sm"
              >
              {((course.originalPrice - course.sellingPrice) / course.originalPrice * 100).toFixed(2)}{"% "}<span className="font-ubuntu">Off</span>

              </Chip>
            </div>

            <Button className="w-full font-medium text-lg font-ubuntu bg-blue-500 text-white hover:bg-blue-600">
              Enroll Now
            </Button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CourseCard;
