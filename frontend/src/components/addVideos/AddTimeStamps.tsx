import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTheme } from "@/context/ThemeProvider";
import AddIcon from "@/Icons/AddIcon";
import MinusIcon from "@/Icons/MinusIcon";
import { Button, Input } from "@nextui-org/react";
import { useState} from "react";

export interface TimeStamp {
  time: string;
  text: string;
}

interface AddTimeStampsProps {
  timeStamps: TimeStamp[];
  onTimeStamps: (timeStamps: TimeStamp[]) => void;
}

const AddTimeStamps: React.FC<AddTimeStampsProps> = ({ timeStamps, onTimeStamps }) => {
    console.log(timeStamps);
  const { theme } = useTheme();
  const [stamps, setStamps] = useState<TimeStamp[]>(timeStamps);

  const handleOnAddTimeStamps = () => {
    // Add a new empty timestamp field
    const newStamp: TimeStamp = { time: "", text: "" };
    const updatedStamps = [...stamps, newStamp];
    setStamps(updatedStamps);
    onTimeStamps(updatedStamps); // Propagate change to parent component
  };

  const handleInputChange = (index: number, key: keyof TimeStamp, value: string) => {
    // Update specific field in the timestamp
    const updatedStamps = [...stamps];
    updatedStamps[index][key] = value;
    setStamps(updatedStamps);
    onTimeStamps(updatedStamps); // Propagate change to parent component
  };

  const handleRemoveTimeStamp = () => {
    const updatedStamps = stamps.slice(0 , -1);
    setStamps(updatedStamps);
    onTimeStamps(updatedStamps);
  };

  return (
    <div className="w-full relative py-2 gap-1">
      <h1 className="text-center font-bold underline decoration-purple-500 text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        Add your Video TimeStamps
      </h1>
      <Table >
        <TableHeader>
          <TableRow className="hover:bg-transparent flex py-2">
            <TableHead className="text-start flex justify-between items-center w-full border-r-[1px] dark:border-white border-black">
              Time of that stamp
              <Button isDisabled variant="ghost" className="text-blue-400 p-0">
                00:00
              </Button>
            </TableHead>
            <TableHead className="text-start flex justify-between items-center w-full ">
              Title of that stamp
              <Button isDisabled variant="ghost" className="text-blue-400 p-0">
                Intro
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <div className="w-full relative flex flex-col">
          {stamps.map((stamp, i) => (
            <div key={i} className="w-full flex py-1 gap-2">
              <Input
                variant="bordered"
                className="bg-transparent"
                label="Time"
                value={stamp.time}
                onChange={(e) => handleInputChange(i, "time", e.target.value)}
              />
              <Input
                variant="bordered"
                className="bg-transparent"
                label="Text"
                value={stamp.text}
                onChange={(e) => handleInputChange(i, "text", e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="w-full relative flex flex-col gap-2 mt-4">
            <Button
                variant="bordered"
                className="w-full flex gap-1 justify-center items-center font-ubuntu font-medium text-lg dark:border-white border-black"
                onClick={handleOnAddTimeStamps}
                >
                <AddIcon fillColor={theme === "dark" ? "white" : "black"} />
                Add
            </Button>
            <Button
                variant="bordered"
                color="danger"
                className=" w-full flex gap-1 bg-red justify-center text-red-500 items-center font-ubuntu font-medium text-lg border-red-500"
                onClick={handleRemoveTimeStamp}
                >
                <MinusIcon fillColor={"rgb(239 68 68)"} />
                {"  "}  Remove
            </Button>
        </div>
        
      </Table>
    </div>
  );
};

export default AddTimeStamps;
