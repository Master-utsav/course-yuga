import DashboardNavItem from "@/components/DashboardNavItem";
import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/ThemeBtn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashBoardNavItems, DashBoardNavItems2 } from "@/constants";
import { useAuthContext } from "@/context/authContext";
import { useTheme } from "@/context/ThemeProvider";
import CrossIcon from "@/Icons/CrossIcon";
import NavbarIcon from "@/Icons/NavbarIcon";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const DashBoardNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true); // Toggle sidebar
  const { theme } = useTheme();
  const { localStorageUserData } = useAuthContext();
  const firstName: string = localStorageUserData?.firstName || "Unknown";
  const lastName: string = localStorageUserData?.lastName || "User";
  const fullName: string = firstName + " " + lastName;
  const userEmail: string =
    localStorageUserData?.email || "unknown_user@gmail.com";
  const imageUrl: string = localStorageUserData?.profileImageUrl || "";
  const firstChar: string =
    localStorageUserData?.firstName.charAt(0).toUpperCase() || "U";
  const lastChar: string =
    localStorageUserData?.lastName.charAt(0).toUpperCase() || "K";
  const avatarFallbackText = firstChar + lastChar;

  return (
    <div className="flex dark:bg-gray-950 dark:text-white bg-gray-100 text-black relative rounded-lg h-screen z-50">
      <div className="flex flex-col py-4 px-1 space-y-4 transition-transform duration-300 ease-in-out w-full  justify-between">
        <div className="flex flex-col space-y-0 ">
          <div className="flex justify-between items-center pt-2 pb-6">
            <Logo theme={theme} className="object-cover w-32"/>
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => setIsOpen(!isOpen)}
            >
              {!isOpen ? (
                theme === "dark" ? (
                  <NavbarIcon fillColor="white" size={28} />
                ) : (
                  <NavbarIcon fillColor="black" size={28} />
                )
              ) : theme === "dark" ? (
                <CrossIcon fillColor="white" size={28} />
              ) : (
                <CrossIcon fillColor="black" size={28} />
              )}
            </motion.button>
          </div>

          <div className="border-t-2 dark:border-white border-black rounded-l-2xl rounded-r-2xl py-2"></div>

          <nav className="flex flex-col space-y-3 px-2">
            {DashBoardNavItems.map((item, index) => (
              <DashboardNavItem
                key={index}
                index={index}
                theme={theme}
                Icon={item.Icon}
                title={item.title}
                link={item.link}
              />
            ))}
          </nav>
        </div>
        <div className="flex flex-col pt-2">
          <nav className="flex flex-col space-y-3 px-2">
            {DashBoardNavItems2.map((item, index) => (
              <DashboardNavItem
                key={index}
                index={index}
                theme={theme}
                Icon={item.Icon}
                title={item.title}
                link={item.link}
              />
            ))}
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-2 mt-4">
            <Link to={"/edit-profile"}>
              <Avatar className="border-2 border-blue-500">
                <AvatarImage src={imageUrl} className="" />
                <AvatarFallback className="font-bold text-xl dark:text-black font-ubuntu dark:bg-white text-white bg-black ">
                  {avatarFallbackText}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="text-center content-center flex-col flex">
              <span className="text-center mx-2">{fullName}</span>
              <span className="text-blue-500 text-sm">{userEmail}</span>
            </div>
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardNavbar;