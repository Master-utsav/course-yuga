import React from "react";
import { Link } from "react-router-dom";

interface DashBoardIconProps {
  fillColor?: string;
  size?: number;
}

interface DashboardNavItemProps {
  theme: string;
  Icon: React.ComponentType<DashBoardIconProps>;
  title: string;
  link: string;
}

const DashboardNavItem: React.FC<DashboardNavItemProps> = ({
  theme,
  Icon,
  title,
  link,
}) => {
  return (
    <span className="relative overflow-hidden w-fit group ">
      <Link to={link} className="flex items-center space-x-2 relative overflow-hidden w-fit">
        <span className="group-hover:scale-110 transition-all ease-in-out duration-300">
          {theme === "dark" ? (
            <Icon fillColor="white" size={20} />
          ) : (
            <Icon fillColor="black" size={20} />
          )}
        </span>
        <span className="text-base font-medium font-ubuntu text-center dashboard_li_item dark:text-white text-black group-hover:text-black/80 group-hover:dark:text-white/80 py-1">
          {title}
        </span>
      </Link>
    </span>
  );
};

export default DashboardNavItem;
