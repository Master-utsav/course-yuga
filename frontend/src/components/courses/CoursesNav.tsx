import React, { useState, useCallback } from "react";
import { useTheme } from "@/context/ThemeProvider";
import CrossIcon from "@/Icons/CrossIcon";
import FilterIcon from "@/Icons/FilterIcon";
import { motion } from "framer-motion";
import OrderFilter from "./OrderFilter";
import SearchInputFilter from "./SearchInputFilter";
import SelectCurrency from "./SelectCurrency";
import CategoryFilter from "./CategoryFilter";
import { useCourseContext } from "@/context/courseContext";
import { COURSE_API } from "@/lib/env";
import { ErrorToast } from "@/lib/toasts";
import axios from "axios";
import { throttle } from "@/lib/throttling";  

const CoursesNavbar: React.FC = () => {
  const { theme } = useTheme();
  const { setCoursesData } = useCourseContext();

  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Centralized function to handle course fetching
  const fetchCourses = async (order = "", category = "") => {
    try {
      const endpoint = order || category 
        ? `${COURSE_API}/get-course-filter` 
        : `${COURSE_API}/get-all-courses`;

      const { data } = await axios.get(endpoint, { params: { order, category } });

      if (data?.success) {
        setCoursesData(data.data);
      } else {
        ErrorToast(data.message || "Error fetching courses");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error?.response?.data?.message || "Error fetching courses");
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledFetchCourses = useCallback(
    throttle(fetchCourses, 1500), 
    []
  );

  // Handle changes in filters (order or category)
  const handleFilterChange = (filter: { order?: string; categoryValue?: string }) => {
    const { order, categoryValue } = filter;
    if (order !== undefined) setSelectedOrder(order);
    if (categoryValue !== undefined) setSelectedCategory(categoryValue);

    throttledFetchCourses(order ?? selectedOrder, categoryValue ?? selectedCategory);
  };


  const handleFilterToggle = () => {
    setIsFilterOpen((prev) => !prev);
    if (!isFilterOpen) throttledFetchCourses();
  };

  return (
    <header className="w-full z-10 max-w-7xl pt-6 flex flex-row gap-10 justify-end items-start max-md:flex-wrap">

      {isFilterOpen && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ ease: "easeOut", duration: 0.5 }}
          className="w-full flex md:flex-row flex-col justify-end items-end gap-3 text-xl  sm:pt-20 md:pt-0"
        >
          <SelectCurrency />
          <OrderFilter onChangeFilter={(data) => handleFilterChange({ order: data.order })} />
          <CategoryFilter onChangeFilter={(data) => handleFilterChange({ categoryValue: data.categoryValue })} />
        </motion.div>
      )}

      <div className="w-fit flex justify-end items-center gap-4 py-2">
        <SearchInputFilter />

        <motion.button
          className="flex items-center"
          whileTap={{ scale: 0.9 }}
          onClick={handleFilterToggle}
        >
          {isFilterOpen ? (
            <CrossIcon fillColor={theme === "dark" ? "white" : "black"} size={32} />
          ) : (
            <FilterIcon fillColor={theme === "dark" ? "white" : "black"} size={34} />
          )}

          <motion.i
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ ease: [0.7, 0, 0.84, 0], duration: 0.8, delay: 0.4 }}
            className="max-sm:hidden text-2xl font-libre bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          >
            Filter
          </motion.i>
        </motion.button>
      </div>
    </header>
  );
};

export default CoursesNavbar;
