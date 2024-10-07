import React from "react";
import { heroContent } from "@/constants";
import { motion } from "framer-motion";

const DescriptionWithLoop: React.FC = () => {
  const [currentDescriptionIndex, setCurrentDescriptionIndex] = React.useState(0);

  // Change description every 3 seconds
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDescriptionIndex((prevIndex) =>
        (prevIndex + 1) % heroContent.description.length
      );
    }, 6000); // 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <motion.div
      key={currentDescriptionIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      transition={{ duration: 1, ease: "easeInOut" }} 
      className="text-black/80 dark:text-white/80 font-sans text-base w-fit"
      style={{ whiteSpace: "pre-wrap" }} 
    >
      {heroContent.description[currentDescriptionIndex]}
    </motion.div>
  );
};

export default DescriptionWithLoop;
