import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./sections/Navbar";
import HeroSection from "@/sections/HeroSection";
import { useTheme } from "@/context/ThemeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "@/context/authContext";
import LogoutModal from "@/components/modals/LogoutModal";
import styles from "@/sass/Toast.module.scss";
import React from "react";
import PageTransitionBoxAnimation from "@/Effects/PageTransitionBoxAnimation";
import DashboardRoutes from "@/sections/DashBoardSections/DashBoardRoutes";
import Help from "@/sections/HelpSection";
import EditProfile from "@/sections/editProfile/EditProfile";
import DashBoardNavbar from "@/sections/DashBoardSections/DashBoardNavbar";
import Courses from "./sections/Courses";
import { DashboardContextProvider } from "./context/dashboardContext";
import CourseIntroPage from "./components/addCourses/CourseIntroPage";
import "./index.css"

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
    <main className="max-w-full mx-auto relative dark:bg-black bg-white scrollbar-custom ">
      <Routes location={location} key={location.pathname}>
        {isLoggedIn ? (
          <>
            <Route
              path="/"
              element={
                <>
                  <Navbar isUserLoggedIn={isLoggedIn} />
                  <HeroSection route="homepage" />
                </>
              }
            />
            <Route
              path="/logout"
              element={
                <AnimatePresence mode="wait">
                  <PageTransitionBoxAnimation className="bg-gray-900/40 backdrop-blur-sm ">
                    <Navbar isUserLoggedIn={isLoggedIn} />
                    <LogoutModal />
                  </PageTransitionBoxAnimation>
                </AnimatePresence>
              }
            />
            <Route
              path="/help"
              element={
                <AnimatePresence mode="wait">
                  <PageTransitionBoxAnimation className="bg-gray-900/40 backdrop-blur-sm ">
                    <Navbar isUserLoggedIn={isLoggedIn} />
                    <Help />
                  </PageTransitionBoxAnimation>
                </AnimatePresence>
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
            <Route
              path="/courses"
              element={
                <>
                  <Navbar isUserLoggedIn={isLoggedIn} />
                  <Courses />
                </>
              }
            />
            <Route
              path="/course-intro-page"
              element={
                <>
                  <Navbar isUserLoggedIn={isLoggedIn} />
                  <CourseIntroPage />
                </>
              }
            />
            <Route
              path="/courses"
              element={
                <>
                  <Navbar isUserLoggedIn={isLoggedIn} />
                  <Courses />
                </>
              }
            />

            {/* All dashboard routes */}
            <Route
              path="/user/*"
              element={
                <DashboardContextProvider>
                  <div className="h-screen flex">
                    <DashBoardNavbar  />
                    <main className="flex-1 overflow-auto p-4 bg-white dark:bg-gray-900 scrollbar-custom">
                      <DashboardRoutes />
                    </main>
                  </div>
                </DashboardContextProvider>
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
            <Route
              path="/courses"
              element={
                <>
                  <Navbar isUserLoggedIn={isLoggedIn} />
                  <Courses />
                </>
              }
            />
            <Route
              path="/course-intro-page"
              element={
                <>
                  <Navbar isUserLoggedIn={isLoggedIn} />
                  <CourseIntroPage />
                </>
              }
            />
          </>
        )}
      </Routes>
      {/* </AnimatePresence> */}
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
