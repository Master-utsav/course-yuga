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
import { BookAIcon } from "lucide-react";
import React from "react";

const DashBoardNavbar: React.FC = () => {
  const { isSideBarOpen, setIsSideBarOpen } = useDashboardContext();
  const [isAccordionOpen , setIsAccordionOpen] = React.useState<boolean>(false)
  const { theme } = useTheme();
  const { userData } = useAuthContext();

  return (
    <aside
      className={`bg-gray-100 dark:bg-gray-950 dark:text-white text-black 
      transition-all duration-300  ${
        isSideBarOpen ? "w-64" : "w-16"
      } h-screen`}
    >
      <div
        className={`flex flex-col h-full ${
          isSideBarOpen ? "py-2 px-5 justify-between" : "py-4 justify-between items-center"
        } ${userData.role === "ADMIN" ? "space-y-1" : "space-y-4"}`}
      >
  
        <div className="flex justify-around items-center flex-col w-full relative space-y-2">
          <div className="flex justify-between items-center py-2 w-full">
            {isSideBarOpen && (
              <Logo theme={theme} className="object-cover w-32" />
            )}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => {setIsSideBarOpen(!isSideBarOpen)}}
              className={`animate-pulse flex justify-center items-center ${isSideBarOpen ? "w-[25%]" : "w-full"} `}
            >
              {isSideBarOpen ? 
                <SidebarCloseIcon fillColor={theme === "dark" ? "white" : "black"} size={32} />
              :
                <SidebarOpenIcon fillColor={theme === "dark" ? "white" : "black"} size={32} />
              }
            </motion.button>
          </div>

          <div className="border-t-2 dark:border-white border-black rounded-l-2xl rounded-r-2xl py-2 w-full px-2"></div>
          <nav className={`space-y-0 w-full ${isSideBarOpen ? "px-0" : "px-1"}`}>
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
        </div>

      
        {userData.role === "ADMIN" && (
          <div className={`my-0 py-2 flex flex-col items-start `}>
           
            {isSideBarOpen && <Seperator text="Admin section" className="my-2 w-full" />}

            <div
              className={`flex items-start justify-start gap-2 cursor-pointer group ${isSideBarOpen ? "px-0" : "px-5"} `}
              onClick={() => {
                if (!isSideBarOpen) setIsSideBarOpen(true);
                setIsAccordionOpen((prev) => !prev); 
              }}
            >
              <BookAIcon />

              {isSideBarOpen && (
                <span
                  className="text-base font-medium font-ubuntu text-center 
                  dark:text-white text-black group-hover:text-black/80 
                  group-hover:dark:text-white/80"
                >
                  Your Content
                </span>
              )}
            </div>

            {isAccordionOpen && (
              <div className="mt-2 w-full">
                <nav className={`py-0 my-0 ${isSideBarOpen ? "px-0" : "px-1"}`}>
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
              </div>
            )}
          </div>
        )}

        
        <div className="flex justify-around items-start flex-col w-full relative space-y-1">
        <nav className={`space-y-0 ${isSideBarOpen ? "px-0" : "px-1"}`}>
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
        
      </div>
    </aside>
  );
};

export default React.memo(DashBoardNavbar);
