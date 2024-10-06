import AlertIcon from "@/Icons/AlertIcon";
import CheckIcon from "@/Icons/CheckIcon";
import WarningIcon from "@/Icons/WarningIcon";
import { Chip } from "@nextui-org/react";

interface StatusFieldProps {
  inputValue: string;
  isInputVerified: boolean;
  type: "email" | "mobile" | "dob" ;
}
const StatusField: React.FC<StatusFieldProps> = ({
  inputValue,
  isInputVerified,
  type,
}) => {
  const isInputEmpty: boolean = inputValue.trim() !== "";

  return (
    <div className="w-[calc(50% - 5%) flex justify-between flex-row items-center gap-2 relative">
      <input
        type="text"
        placeholder={
          !isInputEmpty
            ? type === "email"
              ? "update your email now"
              : type === "dob"
              ? "update your date of birth"
              : "update your mobile number now"
            : inputValue
        }
        className={`p-1 pl-2  border rounded-xl text-sm  text-black dark:text-white w-3/4 text-start`}
        disabled={true}
      />
      {isInputEmpty ? (
        isInputVerified ? (
          <Chip
            startContent={<CheckIcon fillColor="green" size={14} />}
            variant="faded"
            color="success"
            className="font-ubuntu text-xs"
          >
            {type === "dob" ? "Submitted" : "Verified" }
          </Chip>
        ) : (
          <Chip
            startContent={<WarningIcon fillColor="rgb(202 138 4)" size={14} />}
            variant="faded"
            color="warning"
            className="font-ubuntu text-yellow-600 text-xs"
          >
            Please Verify
          </Chip>
        )
      ) : (
        <Chip
          startContent={<AlertIcon fillColor="red" size={14} />}
          variant="faded"
          color="danger"
          className="font-ubuntu text-red-600 text-xs"
        >
          Update Now
        </Chip>
      )}
    </div>
  );
};

export default StatusField;
