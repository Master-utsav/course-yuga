import SelectorIcon from "@/Icons/SelectorIcon";
import { Select, SelectItem } from "@nextui-org/react";
import React from "react";

interface ChangeRoleProps {
  theme: string;
}
const ChangeRole: React.FC<ChangeRoleProps> = ({ theme }) => {
  return (
    <Select
      label=""
      placeholder="Change your Role"
      labelPlacement="outside"
      className="w-1/2 max-w-xl flex flex-row gap-4 border-2 rounded-md dark:border-white/20 border-black/40 py-1"
      style={{ background: "transparent" }}
      disableSelectorIconRotation
      selectorIcon={
        theme === "dark" ? (
          <SelectorIcon fillColor="gray" />
        ) : (
          <SelectorIcon fillColor="gray" />
        )
      }
    >
      {["Student", "Admin"].map((role, index) => (
        <SelectItem key={index} className="w-full">
          {role}
        </SelectItem>
      ))}
    </Select>
  );
};

export default ChangeRole;

// export default function App() {
//   return (
//     <div className="flex gap-4">
//       <Chip
//         endContent={<NotificationIcon size={18} />}
//         variant="flat"
//         color="secondary"
//       >
//         Chip
//       </Chip>
//     </div>
//   );
// }
