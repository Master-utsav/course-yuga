import React from "react";
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

const CoursesNavbar: React.FC = () => {
  const { theme } = useTheme();
  const [isFilterOpen, setIsFilterOpen] = React.useState<boolean>(false);
  const { setCoursesData } = useCourseContext();

  // Updated to handle both order and category in a single function
  const handleFilterParams = async (order: string, category: string) => {
    try {
      const response = await axios.get(`${COURSE_API}/get-course-filter`, {
        params: {
          order: order,
          category: category,
        },
      });

      if (response && response.data && response.data.success) {
        setCoursesData(response.data.data);
      } else {
        ErrorToast(response.data.message || "Error fetching filtered courses");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error.response?.data?.message || "Error fetching courses");
    }
  };

  // Use states to hold selected filter values
  const [selectedOrder, setSelectedOrder] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");

  const handleOrderChange = (data: { order: string }) => {
    const orderValue = data.order;
    setSelectedOrder(orderValue);
    handleFilterParams(orderValue, selectedCategory); // Call API when order changes
  };

  const handleCategoryChange = (data: { categoryValue: string }) => {
    const categoryValue = data.categoryValue;
    setSelectedCategory(categoryValue);
    
    // Map categories to filter values
    let category = "";
    switch (categoryValue) {
      case "Youtube":
        category = "YOUTUBE";
        break;
      case "Course Yuga":
        category = "PERSONAL";
        break;
      case "Others":
        category = "REDIRECT";
        break;
      default:
        category = ""; // Handle default case if needed
    }
    
    handleFilterParams(selectedOrder, category); // Call API when category changes
  };

  return (
    <header className="w-full z-10 max-w-7xl pt-6 flex flex-row gap-10 justify-between items-end overflow-y-hidden relative">
      <SelectCurrency />
      {isFilterOpen && (
        <motion.div
          initial={{ y: 30, rotate: 0, opacity: 1 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: 50, rotate: 0, opacity: 1 }}
          transition={{ ease: "easeOut", duration: 0.5 }}
          className="w-full flex flex-row justify-end items-end gap-3 overflow-y-hidden overflow-x-hidden relative text-xl"
        >
          <OrderFilter onChangeFilter={handleOrderChange} />
          <CategoryFilter onChangeFilter={handleCategoryChange} />
        </motion.div>
      )}

      <div className="w-fit flex justify-end items-center gap-4 py-2">
        <SearchInputFilter />
        <motion.button
          className="flex justify-center items-end"
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          {isFilterOpen ? (
            <CrossIcon
              fillColor={theme === "dark" ? "white" : "black"}
              size={32}
            />
          ) : (
            <FilterIcon
              fillColor={theme === "dark" ? "white" : "black"}
              size={34}
            />
          )}
          <motion.i
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ ease: [0.7, 0, 0.84, 0], duration: 0.8, delay: 0.4 }}
            className="text-2xl font-libre font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          >
            Filter
          </motion.i>
        </motion.button>
      </div>
    </header>
  );
};

export default CoursesNavbar;
