import { ErrorToast } from "@/lib/toasts";
import { Select, SelectItem } from "@nextui-org/react";
import {AllCountryCurrency as SelectCurrencyValue} from "@/constants/index"
import React from "react";

const SelectCurrency: React.FC = () => {

  async function handleCategoryChange (category: string) {
    
    const currencyValue = SelectCurrencyValue[parseFloat(category)].toString();
  
    try {
        console.log(currencyValue);
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
      label="Select currency"
      variant="underlined"
      onChange={(e) => handleCategoryChange(e.target.value)}
      className="max-w-[10rem] focus-visible:border-none focus-visible:outline-none text-xl"
    >
      {SelectCurrencyValue.map((currency, index) => (
        <SelectItem key={index} value={currency}>
          {currency}
        </SelectItem>
      ))}
    </Select>
  );
};

export default SelectCurrency;
