import { useCourseContext } from "@/context/courseContext";
import { ErrorToast } from "@/lib/toasts";
import { Select, SelectItem } from "@nextui-org/react";
import React from "react";

const RatingFilter: React.FC = () => {
  const {coursesData , setCoursesData} = useCourseContext();
  const selectRatingData = ["below 1", "below 2", "below 3", "below 4", "below or exact 5"];
  
  async function handleRatingChange (rating: string) {
    const ratingThreshold = parseFloat(rating.replace("below or exact", "").replace("below", "").trim());
    
    try {
        if(ratingThreshold){
           const updatedCourseData = coursesData.filter((course) => course.rating <= ratingThreshold);
           setCoursesData(updatedCourseData);
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        ErrorToast(error.response?.data?.message);
    }
  };

  return (
    <Select
      label="Rating"
      variant="underlined"
      onChange={(e) => handleRatingChange(e.target.value)}
      className="w-full focus-visible:border-none focus-visible:outline-none"
    >
      {selectRatingData.map((rating, index) => (
        <SelectItem key={index} value={rating}>
          {rating}
        </SelectItem>
      ))}
    </Select>
  );
};

export default RatingFilter;
