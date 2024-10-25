import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeProvider";
import HeroSection from "@/sections/HeroSection";
import Courses from "@/sections/Courses";
import Community from "@/sections/Community";
import ContactUs from "@/sections/ContactUs";
import AboutPage from "@/sections/AboutPage";
import LogoutModal from "@/components/modals/LogoutModal";
import EditProfile from "@/sections/EditProfile";
import { ToastContainer } from "react-toastify";
import styles from "@/sass/Toast.module.scss";
import "react-toastify/dist/ReactToastify.css"; 
import CourseIntroPage from "./components/addCourses/CourseIntroPage";
import { useAuthContext } from "./context/authContext";
import DashboardRoutes from "./sections/DashBoardSections/DashBoardRoutes";
import Navbar from "./sections/Navbar";
import HelpSection from "./sections/HelpSection";
import PageTransitionBoxAnimation from "./Effects/PageTransitionBoxAnimation";
import UnauthenticatedPage from "./components/UnauthenticatedPage";
import PageNotFound from "./components/PageNotFound";

function App() {
  const location = useLocation();
  const { isLoggedIn } = useAuthContext();
  const { theme } = useTheme();

  // Determine if the current route is within the /user/* routes
  const isUserRoute = location.pathname.startsWith("/user");

  const memoizedRoutes = React.useMemo(
    () => (
      <AnimatePresence initial={false} mode="wait" >
      <Routes location={location} key={location.pathname}>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<PageTransitionBoxAnimation className={theme === "dark" ? "bg-gray-900" : "bg-white-700"}><HeroSection route="homepage" /></PageTransitionBoxAnimation>} />
            <Route path="/logout" element={<LogoutModal />} />
            <Route path="/course-intro-page" element={<PageTransitionBoxAnimation className={theme === "dark" ? "bg-gray-900" : "bg-white-700"}><CourseIntroPage /></PageTransitionBoxAnimation>} />
            <Route path="/courses" element={<PageTransitionBoxAnimation className={theme === "dark" ? "bg-gray-900" : "bg-white-700"}><Courses /></PageTransitionBoxAnimation>} />
            <Route path="/help" element={<HelpSection />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/contact" element={<PageTransitionBoxAnimation className={theme === "dark" ? "bg-gray-900" : "bg-white-700"}><ContactUs /></PageTransitionBoxAnimation>} />
            <Route path="/community" element={<PageTransitionBoxAnimation className={theme === "dark" ? "bg-gray-900" : "bg-white-700"}><Community /></PageTransitionBoxAnimation>} />
            <Route path="/about" element={<PageTransitionBoxAnimation className={theme === "dark" ? "bg-gray-900" : "bg-white-700"}><AboutPage /></PageTransitionBoxAnimation>} />
            <Route path="/user/*" element={<DashboardRoutes/>} />
          </>
        ) : (
          <>
            <Route path="/" element={<PageTransitionBoxAnimation className={theme === "dark" ? "bg-gray-900" : "bg-white-700"}><HeroSection route="homepage" /></PageTransitionBoxAnimation>} />
            <Route path="/signup" element={<HeroSection route="signup" />} />
            <Route path="/login" element={<HeroSection route="login" />} />
            <Route path="/course-intro-page" element={
              <PageTransitionBoxAnimation className={theme === "dark" ? "bg-gray-900" : "bg-white-700"}>
                <CourseIntroPage />
              </PageTransitionBoxAnimation>} />
            <Route
              path="/courses"
              element={
                <PageTransitionBoxAnimation className={theme === "dark" ? "bg-gray-900" : "bg-white-700"}>
                  <Courses />
                </PageTransitionBoxAnimation>
              }
            />
            <Route path="/help" element={<HelpSection />} />
            <Route path="/community" element={
                <PageTransitionBoxAnimation className={theme === "dark" ? "bg-gray-900" : "bg-white-700"}>
                  <Community />
                </PageTransitionBoxAnimation>
             } />
             <Route path="/contact" element={
              <PageTransitionBoxAnimation className={theme === "dark" ? "bg-gray-900" : "bg-white-700"}>
                <ContactUs />
              </PageTransitionBoxAnimation>} />
            <Route path="/about" element={
                <PageTransitionBoxAnimation className={theme === "dark" ? "bg-gray-900" : "bg-white-700"}>
                  <AboutPage />
                </PageTransitionBoxAnimation>
              } />
            <Route path="/user/*" element={
              <PageTransitionBoxAnimation className={theme === "dark" ? "bg-gray-900" : "bg-white-700"}>
                <UnauthenticatedPage/>
              </PageTransitionBoxAnimation>
            } />
            <Route path="/edit-profile" element={
              <PageTransitionBoxAnimation className={theme === "dark" ? "bg-gray-900" : "bg-white-700"}>
                <UnauthenticatedPage />
              </PageTransitionBoxAnimation>
              } />
          </>
        )}
        <Route path="/*" element={
          <PageTransitionBoxAnimation className={theme === "dark" ? "bg-gray-900" : "bg-white-700"}>
            <PageNotFound/>
          </PageTransitionBoxAnimation>
        }
        />
      </Routes>
      </AnimatePresence>
    ),
    [isLoggedIn, location, theme]
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
      <div className="fixed bottom-0 right-0 p-4"> {/* Absolute container */}
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
      />
      </div>
    </main>
  );
}

export default App;
