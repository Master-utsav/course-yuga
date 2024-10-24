import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeProvider";
import HeroSection from "@/sections/HeroSection";
import Courses from "@/sections/Courses";
import Community from "@/sections/Community";
import ContactUs from "@/sections/ContactUs";
import AboutPage from "@/sections/AboutPage";
import LogoutModal from "@/components/modals/LogoutModal";
import EditProfile from "@/sections/EditProfile";
import styles from "@/sass/Toast.module.scss";
import { ToastContainer } from "react-toastify";
import CourseIntroPage from "./components/addCourses/CourseIntroPage";
import { useAuthContext } from "./context/authContext";
import DashboardRoutes from "./sections/DashBoardSections/DashBoardRoutes";
import Navbar from "./sections/Navbar";
import HelpSection from "./sections/HelpSection";

function App() {
  const location = useLocation();
  const { isLoggedIn } = useAuthContext();
  const { theme } = useTheme();

  // Determine if the current route is within the /user/* routes
  const isUserRoute = location.pathname.startsWith("/user");

  const memoizedRoutes = React.useMemo(
    () => (
      <Routes location={location} key={location.pathname}>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<HeroSection route="homepage" />} />
            <Route path="/logout" element={<LogoutModal />} />
            <Route path="/course-intro-page" element={<CourseIntroPage />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/help" element={<HelpSection />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/community" element={<Community />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/user/*" element={<DashboardRoutes/>} />
          </>
        ) : (
          <>
            <Route path="/" element={<HeroSection route="homepage" />} />
            <Route path="/signup" element={<HeroSection route="signup" />} />
            <Route path="/login" element={<HeroSection route="login" />} />
            <Route path="/course-intro-page" element={<CourseIntroPage />} />
            <Route
              path="/courses"
              element={
                <AnimatePresence mode="sync" >
                  <Courses />
                </AnimatePresence>
              }
            />
            <Route path="/help" element={<HelpSection />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/community" element={<Community />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    ),
    [isLoggedIn, location]
  );

  return (
    <main className="max-w-full mx-auto relative dark:bg-black bg-white scrollbar-custom">
      {/* Conditionally render Navbar only on non-user routes */}
      {!isUserRoute && <Navbar isUserLoggedIn={isLoggedIn} />}

      {/* Render Routes */}
      {/* <AnimatePresence mode="wait" initial={false}> */}
      {memoizedRoutes}
      {/* </AnimatePresence> */}

      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-right"
        className={`${styles.toastContainer} ${
          theme === "dark" ? styles.dark : styles.light
        }`}
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
