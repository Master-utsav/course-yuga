import { motion } from "framer-motion";
import React from "react";

interface StaggeredBlurTextEffect{
  text: string
}

const StaggeredBlurTextEffect: React.FC<StaggeredBlurTextEffect> = ({text}) => {
  const textArray = text.split("").map((char, index) => (
    <motion.span
      key={index}
      initial={{ opacity: 0, scale: 1.5, filter: "blur(2px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0)",}}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={char === " " ? "whitespace-pre" : ""}
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
