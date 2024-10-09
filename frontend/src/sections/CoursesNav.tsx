import PriceRangeSelector from "@/components/PriceRangeSelector";
import SearchInput from "@/components/SearchInput";
import { courses } from "@/constants";
import { useTheme } from "@/context/ThemeProvider";
import CrossIcon from "@/Icons/CrossIcon";
import FilterIcon from "@/Icons/FilterIcon";
import { Select, SelectItem } from "@nextui-org/react";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface FilterProps {
  educator: string;
  rating: string;
  minPrice: number;
  maaxPrice: number;
  searchValue: string;
}

const CoursesNavbar: React.FC = () => {
  const uniqueTutorNames = [...new Set(courses.map((course) => course.tutorName))];
  const selectRatingData = ["< 1", "< 2", "< 3", "< 4", "< 5", "exact 5"];
  
  const { theme } = useTheme();
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterProps>({
    educator: "",
    rating: "",
    minPrice: 0,
    maaxPrice: 1000,
    searchValue: "",
  });

  const handleEducatorChange = (e: string) => {
    const educatorValueIndex = parseInt(e);
    const educatorValue = uniqueTutorNames[educatorValueIndex];
    setFilter((prevFilter) => ({
        ...prevFilter,
        educator: educatorValue,
      }));
  };
  const handleRatingChange = (e: string) => {
    const ratingValueIndex = parseInt(e);
    const ratingValue = selectRatingData[ratingValueIndex];
    setFilter((prevFilter) => ({
        ...prevFilter,
        rating: ratingValue,
      }));
  };
  const handleSearchFilterData = (searchData: string) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      searchValue: searchData,
    }));
  };
  const handleOnPriceChange = (price : number[]) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      minPrice: price[0],
      maaxPrice: price[1],
    }));
  }

  console.log(filter); 

  return (
    <header className="w-full z-10 max-w-7xl pt-6 flex flex-row gap-10 justify-end items-center overflow-y-hidden relative">
      {isFilterOpen ? (
        <motion.div
          initial={{ y: 200, rotate: 20, opacity: 0.2 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: 200, rotate: 20, opacity: 0.2 }}
          transition={{ ease: "easeOut", duration: 0.2 }}
          className="w-full flex flex-row justify-start items-end gap-3 overflow-y-hidden overflow-x-hidden relative text-xl"
        >
          <Select
            label="Educator name"
            variant="underlined"
            onChange={(e) => handleEducatorChange(e.target.value)}
            className="w-full focus-visible:border-none focus-visible:outline-none text-xl"
          >
            {uniqueTutorNames.map((uniqueTutorName, index) => (
              <SelectItem key={index} value={index.toString()}>
                {uniqueTutorName}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Rating"
            variant="underlined"
            onChange={(e) => handleRatingChange(e.target.value)}
            className="w-full focus-visible:border-none focus-visible:outline-none"
          >
            {selectRatingData.map((rating, index) => (
              <SelectItem key={index} value={index.toString()}>
                {rating}
              </SelectItem>
            ))}
          </Select>
          <div className="w-full flex justify-end items-end ">
            <PriceRangeSelector onPrice={handleOnPriceChange} />
          </div>
        </motion.div>
      ) : (
        ""
      )}

      <div className="w-fit flex justify-end items-center gap-4 py-2">
        {/* Pass the callback to handle search value changes */}
        <SearchInput onSearch={handleSearchFilterData} />
        <motion.button
          className="flex justify-center items-end"
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          {isFilterOpen ? (
            <CrossIcon fillColor="rgb(189 , 11 , 67)" size={32} />
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
            className="text-2xl font-libre font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 scroller-none"
          >
            Filter
          </motion.i>
        </motion.button>
      </div>
    </header>
  );
};

export default CoursesNavbar;
