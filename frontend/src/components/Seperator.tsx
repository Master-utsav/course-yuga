import { cn } from "@/lib/utils";
import React from "react";

interface SeperatorProps {
  text: string;
  className?: string;
}
const Seperator: React.FC<SeperatorProps> = ({ text , className}) => {
  return (
    <div className={cn("flex items-center justify-center my-4" , className)}>
      <div className="h-px border-black/40 dark:border-gray-300/20 w-full rounded-xl border-dotted border-[1px]"></div>
      <span className="px-3  whitespace-nowrap dark:text-white/60 text-black/60  text-center font-semibold font-ubuntu text-base">
        {text}
      </span>
      <div className="h-px border-black/40 dark:border-gray-300/20 w-full rounded-xl border-dotted border-[1px]"></div>
    </div>
  );
};

export default Seperator;
