import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

interface LogoProps{
    theme : string,
    className: string,
}
const Logo: React.FC<LogoProps> = ({theme , className}) => {
  return (
    <div className="flex items-center justify-between space-x-2">
      <Link to="/" className="">
        {theme === "dark" ? (
          <motion.img
            initial={{ opacity: 0.5, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            src="/images/course-yuga-logo-dark-mode-5.png"
            alt="cryptoBag"
            className={cn(`object-cover w-32` , className)}
          />
        ) : (
          <motion.img
            initial={{ opacity: 0.5, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            src="/images/course-yuga-logo-light-mode-5.png"
            alt="cryptoBag"
            className={cn(`object-cover w-32 ` , className)}
          />
        )}
      </Link>
    </div>
  );
};

export default Logo;
