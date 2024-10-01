import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./sections/Navbar";
import HeroSection from "./sections/HeroSection";
import { getTheme, ThemeProvider } from "./context/ThemeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "./context/authContext";
import LogoutModal from "./sections/LogoutModal";
import styles from '@/sass/Toast.module.scss'; 
import React from "react";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const toastTheme: "dark" | "light" = getTheme();
  const { isLoggedIn , setIsSignupOpen} = useAuthContext();
  
  const getToastContainerClass = (theme: "dark" | "light") => {
    return theme === "dark" ? styles.dark : styles.light;
  };

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token'); 

    if (isLoggedIn && token) {
      navigate("/", { replace: true });
    }

    if(location.pathname === "/signup"){
      setIsSignupOpen(true);
    }

  }, [isLoggedIn, location, navigate, setIsSignupOpen]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="max-w-full mx-auto relative dark:bg-black bg-white">
        <Navbar isUserLoggedIn={isLoggedIn}/>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {isLoggedIn ? (
              <>
              <Route
                path="/"
                element={
                  <HeroSection />
                }
              />
              <Route
                  path="/logout"
                  element={<LogoutModal />}
              />
              </>
              
            ) : (
              <>
                <Route
                  path="/signup"
                  element={<HeroSection />}
                />
                <Route
                  path="/login"
                  element={<HeroSection />}
                />
                <Route
                  path="/"
                  element={<HeroSection />}
                />
              </>
            )}
          </Routes>
        </AnimatePresence>
        <ToastContainer
        position="bottom-right"
        className={`${styles.toastContainer} ${getToastContainerClass(toastTheme)}`}
        toastClassName={styles.Toastify__toast}
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      </main>
    </ThemeProvider>
  );
}

export default App;
