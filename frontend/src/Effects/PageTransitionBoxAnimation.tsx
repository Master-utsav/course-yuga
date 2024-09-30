import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "../lib/utils";
// import Navbar from "../sections/Navbar";

interface PageTransitionProps {
  children: ReactNode;
  routeName?: string;
  className? : string;
}
const anim = (variants: Variants) => {
  return {
    initial: "initial",
    animate: "enter",
    exit: "exit",
    variants,
  };
};

const opacity: Variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
  },
  exit: {
    opacity: 1,
  },
};

const slide: Variants = {
  initial: {
    top : "100vh",
  },
  enter: {
    top: "100vh",
  },
  exit: {
    top: "0vh",
    transition: {
      duration: 1,
      ease : [0.76, 0, 0.24, 1]
    }
  },
}

const perspective: Variants = {
  initial: {
    y: 0,
    scale: 1,
    opacity: 1,
  },
  enter: {
    y: 0,
    scale: 1,
    opacity: 1,
  },
  exit: {
    y: -100,
    scale: 0.7,
    opacity: 0.3,
    transition: {
      duration: 1.4,
      ease : [0.76, 0, 0.24, 1]
    }
  },
}

const PageTransitionBoxAnimation = ({ children , className = "bg-black" }: PageTransitionProps) => {

  return (
    <div className="inner ">
      <motion.div  {...anim(slide)} className={cn("fixed top-0 left-0 w-[100vw] h-[100vh] z-50 text-center flex justify-center items-center text-black text-5xl font-bold font-noto-sans", className)}/>
        <motion.div  {...anim(perspective)}>
          <motion.div  {...anim(opacity)}>
            {/* <Navbar/> */}
            {children}
          </motion.div>
        </motion.div>
    </div>
  );
};

export default PageTransitionBoxAnimation;

