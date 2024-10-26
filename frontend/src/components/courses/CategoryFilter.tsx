import { Select, SelectItem } from "@nextui-org/react";
import React from "react";

interface CategoryFilterProps{
  onChangeFilter: (data : {categoryValue:string}) => void
}
const CategoryFilter: React.FC<CategoryFilterProps> = ({onChangeFilter}) => {

  const categoryFilterValues = [
    "YOUTUBE",
    "PERSONAL",
    "REDIRECT"
  ];
  function handleCategoryChange (category: string) {
    const categoryValue = categoryFilterValues[parseFloat(category)].toString();
    onChangeFilter({categoryValue});
  };

  return (
    <Select
      label="Select category"
      variant="underlined"
      onChange={(e) => handleCategoryChange(e.target.value)}
      className=" focus-visible:border-none focus-visible:outline-none text-xl"
    >
      {categoryFilterValues.map((uniqueCategory, index) => (
        <SelectItem key={index} value={uniqueCategory}>
          {uniqueCategory === "YOUTUBE" ? "Youtube" : uniqueCategory === "PERSONAL" ? "Course Yuga" : "Others" }
        </SelectItem>
      ))}
    </Select>
  );
};

export default CategoryFilter;
