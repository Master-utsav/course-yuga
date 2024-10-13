import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuthContext } from "@/context/authContext";

import DashBoard from "@/sections/DashBoardSections/DashBoard";
import Bookmarks from "@/sections/DashBoardSections/Bookmarks";
import Courses from "@/sections/DashBoardSections/Courses";
import Subscription from "@/sections/DashBoardSections/Subscription";
import Watchlist from "@/sections/DashBoardSections/Watchlist";
import TodoList from "@/sections/DashBoardSections/TodoList";
import RefreshPage from "@/sections/DashBoardSections/RefreshPage";
import Settings from "@/sections/DashBoardSections/Settings";
import History from "@/sections/DashBoardSections/History";
import AddCourses from "./AddCourses";
import AddTests from "./AddTests";
import PageTransitionSwipeAnimation from "@/Effects/PageTransitionSwipeAnimation";

const DashboardRoutes: React.FC = () => {
  const { userData } = useAuthContext();
  const location = useLocation(); // Required to track page changes

  return (
    <AnimatePresence mode="wait" >
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
              <Subscription />
            </PageTransitionSwipeAnimation>
          }
        />
        <Route
          path="/watchlist"
          element={
            <PageTransitionSwipeAnimation>
              <Watchlist />
            </PageTransitionSwipeAnimation>
          }
        />
        <Route
          path="/todo-list"
          element={
            <PageTransitionSwipeAnimation>
              <TodoList />
            </PageTransitionSwipeAnimation>
          }
        />
        <Route
          path="/history"
          element={
            <PageTransitionSwipeAnimation>
              <History />
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
          path="/setting"
          element={
            <PageTransitionSwipeAnimation>
              <Settings />
            </PageTransitionSwipeAnimation>
          }
        />

        {/* Admin-only Routes */}
        {userData.role === "ADMIN" && (
          <>
            <Route
              path="/add-courses"
              element={
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
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
};

export default DashboardRoutes;
