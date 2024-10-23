import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuthContext } from "@/context/authContext";
import DashBoard from "@/sections/DashBoardSections/DashBoard";
import Bookmarks from "@/sections/DashBoardSections/Bookmarks";
import Courses from "@/sections/DashBoardSections/Courses";
// import Subscription from "@/sections/DashBoardSections/Subscription";
// import Watchlist from "@/sections/DashBoardSections/Watchlist";
// import TodoList from "@/sections/DashBoardSections/TodoList";
// import Settings from "@/sections/DashBoardSections/Settings";
// import History from "@/sections/DashBoardSections/History";
import RefreshPage from "@/sections/DashBoardSections/RefreshPage";
import AddCourses from "@/sections/DashBoardSections/AddCourses";
import AddTests from "@/sections/DashBoardSections/AddTests";
import PageTransitionSwipeAnimation from "@/Effects/PageTransitionSwipeAnimation";
import AddVideos from "@/sections/DashBoardSections/AddVideos";
import ViewCourse from "@/sections/DashBoardSections/ViewCourse";
import VideoPlaySection from "./VideoPlaySection";
import VideoEditPage from "@/components/addVideos/VideoEditPage";
import UnderMaintenancePage from "@/components/UnderMaintenancePage";

const DashboardRoutes: React.FC = () => {
  const { userData } = useAuthContext();
  const location = useLocation(); // Required to track page changes

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path="/dashboard"
          element={
            <PageTransitionSwipeAnimation>
              <DashBoard />
            </PageTransitionSwipeAnimation>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <PageTransitionSwipeAnimation>
              <Bookmarks />
            </PageTransitionSwipeAnimation>
          }
        />
        <Route
          path="/courses"
          element={
            <PageTransitionSwipeAnimation>
              <Courses />
            </PageTransitionSwipeAnimation>
          }
        />
          {/* // ! subscription page page is UnderMaintenance  */}
        <Route
          path="/subscription"
          element={
            <PageTransitionSwipeAnimation>
              {/* <Subscription /> */}
              <UnderMaintenancePage pageName="Subscription page" />
            </PageTransitionSwipeAnimation>
          }
        />
        {/* <Route
          path="/watchlist"
          element={
            <PageTransitionSwipeAnimation>
              <Watchlist />
            </PageTransitionSwipeAnimation>
          }
        /> */}
        {/* // ! this todo list is UnderMaintenance  */}
        <Route
          path="/todo-list"
          element={
            <PageTransitionSwipeAnimation>
              {/* <TodoList /> */}
              <UnderMaintenancePage pageName="Todo List" />
            </PageTransitionSwipeAnimation>
          }
        />
        {/* // ! history page is UnderMaintenance  */}
        <Route
          path="/history"
          element={
            <PageTransitionSwipeAnimation>
              {/* <History /> */}
              <UnderMaintenancePage pageName="History" />
            </PageTransitionSwipeAnimation>
          }
        />
        <Route
          path="/refresh"
          element={
            <PageTransitionSwipeAnimation>
              <RefreshPage />
            </PageTransitionSwipeAnimation>
          }
        />
        {/* <Route
          path="/setting"
          element={
            <PageTransitionSwipeAnimation>
              <Settings />
            </PageTransitionSwipeAnimation>
          }
        /> */}
        <Route
          path="/view-course"
          element={
            <PageTransitionSwipeAnimation>
              <ViewCourse />
            </PageTransitionSwipeAnimation>
          }
        />
        <Route
          path="/video-player"
          element={
            <PageTransitionSwipeAnimation>
              <VideoPlaySection />
            </PageTransitionSwipeAnimation>
          }
        />
        {/* // ! this page is UnderMaintenance  */}
        <Route
          path="/test"
          element={
            <PageTransitionSwipeAnimation>
              <UnderMaintenancePage pageName="Test" />
            </PageTransitionSwipeAnimation>
          }
        />
      </Routes>
        {/* Admin-only Routes */}
        {userData.role === "ADMIN" && (
          // <main className="w-full min-h-screen dark:bg-gray-800 overflow-x-hidden bg-white-600 relative hide-scrollbar scrollbar-custom">
            <Routes location={location} key={`ADMIN/${location.pathname}`}>
              <Route
                path="/add-courses"
                element={
                  // <PageTransitionSwipeAnimation>
                  <AddCourses />
                  // </PageTransitionSwipeAnimation>
                }
              />
              <Route
                path="/add-tests"
                element={
                  <PageTransitionSwipeAnimation>
                    <AddTests />
                  </PageTransitionSwipeAnimation>
                }
              />
              <Route
                path="/add-videos"
                element={
                  <PageTransitionSwipeAnimation>
                    <AddVideos />
                  </PageTransitionSwipeAnimation>
                }
              />
              <Route
                path="/edit-video"
                element={
                  <PageTransitionSwipeAnimation>
                    <VideoEditPage />
                  </PageTransitionSwipeAnimation>
                }
              />
            </Routes>
          // </main>
        )}
    </AnimatePresence>
  );
};

export default DashboardRoutes;
