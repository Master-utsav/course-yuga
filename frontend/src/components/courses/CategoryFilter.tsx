import { ErrorToast } from "@/lib/toasts";
import { Select, SelectItem } from "@nextui-org/react";
import React from "react";

const CategoryFilter: React.FC = () => {

  const categoryFilterValues = [
    "Youtube",
    "Course Yuga",
    "Others"

  ];
  async function handleCategoryChange (category: string) {
    
    const categoryValue = categoryFilterValues[parseFloat(category)].toString();
  
    try {
        console.log(categoryValue);
        // const updatedCourseData: ICourseData[] = coursesData?.filter(
        //   (course) => course.tutorName === categoryValue
        // );
        // setupdatedCourseData(updatedCourseData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error.response?.data?.message);
    }
  };

  return (
    <Select
      label="Select category"
      variant="underlined"
      onChange={(e) => handleCategoryChange(e.target.value)}
      className="max-w-[10rem] focus-visible:border-none focus-visible:outline-none text-xl"
    >
      {categoryFilterValues.map((uniqueCategory, index) => (
        <SelectItem key={index} value={uniqueCategory}>
          {uniqueCategory}
        </SelectItem>
      ))}
    </Select>
  );
};

export default CategoryFilter;
