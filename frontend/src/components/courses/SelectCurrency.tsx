// import { ErrorToast } from "@/lib/toasts";
import { Modal, ModalContent, ModalHeader, Select, SelectItem , useDisclosure } from "@nextui-org/react";
import {AllCountryCurrency as SelectCurrencyValue} from "@/constants/index"
import React from "react";

const SelectCurrency: React.FC = () => {
  const {onClose , isOpen , onOpen} = useDisclosure();
  const [selectedCurrency , setSelectedCurrency] = React.useState<string>("")

  function handleCurrencyChange (currency: string) {
    
    const currencyValue = SelectCurrencyValue[parseFloat(currency)].toString();
    setSelectedCurrency(currencyValue);
    onOpen();
  
    // try {
    //     console.log(currencyValue);
    //     // const updatedCourseData: ICourseData[] = coursesData?.filter(
    //     //   (course) => course.tutorName === categoryValue
    //     // );
    //     // setupdatedCourseData(updatedCourseData);
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // } catch (error: any) {
    //   ErrorToast(error.response?.data?.message);
    // }
  };

  return (
    <>
    <Select
      label="Select currency"
      variant="underlined"
      onChange={(e) => handleCurrencyChange(e.target.value)}
      className=" focus-visible:border-none focus-visible:outline-none text-xl"
    >
      {SelectCurrencyValue.map((currency, index) => (
        <SelectItem key={index} value={currency}>
          {currency}
        </SelectItem>
      ))}
    </Select>
    <Modal backdrop="opaque" isOpen={isOpen} onClose={onClose}>
    <ModalContent className="sm:max-w-[480px] p-2 shadow-lg rounded-lg dark:bg-gray-800 bg-white">
      <ModalHeader className="flex flex-col gap-1">
        <div className="w-full space-x-2 flex justify-start items-center">
          <span className="font-ubuntu text-2xl font-bold text-green-700 dark:text-green-400">
            API Call limit exceed's
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-base mt-2">
          Sorry, we can't able to convert all price as per
          <span className="font-bold font-libre text-red-400">{" "}{selectedCurrency}</span>, rates.
        </p>
      </ModalHeader>
      </ModalContent>
      </Modal>
    </>
    
  );
};

export default SelectCurrency;
