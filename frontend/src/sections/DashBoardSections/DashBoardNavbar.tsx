import DashboardNavItem from "@/sections/DashBoardSections/DashboardNavItem";
import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/ThemeBtn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DashBoardNavItems,
  DashBoardNavItems2,
  DashBoardNavItems3,
} from "@/constants";
import { useAuthContext } from "@/context/authContext";
import { useTheme } from "@/context/ThemeProvider";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Seperator from "@/components/Seperator";
import { useDashboardContext } from "@/context/dashboardContext";
import SidebarOpenIcon from "@/Icons/SidebarOpenIcon";
import SidebarCloseIcon from "@/Icons/SidebarCloseIcon";

const DashBoardNavbar: React.FC = () => {
  const { isSideBarOpen, setIsSideBarOpen } = useDashboardContext();
  const { theme } = useTheme();
  const { userData } = useAuthContext();

  return (
    <aside
      className={`bg-gray-100 dark:bg-gray-950 dark:text-white text-black 
      transition-all duration-300 ${
        isSideBarOpen ? "w-64" : "w-16"
      } h-screen`}
    >
      <div
        className={`flex flex-col h-full space-y-4 ${
          isSideBarOpen ? "py-2 px-5 justify-between" : "py-4 justify-start items-center"
        }`}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center py-2 w-full">
          {isSideBarOpen && (
            <Logo theme={theme} className="object-cover w-32" />
          )}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
            className={`animate-pulse flex justify-center items-center ${isSideBarOpen ? "w-[25%]" : "w-full"} `}
          >
            {isSideBarOpen ? 
              <SidebarCloseIcon fillColor={theme === "dark" ? "white" : "dark"} size={32} />
             :
              <SidebarOpenIcon fillColor={theme === "dark" ? "white" : "dark"} size={32} />
            }
          </motion.button>
        </div>

        {/* Primary Navigation Items */}
        <nav className="space-y-0">
          <div className="border-t-2 dark:border-white border-black rounded-l-2xl rounded-r-2xl py-2"></div>
          {DashBoardNavItems.map((item, index) => (
            <DashboardNavItem
              key={index}
              index={index}
              theme={theme}
              Icon={item.Icon}
              title={item.title}
              link={item.link}
              isSideBarOpen={isSideBarOpen}
            />
          ))}
        </nav>

        {/* Admin Section */}
        {userData.role === "ADMIN" && (
          <>
            <Seperator
              text="Admin section"
              className={`my-2 ${isSideBarOpen ? "" : "hidden"}`}
            />
            <nav className="space-y-2">
              {DashBoardNavItems3.map((item, index) => (
                <DashboardNavItem
                  key={index}
                  index={index}
                  theme={theme}
                  Icon={item.Icon}
                  title={item.title}
                  link={item.link}
                  isSideBarOpen={isSideBarOpen}
                />
              ))}
            </nav>
          </>
        )}

        <nav className="space-y-1">
          {DashBoardNavItems2.map((item, index) => (
            <DashboardNavItem
              key={index}
              index={index}
              theme={theme}
              Icon={item.Icon}
              title={item.title}
              link={item.link}
              isSideBarOpen={isSideBarOpen}
            />
          ))}
        </nav>

        {/* Footer Section (User Profile & Theme Toggle) */}
        <div
          className={`flex ${
            isSideBarOpen ? "flex-row" : "flex-col"
          } items-center justify-start gap-2 relative w-full`}
        >
          <Link to="/edit-profile" >
            <Avatar className="border-2 border-blue-500">
              <AvatarImage src={userData.profileImageUrl} />
              <AvatarFallback className="font-bold text-xl dark:text-black dark:bg-white text-white bg-black">
                {userData.avatarFallbackText}
              </AvatarFallback>
            </Avatar>
          </Link>

          {isSideBarOpen && (
            <div className="text-left flex flex-col w-[60%] overflow-hidden">
              <span className="text-base font-medium text-center">{userData.fullName}</span>
              <span className="text-sm text-blue-500">{userData.email}</span>
            </div>
          )}
          <ModeToggle />
        </div>
      </div>
    </aside>
  );
};

export default DashBoardNavbar;
