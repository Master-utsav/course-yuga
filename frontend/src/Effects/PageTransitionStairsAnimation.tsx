import { motion, Variants, AnimatePresence } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";
import { cn } from "../lib/utils";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  stairsCount?: number;
}

const anim = (variants: Variants, custom: number) => ({
  initial: "initial",
  animate: "enter",
  exit: "exit",
  variants,
  custom,
});

const expand = {
  initial: {
    height: "100%", // Full height initially
    top: 0,
  },
  enter: (i: number) => ({
    top: "100%", // Slide down to disappear
    transition: {
      duration: 0.5,
      delay: 0.05 * i,
    },
    transitionEnd: {
      height: "0%", // Collapse after animation
      top: 0,
      zIndex: -1, // Push to back once completed
    },
  }),
  exit: (i: number) => ({
    height: "100%", // Expand back for exit animation
    top: "-100%", // Slide up to disappear
    transition: {
      duration: 0.5,
      delay: 0.05 * i,
    },
  }),
};

const PageTransitionStairsAnimation = ({
  children,
  className = "bg-black",
  stairsCount = 5,
}: PageTransitionProps) => {
  const [isAnimating, setIsAnimating] = useState(true); // Track initial animation

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), stairsCount * 0.05 * 1000 + 500);
    return () => clearTimeout(timer); // Cleanup
  }, [stairsCount]);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {isAnimating && (
          <motion.div className="flex fixed w-[100vw] h-[100vh] top-0 left-0 z-10">
            {[...Array(stairsCount)].map((_, i) => (
              <motion.div
                {...anim(expand, stairsCount - i)}
                key={i}
                className={cn("h-full w-full", className)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {!isAnimating && children} 
    </div>
  );
};

export default PageTransitionStairsAnimation;
