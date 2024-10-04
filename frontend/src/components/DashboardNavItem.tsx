import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

interface DashBoardIconProps {
  fillColor?: string;
  size?: number;
}

interface DashboardNavItemProps {
  index: number;
  theme: string;
  Icon: React.ComponentType<DashBoardIconProps>;
  title: string;
  link: string;
}

const DashboardNavItem: React.FC<DashboardNavItemProps> = ({
  index,
  theme,
  Icon,
  title,
  link,
}) => {
  return (
    <motion.div
      key={index}
      initial={{ y: 0 , opacity: 0}}
      animate={{ y: [50, 0] , opacity: 1}} // Small bouncing effect
      transition={{
        duration: 0.5,
        delay: index * 0.1, // Stagger effect for smooth transitions
      }}
      className="relative overflow-hidden w-full group dashboard_li_item"
    >
      <Link
        to={link}
        className="flex items-center space-x-2 relative overflow-hidden w-full"
      >
        <span className="group-hover:scale-125 transition-all ease-in-out duration-300">
          {theme === "dark" ? (
            <Icon fillColor="white" size={20} />
          ) : (
            <Icon fillColor="black" size={20} />
          )}
        </span>
        <span className="text-base font-medium font-ubuntu text-center  dark:text-white text-black group-hover:text-black/80 group-hover:dark:text-white/80 py-1">
          {title}
        </span>
      </Link>
    </motion.div>
  );
};

export default DashboardNavItem;
