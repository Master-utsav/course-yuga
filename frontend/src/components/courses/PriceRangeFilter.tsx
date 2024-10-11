import { useState, useCallback } from "react";
import { Slider } from "@nextui-org/react";
import { debounce } from "@/lib/debounce";
import { ErrorToast } from "@/lib/toasts";
import { useCourseContext } from "@/context/courseContext";

const PriceRangeFilter = () => {
  const [value, setValue] = useState<number | number[]>([10, 300]);
  const { coursesData, setupdatedCourseData } = useCourseContext();
  async function fetchCourseData (price: [number, number]) {
    try {
      const updatedCourseData = coursesData.filter(
        (course) =>
          course.sellingPrice >= price[0] && course.sellingPrice <= price[1]
      );
      setupdatedCourseData(updatedCourseData);
      //Todo: fetch the data as params of price range params => minPrice , maxPrice
      //? response set to courses of courseContext
    
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error.response?.data?.message);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilter = useCallback(
    debounce((price: [number, number]) => {
      fetchCourseData(price);
    }, 500),
    [coursesData]
  );
 
  const handleChange = (newValue: number | number[]) => {
    setValue(newValue);
    debouncedFilter(newValue as [number, number]);
  };

  return (
    <div className="w-full flex justify-end items-end">
      <Slider
        label="Select a price range"
        color="foreground"
        size="sm"
        showSteps={true}
        formatOptions={{ style: "currency", currency: "USD" }}
        step={10}
        maxValue={1000}
        minValue={0}
        value={value}
        onChange={handleChange} 
        className="font-ubuntu text-sm w-full"
      />
    </div>
  );
};

export default PriceRangeFilter;
