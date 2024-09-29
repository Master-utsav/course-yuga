import React from "react";
import styles from "../sass/Navbar.module.scss";
import NavItems from "../components/NavItems";
// import StaggeredBlurTextEffect from "../Effects/StaggeredBlurTextEffect";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthContext } from "../context/authContext";
import { ModeToggle } from "@/components/ThemeBtn";
import { useTheme } from "@/context/ThemeProvider";
import DashboardIcon from "@/Icons/DashboardIcon";

interface NavbarProps{
  isUserLoggedIn: boolean
}
const Navbar: React.FC<NavbarProps> = ({isUserLoggedIn}) => {
  const [isOpen, isSetOpen] = React.useState<boolean>(false);
  const { setIsSignupOpen , setIsLoginOpen} = useAuthContext();
  const {theme} = useTheme()
  const navigate = useNavigate();

  const handleSignupClick = () => {
    setIsSignupOpen(true);
    setIsLoginOpen(false);
    navigate('/signup');
  };
  const handleLoginClick = () => {
    setIsLoginOpen(true);
    setIsSignupOpen(false);
    navigate('/login'); 
  };
  const toggleMenu = () => {
    isSetOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-lg max-w-7xl mx-auto">
      <div className="max-w-full  sm:py-2 ">
        <div className="flex xl:flex-row flex-col justify-between xl:pt-4 xl:pb-1 py-4  items-center font-noto-sans xl:gap-20 md:gap-5 gap-3">
          <div className="flex justify-start py-2 items-center font-noto-sans">
            <Link
              to="/"
              className=""
            >
                {theme === 'dark' ? (<motion.img
                initial={{ opacity: 0.5, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                src="images/dark-mode-logo.png"
                alt="cryptoBag"
                className="size-12 object-cover w-40"
              />) : (
                <motion.img
                initial={{ opacity: 0.5, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                src="images/light-mode-logo.png"
                alt="cryptoBag"
                className="size-12 object-cover w-40"
              />
              )}
              
             
            </Link>

            <button
              onClick={toggleMenu}
              className={`${styles["menu-btn"]} sm:hidden flex`}
              aria-label="Toggle Menu"
            >
              <div
                className={`${styles["menu-btn__burger"]} ${
                  isOpen ? styles.open : ""
                }`}
              ></div>
            </button>

            
            
          </div>
          <nav className={`sm:flex hidden font-bold`}>
              <NavItems />
            </nav>
            <div className="flex gap-4">
              {!isUserLoggedIn ? (<>
              <motion.button
                    whileTap={{ scale: 0.8 }}
                    className="w-full py-2 px-6 bg-black text-white dark:bg-white dark:text-black rounded-3xl font-semibold shadow-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-all "
                    onClick={handleSignupClick}
                >
                    Signup
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.8 }}
                    className="w-full py-2 px-6 bg-black text-white dark:bg-white dark:text-black rounded-3xl font-semibold shadow-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-all "
                    onClick={handleLoginClick}
                >
                    Login
                </motion.button>
              </>)
              :
              (<motion.button
                    whileTap={{ scale: 0.8 }}
                    className="w-full py-2 px-6 bg-black text-white dark:bg-white dark:text-black rounded-3xl font-semibold shadow-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-all flex gap-2"
                    onClick={() => navigate("/dashboard")}
                >
                    <span className="font-ubuntu">Dashboard</span> 
                    {
                    theme === 'dark' ? (<DashboardIcon fillColor="black" size={24}/>) : (<DashboardIcon fillColor="white" size={24}/>)
                    }
                </motion.button>)}
                
                <div  className="w-full rounded-3xl font-semibold shadow-md transition-all ">
                <ModeToggle/>
                </div>
            </div>

        </div>

        
      </div>

      {/* Sidebar Menu */}
      <div className={`nav-sidebar   ${isOpen ? "max-h-screen" : "max-h-0"}`}>
        <nav className="p-5 text-center  backdrop-blur-lg" onClick={toggleMenu}>
          <NavItems navListBgForSmallScreen="bg-black/5" />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
