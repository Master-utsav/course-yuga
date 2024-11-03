import React, { useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/authContext";
import { useTheme } from "@/context/ThemeProvider";
import { DashboardContextProvider } from "@/context/dashboardContext";

// Components
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
import PageTransitionBoxAnimation from "@/Effects/PageTransitionBoxAnimation";
import PageNotFound from "@/components/PageNotFound";
import UnauthorizedPage from "@/components/UnauthorizedPage";
import DashBoardNavbar from "./DashBoardNavbar";
import PageTransitionSwipeAnimation from "@/Effects/PageTransitionSwipeAnimation";
import Subscription from "./Subscription";
import History from "./History";

const DashboardRoutes: React.FC = () => {
  const { userData } = useAuthContext();
  const location = useLocation();
  const { theme } = useTheme();

  // Memoize routes to prevent unnecessary recalculations
  const routes = useMemo(() => {
    const commonRoutes = [
      { path: "/dashboard", element: <DashBoard /> },
      { path: "/bookmarks", element: <Bookmarks /> },
      { path: "/courses", element: <Courses /> },
      { path: "/subscription", element: <Subscription/> },
      { path: "/todo-list", element: <UnderMaintenancePage pageName="Todo List" /> },
      { path: "/history", element: <History/> },
      { path: "/refresh", element: <RefreshPage /> },
      { path: "/view-course", element: <ViewCourse /> },
      { path: "/video-player", element: <VideoPlaySection /> },
      { path: "/test", element: <UnderMaintenancePage pageName="Test" /> },
    ];

    if (userData.role === "ADMIN" || userData.role === "MASTER") {
      return [
        ...commonRoutes,
        { path: "/add-courses", element: <AddCourses /> },
        { path: "/add-tests", element: <AddTests /> },
        { path: "/add-videos", element: <AddVideos /> },
        { path: "/edit-video", element: <VideoEditPage /> },
      ];
    } else {
      return [
        ...commonRoutes,
        { path: "/add-courses", element: <UnauthorizedPage /> },
        { path: "/add-tests", element: <UnauthorizedPage /> },
        { path: "/add-videos", element: <UnauthorizedPage /> },
        { path: "/edit-video", element: <UnauthorizedPage /> },
      ];
    }
  }, [userData.role]);

  return (
    <DashboardContextProvider>
      <div className="h-screen flex">
        <DashBoardNavbar />
        <main className="flex-1 overflow-auto p-4 bg-white dark:bg-gray-900 scrollbar-custom">
     
          <Routes location={location} key={location.pathname}>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={
                <PageTransitionSwipeAnimation>
                  {element}
                </PageTransitionSwipeAnimation>
              } />
            ))}

            <Route
              path="/*"
              element={
                <PageTransitionBoxAnimation
                  className={theme === "dark" ? "bg-gray-900" : "bg-white-700"}
                >
                  <PageNotFound />
                </PageTransitionBoxAnimation>
              }
            />
          </Routes>
        </main>
      </div>
    </DashboardContextProvider>
  );
};

export default DashboardRoutes;
