import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const DashBoardPageVariants = {
    hidden: { opacity: 0.2, x: '-100vw' , filter: "blur(15px)"},
    visible: { opacity: 1, x: 0 , filter: "blur(0px)" },        
    exit: { opacity: 0.2, x: '100vw' , filter: "blur(15px)" }      
  };

const PageTransitionSwipeAnimation = ({ children }: PageTransitionProps) => {

  return (
    <motion.section
    className="w-[82%] ml-[18%] relative flex items-start justify-start bg-white-800 dark:bg-gray-900 backdrop-blur-lg transition-opacity duration-300 z-40 "
    variants={DashBoardPageVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    transition={{ type: 'spring', stiffness: 500, damping: 50, duration: 0.4 }}
  >
    {children}
  </motion.section>
  );
};

export default PageTransitionSwipeAnimation;

