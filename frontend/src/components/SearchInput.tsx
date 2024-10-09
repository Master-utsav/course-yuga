import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { CgSearch } from "react-icons/cg";
import { debounce } from "@/lib/debounce";

interface SearchInputProps {
  onSearch: (searchValue: string) => void; // Callback to parent
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string | null>(null);

  const toggleSearchBar = () => {
    setIsOpen(!isOpen);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilter = useCallback(
    debounce((searchTerm: string) => {
      if (searchTerm) {
        onSearch(searchTerm); // Send search value back to parent
      }
    }, 500),
    [onSearch] // Add onSearch to dependencies to avoid unnecessary re-creations
  );

  const handleSearchBar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedFilter(value);
  };

  return (
    <div className="flex items-center justify-center gap-4 relative">
      <button
        onClick={toggleSearchBar}
        className="flex items-center justify-center absolute right-0 w-12 h-12 rounded-full bg-transparent focus:outline-none"
      >
        <CgSearch className="text-3xl dark:text-violet-200 text-violet-900 animate-pulse" />
      </button>

      <motion.input
        initial={{ width: "3rem" }}
        animate={{ width: isOpen ? "18rem" : "3rem" }}
        transition={{
          duration: 0.8,
          ease: [0.83, 0, 0.17, 1],
          type: "spring",
          stiffness: 200,
          damping: 15,
        }} // Smooth animation
        placeholder={isOpen ? "Search..." : ""}
        onChange={handleSearchBar}
        value={searchValue || ""}
        className="h-12 px-2 py-2 pr-10 border-b-2 border-current text-base font-[Trebuchet MS] placeholder-gray-700 dark:placeholder-gray-400 bg-transparent rounded-lg outline-none dark:text-white text-black"
        name="text"
        type="text"
      />
    </div>
  );
};

export default SearchInput;
