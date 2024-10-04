import AlertIcon from "@/Icons/AlertIcon";
import CheckIcon from "@/Icons/CheckIcon";
import WarningIcon from "@/Icons/WarningIcon";
import { Chip } from "@nextui-org/react";

interface StatusFieldProps{
    inputValue: string;
    isInputVerified: boolean;
    type: "email" | "mobile"
}
const StatusField: React.FC<StatusFieldProps> = ({inputValue , isInputVerified , type}) => {
  const isInputEmpty: boolean = inputValue.trim() !== "";
  
  return (
    <div className="w-1/2 flex justify-between flex-row items-center gap-2">
      <input
        type="text"
        placeholder={!isInputEmpty ? type === "email" ? ("update your email now") : ("update your mobile number now") : inputValue}
        className={`p-2 border rounded-xl  text-black dark:text-white w-3/4`}
        disabled={true}
      />
      {isInputEmpty ? (
        isInputVerified ? (
          <Chip
            startContent={<CheckIcon fillColor="green" size={18} />}
            variant="faded"
            color="success"
            className="font-ubuntu"
          >
            Verified
          </Chip>
        ) : (
          <Chip
            startContent={<WarningIcon fillColor="rgb(202 138 4)" size={18} />}
            variant="faded"
            color="warning"
            className="font-ubuntu text-yellow-600"
          >
            Please Verify
          </Chip>
        )
      ) : (
        <Chip
          startContent={<AlertIcon fillColor="red" size={18} />}
          variant="faded"
          color="danger"
          className="font-ubuntu text-red-600"
        >
          Update Now
        </Chip>
      )}
    </div>
  );
};

export default StatusField;
