import React from 'react'
import {motion} from "framer-motion"
import { cn } from '@/lib/utils';

interface TextFlipSmoothRevealEffectProps{
    text: string;
    className?: string;
}
const characterVariants = {
    initial: { scaleX: -1, opacity: 0 },
    animate: (i: number) => ({
      scaleX: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1, 
        duration: 2,
        ease: "easeOut",
      },
    }),
  };
const TextFlipSmoothRevealEffect: React.FC<TextFlipSmoothRevealEffectProps> = ({text , className}) => {
  return (
    <div className="flex">
          {text.split("").map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={characterVariants}
              initial="initial"
              animate="animate"
              className={cn("text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" , className)}
            >
              {char}
            </motion.span>
          ))}
        </div>
  )
}

export default TextFlipSmoothRevealEffect
