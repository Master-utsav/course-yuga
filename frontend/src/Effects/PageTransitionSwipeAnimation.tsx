import { useDashboardContext } from "@/context/dashboardContext";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const DashBoardPageVariants = {
  hidden: { opacity: 0.2, x: "-100vw", filter: "blur(15px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0.2, x: "100vw", filter: "blur(15px)" },
};

const PageTransitionSwipeAnimation = ({ children }: PageTransitionProps) => {
  const { isSideBarOpen } = useDashboardContext();

  return (
    <motion.section
      className={`grid min-h-screen transition-all duration-300 
        ${isSideBarOpen ? "max-w-[calc(100%-250px)]" : "max-w-[calc(100%-60px)]"}
        sm:max-w-full bg-white dark:bg-gray-900`}
      variants={DashBoardPageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ type: "spring", stiffness: 500, damping: 50, duration: 0.4 }}
    >
      {children}
    </motion.section>
  );
};

export default PageTransitionSwipeAnimation;
