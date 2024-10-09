import { useCourseContext } from "@/context/courseContext";
import { ErrorToast } from "@/lib/toasts";
import { Select, SelectItem } from "@nextui-org/react";
import React from "react";

const EducatorFilter: React.FC = () => {
  const { coursesData, setCoursesData } = useCourseContext();
  const courseDataList = [...coursesData];
  const uniqueEducators = [
    "All",
    ...new Set(courseDataList.map((course) => course.tutorName)),
  ];
  async function handleEducatorChange (educator: string) {
    console.log(educator);
    // setFilter((prevFilter) => ({ ...prevFilter, educator }));
    const educatorValue = uniqueEducators[parseFloat(educator)];
    console.log(educatorValue);
    try {
        const updatedCourseData = coursesData.filter(
          (course) => course.tutorName === educator
        );
        setCoursesData(updatedCourseData);
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
