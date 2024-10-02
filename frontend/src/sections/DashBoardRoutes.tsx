import React from "react";
import { Route, Routes } from "react-router-dom";
import Bookmarks from "@/DashBoardSections/Bookmarks";
import Courses from "@/DashBoardSections/Courses";
import Subscription from "@/DashBoardSections/Subscription";
import Watchlist from "@/DashBoardSections/Watchlist";
import TodoList from "@/DashBoardSections/TodoList";
import RefreshPage from "@/DashBoardSections/RefreshPage";
import Settings from "@/DashBoardSections/Settings";
import History from "@/DashBoardSections/History";
import DashBoardNavbar from "@/DashBoardSections/DashBoardNavbar";
import DashBoard from "@/DashBoardSections/DashBoard";

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
