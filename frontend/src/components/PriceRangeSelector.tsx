import React, { useState, useCallback } from "react";
import { Slider } from "@nextui-org/react";
import { debounce } from "@/lib/debounce";

interface PriceRangeSelectorProps {
  onPrice: (price: number[]) => void; 
}

const PriceRangeSelector: React.FC<PriceRangeSelectorProps> = ({ onPrice }) => {
  const [value, setValue] = useState<number | number[]>([100, 300]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilter = useCallback(
    debounce((price: [number, number]) => {
      onPrice(price); 
    }, 500),
    [onPrice] 
  );

  // Handle changes in the slider and debounce them before sending to parent
  const handleChange = (newValue: number | number[]) => {
    setValue(newValue);
    debouncedFilter(newValue as [number, number]);
  };
  return (
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
      onChange={handleChange} // Call handleChange when slider value changes
      className="font-ubuntu text-sm w-full"
    />
  );
};

export default PriceRangeSelector;
