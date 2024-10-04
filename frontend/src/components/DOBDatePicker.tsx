import {DatePicker} from "@nextui-org/react";

export default function DOBDatePicker() {
  return (
    <div className="w-1/2 max-w-xl flex flex-row gap-4">
      <DatePicker
        label="Birth Date"
        variant="bordered"
        showMonthAndYearPickers
      />
    </div>
  );
}