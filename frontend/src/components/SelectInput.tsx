import { countryName } from "@/constants";
import {Select, SelectItem} from "@nextui-org/react";

interface SelectInputProps{
    label: string
}

const SelectInput: React.FC<SelectInputProps> = ({label}) => {

  return (
    <div className="w-full flex flex-col gap-4">
        <div key={"bordered"} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
          <Select 
            variant={"bordered"}
            label={label} 
            className="max-w-sm focus-visible:border-none focus-visible:outline-none" 
          >
            {countryName.map((name , index) => (
              <SelectItem key={index}>
                {name}
              </SelectItem>
            ))}
          </Select>
        </div>
    </div>  
  );
}

export default SelectInput;