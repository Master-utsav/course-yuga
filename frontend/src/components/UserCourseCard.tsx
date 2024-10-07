import { motion } from "framer-motion";
import CircularProgressBar from "./CircularProgressBar";
import { Button , Image} from "@nextui-org/react"; // Assuming you're using NextUI's Button component

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.2, // Delay for staggered animation
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  }),
};

interface CoursesInterface{
  courses: {
    id: number;
    courseName: string;
    tutorName: string;
    image: string;
    progress: number;
    description: string;
  }[]
}

const UserCourseCard: React.FC<CoursesInterface> = ({ courses }) => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-5"
      initial="hidden"
      animate="visible"
    >
      {courses.map((course, i) => (
        <motion.div
          key={course.id}
          className="w-full relative bg-white text-start dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
          custom={i}
          variants={cardVariants}
        >
          <div className="w-full relative bg-transparent">
            <Image
              isBlurred
              src={course.image}
              alt="NextUI Album Cover"
              className="z-0 object-cover aspect-video"
            />
            <div className="absolute bottom-1 right-1">
              <CircularProgressBar progress={course.progress} />
            </div>
          </div>

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

            <Button className="w-full font-medium text-lg font-ubuntu bg-blue-500 text-white hover:bg-blue-600">
              View Course
            </Button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default UserCourseCard;
