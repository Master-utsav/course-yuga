import { ICourseData } from "@/constants";
import { useCourseContext } from "@/context/courseContext";
import { ErrorToast } from "@/lib/toasts";
import { Select, SelectItem } from "@nextui-org/react";
import React from "react";

const EducatorFilter: React.FC = () => {
  const { coursesData, setupdatedCourseData } = useCourseContext();

  const uniqueEducators = [
    "All",
    ...new Set(coursesData?.map((course) => course.tutorName)),
  ];
  async function handleEducatorChange (educator: string) {
    
    const educatorValue = uniqueEducators[parseFloat(educator)].toString();
  
    try {
        const updatedCourseData: ICourseData[] = coursesData?.filter(
          (course) => course.tutorName === educatorValue
        );
        setupdatedCourseData(updatedCourseData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error.response?.data?.message);
    }
  };

  return (
    <Select
      label="Educator name"
      variant="underlined"
      onChange={(e) => handleEducatorChange(e.target.value)}
      className="w-full focus-visible:border-none focus-visible:outline-none text-xl"
    >
      {uniqueEducators.map((uniqueEducator, index) => (
        <SelectItem key={index} value={uniqueEducator}>
          {uniqueEducator}
        </SelectItem>
      ))}
    </Select>
  );
};

export default EducatorFilter;
