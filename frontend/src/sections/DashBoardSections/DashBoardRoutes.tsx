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
import UnauthorizedPage from "@/components/UnauthorizedPage";
import PageTransitionBoxAnimation from "@/Effects/PageTransitionBoxAnimation";
import PageNotFound from "@/components/PageNotFound";
import { useTheme } from "@/context/ThemeProvider";

const DashboardRoutes: React.FC = () => {
  const { userData } = useAuthContext();
  const location = useLocation();
  const {theme} = useTheme();

  return (
    <DashboardContextProvider>
      <div className="h-screen flex">
        {/* Render the navbar only if the route is not /user or its sub-paths */}
        <DashBoardNavbar />

        <main className="flex-1 overflow-auto p-4 bg-white dark:bg-gray-900 scrollbar-custom">
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              {/* Public Routes */}
              {userData.role === "ADMIN" ? (
                <>
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
                  <Route path="/add-courses" element={
                    <PageTransitionSwipeAnimation>
                      <AddCourses />
                    </PageTransitionSwipeAnimation>
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
                </>
              ) : (
                <>
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
                  <Route path="/add-courses" element={<UnauthorizedPage />} />
                  <Route path="/add-tests" element={<UnauthorizedPage />} />
                  <Route path="/add-videos" element={<UnauthorizedPage />} />
                  <Route path="/edit-video" element={<UnauthorizedPage />} />
                  
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
        </main>
      </div>
    </DashboardContextProvider>
  );
};

export default DashboardRoutes;
