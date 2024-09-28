import React from "react";
import { motion } from "framer-motion";

interface MasterBeams {
  bgColor?: string;
  lightRay1?: string;
  lightRay2?: string;
  lightRay3?: string;
  children?: React.ReactNode;
}

const LightRay: React.FC<MasterBeams> = ({
  bgColor = "#ffffff",
  lightRay1 = "#ff0000",
  lightRay2 = "#00ff00",
  lightRay3 = "#0000ff",
  children,
}) => {
  const rayVariants = {
    initial: {
      opacity: 0.99,
      y: "-10%",
      x: "-300%",
      rotate: 25,
      scale: 1,
    },
    animate: {
      opacity: 0.99,
      y: "-10%",
      x: "300%",
      rotate: 20,
      scale: 3,
      transition: {
        duration: 5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse" as const, // Reverses the animation back to initial
      },
    },
  };

  return (
    <div className="relative w-full h-full overflow-hidden z-10 rounded-xl">
      {/* Light Rays */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute bottom-0 left-[50%] w-[220px] h-[200%] blur-[20px]"
          style={{
            background: `radial-gradient(circle, ${bgColor} 10%, ${lightRay1} 100%)`,
          }}
          variants={rayVariants}
          initial="initial"
          animate="animate"
        />

        <motion.div
          className="absolute top-[0%] left-[20%] w-[120px] h-[200%] blur-[30px]"
          style={{
            background: `radial-gradient(circle, ${bgColor} 10%, ${lightRay2} 100%)`,
          }}
          variants={rayVariants}
          initial="initial"
          animate="animate"
        />

        <motion.div
          className="absolute top-[-10%] right-[0%] w-[220px] h-[200%] blur-[30px]"
          style={{
            background: `radial-gradient(circle, ${bgColor} 10%, ${lightRay2} 100%)`,
          }}
          variants={rayVariants}
          initial="initial"
          animate="animate"
        />

        <motion.div
          className="absolute top-0 right-[0%] w-[200px] h-[200%] blur-[20px]"
          style={{
            background: `radial-gradient(circle, ${bgColor} 10%, ${lightRay3} 100%)`,
          }}
          variants={rayVariants}
          initial="initial"
          animate="animate"
        />
      </div>

      {children}
    </div>
  );
};

export default LightRay;
