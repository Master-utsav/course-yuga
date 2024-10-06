import AlertIcon from "@/Icons/AlertIcon";
import CheckIcon from "@/Icons/CheckIcon";
import WarningIcon from "@/Icons/WarningIcon";
import { Chip } from "@nextui-org/react";

interface StatusFieldProps {
  inputValue: string;
  isInputVerified: boolean;
  type: "email" | "mobile" | "dob" | "address";
  countryCode?: string;
}
const StatusField: React.FC<StatusFieldProps> = ({
  inputValue,
  isInputVerified,
  type,
  countryCode,
}) => {
  const isInputEmpty: boolean = inputValue.trim() !== "";
  const inputValueNumber = type === "mobile" && isInputEmpty ? "X".repeat(inputValue.length - 4) + inputValue.slice(-4) : inputValue;
  console.log(inputValueNumber)
  return (
    <div className="w-[calc(50% - 2%) flex justify-between flex-row items-center gap-2 relative">
      <div
        className={`p-1 pl-2  border-b-[1px] rounded-xl text-sm  text-black dark:text-white w-3/4 text-start font-ubuntu`}
      >
        <span className="text-sm font-semibold dark:text-white/60 text-black/60">
          {type === "email"
            ? "Email : "
            : type === "dob"
            ? "DOB : "
            : countryCode
            ? `${countryCode} `
            : type === "address"
            ? "Address : "
            : "Contact : "}
        </span>
        {!isInputEmpty
          ? type === "email"
            ? "update your email now"
            : type === "dob"
            ? "update your date of birth"
            : type === "address"
            ? "update your address"
            : "update your mobile no."
          : type === "mobile" ? inputValueNumber :  inputValue}
      </div>

      {isInputEmpty ? (
        isInputVerified ? (
          <Chip
            startContent={<CheckIcon fillColor="green" size={14} />}
            variant="faded"
            color="success"
            className="font-ubuntu text-xs"
          >
            {(type === "dob" || type === "address") ? "Submitted" : "Verified"}
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
