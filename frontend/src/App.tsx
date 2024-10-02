import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./sections/Navbar";
import HeroSection from "./sections/HeroSection";
import { useTheme } from "./context/ThemeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "./context/authContext";
import LogoutModal from "./sections/LogoutModal";
import styles from "@/sass/Toast.module.scss";
import React from "react";
import PageTransitionBoxAnimation from "./Effects/PageTransitionBoxAnimation";
import DashboardRoutes from "./sections/DashBoardRoutes";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isLoggedIn, setIsSignupOpen } = useAuthContext();

  const getToastContainerClass = (theme: string) => {
    return theme === "dark" ? styles.dark : styles.light;
  };

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (isLoggedIn && token) {
      navigate("/", { replace: true });
    }

    if (location.pathname === "/signup") {
      setIsSignupOpen(true);
    }
  }, [isLoggedIn, location, navigate, setIsSignupOpen]);

  return (
    <main className="max-w-full mx-auto relative dark:bg-black bg-white">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {isLoggedIn ? (
            <>
              <Route
                path="/"
                element={
                  <PageTransitionBoxAnimation className="bg-gray-900/40 backdrop-blur-sm ">
                    <Navbar isUserLoggedIn={isLoggedIn} />
                    <HeroSection />
                  </PageTransitionBoxAnimation>
                }
              />
              <Route
                path="/logout"
                element={
                  <PageTransitionBoxAnimation className="bg-gray-900/40 backdrop-blur-sm ">
                    <Navbar isUserLoggedIn={isLoggedIn} />
                    <LogoutModal />
                  </PageTransitionBoxAnimation>
                }
              />
              <Route
                path="/help"
                element={
                  <PageTransitionBoxAnimation className="bg-gray-900/40 backdrop-blur-sm ">
                    <Navbar isUserLoggedIn={isLoggedIn} />
                    <LogoutModal />
                  </PageTransitionBoxAnimation>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <PageTransitionBoxAnimation className="bg-gray-900/40 backdrop-blur-sm ">
                    <Navbar isUserLoggedIn={isLoggedIn} />
                    <LogoutModal />
                  </PageTransitionBoxAnimation>
                }
              />
              {/* All dashboard routes */}
              <Route path="/user/*" element={
                <PageTransitionBoxAnimation className="bg-gray-900/40 backdrop-blur-sm ">
                    <DashboardRoutes />
                  </PageTransitionBoxAnimation>
                } 
              />
            </>
          ) : (
            <>
              <Route
                path="/signup"
                element={
                  <>
                    <Navbar isUserLoggedIn={isLoggedIn} />
                    <HeroSection />
                  </>
                }
              />
              <Route
                path="/login"
                element={
                  <>
                    <Navbar isUserLoggedIn={isLoggedIn} />
                    <HeroSection />
                  </>
                }
              />
              <Route
                path="/"
                element={
                  <>
                    <Navbar isUserLoggedIn={isLoggedIn} />
                    <HeroSection />
                  </>
                }
              />
            </>
          )}
        </Routes>
      </AnimatePresence>
      <ToastContainer
        position="bottom-right"
        className={`${styles.toastContainer} ${getToastContainerClass(
          theme
        )}`}
        toastClassName={styles.Toastify__toast}
        autoClose={3000}
        hideProgressBar={false}
        theme={theme}
        closeOnClick
        pauseOnHover
        draggable
      />
    </main>
  );
}

export default App;
