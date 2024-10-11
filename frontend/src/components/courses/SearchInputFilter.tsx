import React, { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CgSearch } from "react-icons/cg";
import { debounce } from "@/lib/debounce";
import { useCourseContext } from "@/context/courseContext";
import { ErrorToast } from "@/lib/toasts";

const SearchInputFilter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const { coursesData, setupdatedCourseData } = useCourseContext();
  const inputFocus = useRef<HTMLInputElement>(null);
  // Fetch courses based on the search term
  async function fetchCoursesData(searchTerm: string) {
    
    try {
      const updatedCourseData = coursesData.filter((course) =>
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) 
      );
      setupdatedCourseData(updatedCourseData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error.response?.data?.message);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilter = useCallback(
    debounce((searchTerm: string) => {
      if (searchTerm) {
        fetchCoursesData(searchTerm);
      }
    }, 500),
    [coursesData] 
  );

  const handleSearchBar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedFilter(value);
  };

  const handleSearchClick = () => {
    setSearchValue(null); 
    setIsOpen(!isOpen); 
    if (!isOpen && inputFocus.current) {
      setTimeout(() => {
        inputFocus.current?.focus();
      }, 400);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearchClick(); 
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 relative">
    
      <button
        onClick={handleSearchClick}
        className="flex items-center justify-center absolute right-0 w-12 h-12 rounded-full bg-transparent focus:outline-none"
      >
        <CgSearch className="text-3xl dark:text-violet-200 text-violet-900 animate-pulse" />
      </button>

      <motion.input
        initial={{ width: "3rem" }}
        ref={inputFocus}
        animate={{ width: isOpen ? "18rem" : "3rem" }} 
        transition={{
          duration: 0.8,
          ease: [0.83, 0, 0.17, 1],
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        placeholder={isOpen ? "Search..." : ""}
        onChange={handleSearchBar}
        value={searchValue || ""} 
        className="h-12 px-2 py-2 pr-10 border-b-2 border-current text-base font-[Trebuchet MS] placeholder-gray-700 dark:placeholder-gray-400 bg-transparent rounded-lg outline-none dark:text-white text-black"
        name="text"
        type="text"
        onKeyDown={handleKeyPress} 
      />
    </div>
  );
};

export default SearchInputFilter;
