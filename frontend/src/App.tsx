import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import UnauthenticatedPage from "./components/UnauthenticatedPage";
import PageNotFound from "./components/PageNotFound";
import ResetPasswordModal from "./components/modals/ResetPasswordModal";
import VerifyCourses from "./sections/VerifyCourses";

function App() {
  const location = useLocation();
  const { isLoggedIn } = useAuthContext();
  const { theme } = useTheme();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const isUserRoute = location.pathname.startsWith("/user");

  const memoizedRoutes = React.useMemo(() => {
    const authenticatedRoutes = (
      <>
        <Route path="/" element={<HeroSection route="homepage" />} />
        <Route path="/logout" element={<LogoutModal />} />
        <Route path="/course-intro-page" element={<CourseIntroPage />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/help" element={<HelpSection />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/community" element={<Community />} />
        <Route path="/reset-password" element={<ResetPasswordModal />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/verify-courses" element={<VerifyCourses />} />
        <Route path="/verify-email" element={email && <HeroSection route="verify-email" propEmail={email} />} />
        <Route path="/user/*" element={<DashboardRoutes />} />
      </>
    );

    const unauthenticatedRoutes = (
      <>
        <Route path="/" element={<HeroSection route="homepage" />} />
        <Route path="/signup" element={<HeroSection route="signup" />} />
        <Route path="/login" element={<HeroSection route="login" />} />
        <Route path="/verify-email" element={email && <HeroSection route="verify-email" propEmail={email} />} />
        <Route path="/course-intro-page" element={<CourseIntroPage />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/help" element={<HelpSection />} />
        <Route path="/community" element={<Community />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reset-password" element={<ResetPasswordModal />} />
        <Route path="/user/*" element={<UnauthenticatedPage />} />
        <Route path="/edit-profile" element={<UnauthenticatedPage />} />
        <Route path="/verify-courses" element={<UnauthenticatedPage />} />
      </>
    );

    return (
        <Routes location={location} key={location.pathname}>
          {isLoggedIn ? authenticatedRoutes : unauthenticatedRoutes}
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
    );
  }, [email, isLoggedIn, location]);

  return (
    <main className="max-w-full mx-auto relative dark:bg-black bg-white scrollbar-custom">
 
      {!isUserRoute && <Navbar isUserLoggedIn={isLoggedIn} />}

      {memoizedRoutes}

      <div className="fixed bottom-0 right-0 p-4">
        <ToastContainer
          position="bottom-right"
          className={`${styles.toastContainer} ${theme === "dark" ? styles.dark : styles.light}`}
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
