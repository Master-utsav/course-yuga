import { ModeToggle } from "@/components/ThemeBtn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/context/authContext";
import { useTheme } from "@/context/ThemeProvider";
import BookmarkIcon2 from "@/Icons/BookmarkIcon2";
import CoursesIcon from "@/Icons/CoursesIcon";
import CrossIcon from "@/Icons/CrossIcon";
import DashboardIcon from "@/Icons/DashboardIcon";
import HelpIcon from "@/Icons/HelpIcon";
import HistoryIcon from "@/Icons/HistoryIcon";
import HomeIcon from "@/Icons/HomeIcon";
import NavbarIcon from "@/Icons/NavbarIcon";
import RefreshIcon from "@/Icons/RefreshIcon";
import SaveForLaterIcon from "@/Icons/SaveForLaterIcon";
import SettingIcon from "@/Icons/SettingIcon";
import SubscriptionIcon from "@/Icons/SubscriptionIcon";
import TodoIcon from "@/Icons/TodoIcon";
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
    <div
      className={`flex dark:bg-gray-950/80 dark:text-white bg-gray-100/80 text-black w-[18%] relative rounded-lg h-screen `}
    >
      <div className="flex flex-col py-4 px-1 space-y-4 transition-transform duration-300 ease-in-out w-full  justify-between">
        <div className="flex flex-col space-y-0 ">
          <div className="flex justify-between items-center pt-2 pb-6">
            <div className="flex items-center justify-between space-x-2">
              <Link to="/" className="">
                {theme === "dark" ? (
                  <motion.img
                    initial={{ opacity: 0.5, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    src="/images/dark-mode-logo.png"
                    alt="cryptoBag"
                    className="size-9 object-cover w-32"
                  />
                ) : (
                  <motion.img
                    initial={{ opacity: 0.5, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    src="/images/light-mode-logo.png"
                    alt="cryptoBag"
                    className="size-9 object-cover w-32"
                  />
                )}
              </Link>
            </div>
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
              ) : (
                theme === "dark" ? (
                    <CrossIcon fillColor="white" size={28} />
                  ) : (
                    <CrossIcon fillColor="black" size={28} />
                  )
              )}
            </motion.button>
          </div>

          {/* Search */}
          <div className="border-t-2 dark:border-white border-black rounded-l-2xl rounded-r-2xl py-2">
          </div>

          {/* Links */}
          <nav className="flex flex-col space-y-4">
            <Link to={"/"} className="flex items-center space-x-2 px-2">
              <span>
                <HomeIcon fillColor="green" size={20} />{" "}
              </span>
              <span className="text-base font-medium font-ubuntu text-center">
                Homepage
              </span>
            </Link>
            <Link
              to={"/user/dashboard"}
              className="flex items-center space-x-2 px-2"
            >
              <span>
                <DashboardIcon fillColor="yellow" size={20} />{" "}
              </span>
              <span className="text-base font-medium font-ubuntu text-center">
                Dashboard
              </span>
            </Link>
            <Link
              to={"/user/bookmarks"}
              className="flex items-center space-x-2 px-2"
            >
              <span>
                <BookmarkIcon2 fillColor="purple" size={18} />{" "}
              </span>
              <span className="text-base font-medium font-ubuntu text-center">
                Bookmarks
              </span>
            </Link>
            <Link to={"/user/courses"} className="flex items-center space-x-2 px-2">
              <span>
                <CoursesIcon fillColor="yellow" size={18} />{" "}
              </span>
              <span className="text-base font-medium font-ubuntu text-center">
                Courses
              </span>
            </Link>
            <Link
              to={"/user/subscription"}
              className="flex items-center space-x-2 px-2"
            >
              <span>
                <SubscriptionIcon fillColor="blue" size={18} />{" "}
              </span>
              <span className="text-base font-medium font-ubuntu text-center">
                Subscription
              </span>
            </Link>
            <Link
              to={"/user/watchlist"}
              className="flex items-center space-x-2 px-2"
            >
              <span>
                <SaveForLaterIcon fillColor="blue" size={18} />{" "}
              </span>
              <span className="text-base font-medium font-ubuntu text-center">
                Watchlist
              </span>
            </Link>
            <Link
              to={"/user/todo-list"}
              className="flex items-center space-x-2 px-2"
            >
              <span>
                <TodoIcon fillColor="rgb(10 125 56)" size={18} />{" "}
              </span>
              <span className="text-base font-medium font-ubuntu text-center">
                Todo-List
              </span>
            </Link>
            <Link to={"/user/history"} className="flex items-center space-x-2 px-2">
              <span>
                <HistoryIcon fillColor="rgb(245 158 11)" />
              </span>
              <span className="text-base font-medium font-ubuntu text-center">
                History
              </span>
            </Link>
          </nav>
        </div>

        <div className="flex flex-col pt-2">
          <div className="mt-auto space-y-3">
            <Link
              to={"/user/refresh"}
              className="flex items-center space-x-2 px-2"
            >
              <span>
                <RefreshIcon fillColor="rgb(0 158 11)" />
              </span>
              <span className="text-base font-medium font-ubuntu text-center">
                Refresh
              </span>
            </Link>
            <Link
              to={"/user/setting"}
              className="flex items-center space-x-2 px-2"
            >
              <span>
                <SettingIcon strokeColor="rgb(255 255 255)" />
              </span>
              <span className="text-base font-medium font-ubuntu text-center">
                Setting
              </span>
            </Link>
            
            <Link to={"/help"} className="flex items-center space-x-2 px-2">
              <span>
                <HelpIcon
                  fillColor="rgb(245 0 11)"
                  strokeColor="rgb(245 0 11)"
                />
              </span>
              <span className="text-base font-medium font-ubuntu text-center">
                Help Support
              </span>
            </Link>
          </div>

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
