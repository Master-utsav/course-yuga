import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuthContext } from "@/context/authContext";
import DashBoard from "@/sections/DashBoardSections/DashBoard";
import Bookmarks from "@/sections/DashBoardSections/Bookmarks";
import Courses from "@/sections/DashBoardSections/Courses";
import RefreshPage from "@/sections/DashBoardSections/RefreshPage";
import AddCourses from "@/sections/DashBoardSections/AddCourses";
import AddTests from "@/sections/DashBoardSections/AddTests";
import AddVideos from "@/sections/DashBoardSections/AddVideos";
import ViewCourse from "@/sections/DashBoardSections/ViewCourse";
import VideoPlaySection from "./VideoPlaySection";
import VideoEditPage from "@/components/addVideos/VideoEditPage";
import UnderMaintenancePage from "@/components/UnderMaintenancePage";
import PageTransitionSwipeAnimation from "@/Effects/PageTransitionSwipeAnimation";
import { DashboardContextProvider } from "@/context/dashboardContext";
import DashBoardNavbar from "./DashBoardNavbar";


const DashboardRoutes: React.FC = () => {
  const { userData } = useAuthContext();
  const location = useLocation();

  return (
    <DashboardContextProvider>
      <div className="h-screen flex">
        {/* Render the navbar only if the route is not /user or its sub-paths */}
        <DashBoardNavbar />

        <main className="flex-1 overflow-auto p-4 bg-white dark:bg-gray-900 scrollbar-custom">
          <AnimatePresence mode="wait" initial={false}>
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
              <Route
                path="/subscription"
                element={
                  <PageTransitionSwipeAnimation>
                    <UnderMaintenancePage pageName="Subscription page" />
                  </PageTransitionSwipeAnimation>
                }
              />
              <Route
                path="/todo-list"
                element={
                  <PageTransitionSwipeAnimation>
                    <UnderMaintenancePage pageName="Todo List" />
                  </PageTransitionSwipeAnimation>
                }
              />
              <Route
                path="/history"
                element={
                  <PageTransitionSwipeAnimation>
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
              <Route
                path="/test"
                element={
                  <PageTransitionSwipeAnimation>
                    <UnderMaintenancePage pageName="Test" />
                  </PageTransitionSwipeAnimation>
                }
              />

              {/* Admin-only Routes */}
              {userData.role === "ADMIN" && (
                <>
                  <Route path="/add-courses" element={<AddCourses />} />
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
                </>
              )}
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </DashboardContextProvider>
  );
};

export default DashboardRoutes;
