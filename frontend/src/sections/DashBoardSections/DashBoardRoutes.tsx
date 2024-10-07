import React from "react";
import { Route, Routes } from "react-router-dom";
import Bookmarks from "@/sections/DashBoardSections/Bookmarks";
import Courses from "@/sections/DashBoardSections/Courses";
import Subscription from "@/sections/DashBoardSections/Subscription";
import Watchlist from "@/sections/DashBoardSections/Watchlist";
import TodoList from "@/sections/DashBoardSections/TodoList";
import RefreshPage from "@/sections/DashBoardSections/RefreshPage";
import Settings from "@/sections/DashBoardSections/Settings";
import History from "@/sections/DashBoardSections/History";
import DashBoardNavbar from "@/sections/DashBoardSections/DashBoardNavbar";
import DashBoard from "@/sections/DashBoardSections/DashBoard";

const DashboardRoutes: React.FC = () => {
  return (
    <main className="max-w-full flex flex-row mx-auto relative dark:bg-black bg-white overflow-x-hidden">
      <DashBoardNavbar />
      <Routes>
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/todo-list" element={<TodoList />} />
        <Route path="/history" element={<History />} />
        <Route path="/refresh" element={<RefreshPage />} />
        <Route path="/setting" element={<Settings />} />
      </Routes>
    </main>
  );
};

export default DashboardRoutes;
