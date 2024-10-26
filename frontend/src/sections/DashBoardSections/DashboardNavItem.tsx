import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "@nextui-org/react"; // Optional: You can replace it with your custom tooltip if needed

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
  isSideBarOpen: boolean;
  isActive:boolean;
}

const DashboardNavItem: React.FC<DashboardNavItemProps> = ({
  index,
  theme,
  Icon,
  title,
  link,
  isActive,
  isSideBarOpen,
}) => {
  
  return (
    <motion.div
      key={index}
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: [50, 0], opacity: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
      className={`relative overflow-hidden w-full group flex items-center 
        ${isSideBarOpen ? "justify-start" : "justify-center"} 
        space-x-3 py-2 dashboard_li_item `}
    >
    <Link
        to={link}
        className="flex items-center space-x-2 relative overflow-hidden w-full"
        >
        {!isSideBarOpen &&   
        <Tooltip 
          showArrow
          placement="right"
          content={title}
          classNames={{
            base: [
              // arrow color
              "before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500",
            ],
            content: [
              "py-2 px-4 shadow-xl ",
              "text-purple-700 bg-gradient-to-br from-white to-neutral-400 font-ubuntu font-medium ",
            ],
          }}
        >
          <span className={`group-hover:scale-110 transition-all ease-in-out duration-300 cursor-pointer px-4 ${isActive ? "dark:bg-black-500 bg-white-700 rounded-xl py-2" : ""}`}>
            {theme === "dark" ? (
              <Icon fillColor="white" size={24} />
            ) : (
              <Icon fillColor="black" size={24} />
            )}
          </span>
         </Tooltip>
}
        {isSideBarOpen ? (
          <>
          <span className={`group-hover:scale-110 transition-all ease-in-out duration-300 cursor-pointer ${isActive ? "dark:bg-black-500 bg-white-700 rounded-xl p-2" : ""}`}>
            {theme === "dark" ? (
              <Icon fillColor="white" size={24} />
            ) : (
              <Icon fillColor="black" size={24} />
            )}
          </span>
          <span
            className="text-base font-medium font-ubuntu text-center 
              dark:text-white text-black group-hover:text-black/80 
              group-hover:dark:text-white/80"
          >
            {title}
          </span>
          </>
        ) : (
          <></>
        )}
      </Link>
    </motion.div>
  );
};

export default React.memo(DashboardNavItem);