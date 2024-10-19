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
                onPaste={i === 0 ? handlePaste : undefined} // handel the paste function on this pootion
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
        <div>
          <div className="flex flex-wrap gap-3">
              <Button  
                variant="bordered" 
                color="warning" 
                onPress={() => onOpen()}
                className="w-full font-ubuntu"
              >
              Paste your TimeStamps, <span className="font-bold">view formate which is required to paste the timestamps</span>
              </Button>
          </div>
          <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              {(onClose) => (
                <div>
                  <ModalHeader className="flex flex-col gap-1">Formate of TimeStamp</ModalHeader>
                  <ModalBody>
                  <ul className="space-y-2 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
                    <li className="flex justify-start text-lg text-gray-800 dark:text-gray-200">
                      <span>00:00 - Introduction</span>
                    </li>
                    <li className="flex justify-start text-lg text-gray-800 dark:text-gray-200">
                      <span>00:05 - Compilation Process</span>
                    </li>
                    <li className="flex justify-start text-lg text-gray-800 dark:text-gray-200">
                      <span>02:27 - Thanks Message</span>
                    </li>
                    <li className="flex justify-start text-lg text-gray-800 dark:text-gray-200">
                      <span>02:39 - Promotion</span>
                    </li>
                    <li className="flex justify-start text-lg text-gray-800 dark:text-gray-200">
                      <span>03:30 - Compiler & IDE Setup</span>
                    </li>
                    <li className="flex justify-start text-lg text-gray-800 dark:text-gray-200">
                      <span>06:32 - Start of Program in C++</span>
                    </li>
                    <li className="flex justify-start text-lg text-gray-800 dark:text-gray-200">
                      <span>08:47 - Writing "Namaste Dunia" Program</span>
                    </li>
                    <li className="flex justify-start text-lg text-gray-800 dark:text-gray-200">
                      <span>09:48 - Understanding the Code Line by Line</span>
                    </li>
                    <li className="flex justify-start text-lg text-gray-800 dark:text-gray-200">
                      <span>16:33 - Data Types & Variables</span>
                    </li>
                    <li className="flex justify-start text-lg text-gray-800 dark:text-gray-200">
                      <span>26:41 - How Data is Stored?</span>
                    </li>
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
        </div>
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
