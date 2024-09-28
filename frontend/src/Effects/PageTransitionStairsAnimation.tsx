import {  motion, Variants } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "../lib/utilts";

interface PageTransitionProps {
  children: ReactNode;
  routeName?: string;
  className? : string;
  stairsCount? : number;
}

const anim = (variants: Variants , custom : number) => {
  return {
    initial: "initial",
    animate: "enter",
    exit: "exit",
    variants,
    custom,
  };
};


const expand = {
    initial : {
        top: 0,
    },
    enter: (i: number) => ({
        top: "100%",
        transition: {
            duration : 0.5,
            delay : 0.05 * i
        },
        transitionEnd: {
            height: "0%",
            top: "0%",
            zIndex: -1,
        }
    }),
    exit : (i: number) => ({
        height: "100%",
        transition: {
            duration : 0.5,
            delay : 0.05 * i
        },
    })
}


const PageTransitionStairsAnimation = ({ children , className = "bg-black" , stairsCount = 5}: PageTransitionProps) => {
  
  return (
    <div>
      <motion.div  className="flex fixed w-[100vw] h-[100vh] top-0 right-0 z-10">
            {
                [...Array(stairsCount)].map((_ , i) => {
                    return (
                        <motion.div {...anim(expand , stairsCount - i)} key={i} className={cn("h-full w-full relative" , className )}/>
                    )
                })
            }
      </motion.div>
      {children}
    </div>
  );
};

export default PageTransitionStairsAnimation;
