import React from "react";
import { useTheme } from "@/context/ThemeProvider";
import CrossIcon from "@/Icons/CrossIcon";
import FilterIcon from "@/Icons/FilterIcon";
import { motion } from "framer-motion";
// import RatingFilter from "./RatingFilter";
// import EducatorFilter from "./EducatorFilter";
import OrderFilter from "./OrderFilter";
// import PriceRangeFilter from "./PriceRangeFilter";
import SearchInputFilter from "./SearchInputFilter";
import SelectCurrency from "./SelectCurrency";
import CategoryFilter from "./CategoryFilter";

const CoursesNavbar: React.FC = () => {
  const { theme } = useTheme();
  const [isFilterOpen, setIsFilterOpen] = React.useState<boolean>(false);

  return (
    <header className="w-full z-10 max-w-7xl pt-6 flex flex-row gap-10 justify-between items-end overflow-y-hidden relative">
      <SelectCurrency/>
      {isFilterOpen && (
        <motion.div
          initial={{ y: 30, rotate: 0, opacity: 1 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: 50, rotate: 0, opacity: 1 }}
          transition={{ ease: "easeOut", duration: 0.5 }}
          className="w-full flex flex-row justify-end items-end gap-3 overflow-y-hidden overflow-x-hidden relative text-xl"
        >
          <OrderFilter/>
          <CategoryFilter/>
          {/* <EducatorFilter/>
          <RatingFilter/>
          <PriceRangeFilter /> */}
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
