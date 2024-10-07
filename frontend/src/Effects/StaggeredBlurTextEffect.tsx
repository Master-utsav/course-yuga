import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface StaggeredBlurTextEffect{
  text: string
  className?: string
  delayNumber? : number
}

const StaggeredBlurTextEffect: React.FC<StaggeredBlurTextEffect> = ({text , className , delayNumber=0.1}) => {
  const textArray = text.split("").map((char, index) => (
    <motion.span
      key={index}
      initial={{ opacity: 0, scale: 1.5, filter: "blur(2px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0)",}}
      transition={{ delay: index * delayNumber, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(char === " " ? "whitespace-pre" : "" , className) }
    >
      {char}
    </motion.span>
  ));

  return (
    <>
      {textArray}
    </>
  );
};

export default StaggeredBlurTextEffect;
