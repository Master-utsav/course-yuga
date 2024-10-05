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
import Help from "./sections/Help";
import EditProfile from "./sections/EditProfile";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isLoggedIn } = useAuthContext();
  
  const getToastContainerClass = (theme: string) => {
    return theme === "dark" ? styles.dark : styles.light;
  };

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (isLoggedIn && token) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, location, navigate]);

  return (
    <main className="max-w-full mx-auto relative dark:bg-black bg-white">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {isLoggedIn ? (
            <>
              <Route
                path="/"
                element={
                  <>
                    <Navbar isUserLoggedIn={isLoggedIn} />
                    <HeroSection route="homepage"/>
                  </>
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
                    <Help />
                  </PageTransitionBoxAnimation>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <>
                  <Navbar isUserLoggedIn={isLoggedIn} />
                  <EditProfile />
                  </>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <>
                    <Navbar isUserLoggedIn={isLoggedIn} />
                    <HeroSection route="reset-password" />
                  </>
                }
              />
              {/* All dashboard routes */}
              <Route path="/user/*" element={<DashboardRoutes />} />
            </>
          ) : (
            <>
              <Route
                path="/signup"
                element={
                  <>
                    <Navbar isUserLoggedIn={isLoggedIn} />
                    <HeroSection route="signup" />
                  </>
                }
              />
              <Route
                path="/login"
                element={
                  <>
                    <Navbar isUserLoggedIn={isLoggedIn} />
                    <HeroSection route="login" />
                  </>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <>
                    <Navbar isUserLoggedIn={isLoggedIn} />
                    <HeroSection route="reset-password" />
                  </>
                }
              />
              <Route
                path="/"
                element={
                  <>
                    <Navbar isUserLoggedIn={isLoggedIn} />
                    <HeroSection route="homepage" />
                  </>
                }
              />
            </>
          )}
        </Routes>
      </AnimatePresence>
      <ToastContainer
        position="bottom-right"
        className={`${styles.toastContainer} ${getToastContainerClass(theme)}`}
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
