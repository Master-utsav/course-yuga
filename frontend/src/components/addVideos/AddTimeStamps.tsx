import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTheme } from "@/context/ThemeProvider";
import AddIcon from "@/Icons/AddIcon";
import MinusIcon from "@/Icons/MinusIcon";
import {Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import React from "react";


export interface TimeStamp {
  time: string;
  text: string;
}

interface AddTimeStampsProps {
  timeStamps: TimeStamp[];
  onTimeStamps: (timeStamps: TimeStamp[]) => void;
}

const AddTimeStamps: React.FC<AddTimeStampsProps> = ({ timeStamps, onTimeStamps }) => {
  const { theme } = useTheme();
  const [stamps, setStamps] = React.useState<TimeStamp[]>(timeStamps);
  const {isOpen, onOpen, onClose} = useDisclosure();


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

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text");
    const lines = pasteData.split("\n").map(line => line.trim());
    
    const parsedStamps = lines
      .map(line => {
        const [time, ...textParts] = line.split(" - ");
        if (time && textParts.length) {
          return { time: time.trim(), text: textParts.join(" - ").trim() };
        }
        return null;
      })
      .filter((stamp): stamp is TimeStamp => stamp !== null);
 
    if (parsedStamps.length) {
      setStamps(parsedStamps);
      onTimeStamps(parsedStamps);
    }
  };

  return (
    <div className="w-fit overflow-hidden  py-2 gap-1">
      <h1 className="text-center font-bold underline decoration-purple-500 text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        Add your Video TimeStamps
      </h1>
      <Table className="w-fit">
        <TableHeader>
          <TableRow className="hover:bg-transparent justify-center items-center flex flex-col md:flex-row py-2">
            <TableHead className="text-start flex justify-between items-center w-fit md:border-r-[1px] dark:border-white border-black max-md:gap-4">
              Time of that stamp
              <Button isDisabled variant="ghost" className="text-blue-400 p-0">
                00:00
              </Button>
            </TableHead>
            <TableHead className="text-start flex justify-between items-center w-fit max-md:gap-4">
              Title of that stamp
              <Button isDisabled variant="ghost" className="text-blue-400 p-0">
                Intro
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <div className="w-full flex flex-col gap-2">
          {stamps.map((stamp, i) => (
            <div key={i} className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 py-1">
              <Input
                variant="bordered"
                className="w-full bg-transparent"
                label="Time"
                value={stamp.time}
                onChange={(e) => handleInputChange(i, "time", e.target.value)}
                onPaste={i === 0 ? handlePaste : undefined}
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
        <div className="w-full justify-center items-center flex flex-col gap-4 mt-4">
          <Button
            variant="bordered"
            color="warning"
            onPress={onOpen}
            className="md:w-full w-fit font-ubuntu text-sm md:text-base max-md:whitespace-normal"
          >
            Paste your TimeStamps,{" "}
            <span className="font-bold max-md:whitespace-normal">view format required to paste the timestamps</span>
          </Button>
          <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              {(onClose) => (
                <div>
                  <ModalHeader className="flex flex-col gap-1">
                    Format of TimeStamp
                  </ModalHeader>
                  <ModalBody>
                    <ul className="space-y-2 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-sm md:text-base">
                      <li className="text-gray-800 dark:text-gray-200">00:00 - Introduction</li>
                      <li className="text-gray-800 dark:text-gray-200">00:05 - Compilation Process</li>
                      <li className="text-gray-800 dark:text-gray-200">02:27 - Thanks Message</li>
                      <li className="text-gray-800 dark:text-gray-200">02:39 - Promotion</li>
                      <li className="text-gray-800 dark:text-gray-200">03:30 - Compiler & IDE Setup</li>
                      <li className="text-gray-800 dark:text-gray-200">06:32 - Start of Program in C++</li>
                      <li className="text-gray-800 dark:text-gray-200">08:47 - Writing "Namaste Dunia" Program</li>
                      <li className="text-gray-800 dark:text-gray-200">09:48 - Understanding the Code Line by Line</li>
                      <li className="text-gray-800 dark:text-gray-200">16:33 - Data Types & Variables</li>
                      <li className="text-gray-800 dark:text-gray-200">26:41 - How Data is Stored?</li>
                    </ul>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </div>
              )}
            </ModalContent>
          </Modal>
          <Button
            variant="bordered"
            className="w-full flex gap-1 justify-center items-center font-ubuntu font-medium text-sm md:text-lg dark:border-white border-black"
            onClick={handleOnAddTimeStamps}
          >
            <AddIcon fillColor={theme === "dark" ? "white" : "black"} />
            Add
          </Button>
          <Button
            variant="bordered"
            color="danger"
            className="w-full flex gap-1 justify-center items-center font-ubuntu font-medium text-sm md:text-lg border-red-500"
            onClick={handleRemoveTimeStamp}
          >
            <MinusIcon fillColor={"rgb(239 68 68)"} />
            Remove
          </Button>
        </div>
      </Table>
    </div>
  );
};

export default AddTimeStamps;
