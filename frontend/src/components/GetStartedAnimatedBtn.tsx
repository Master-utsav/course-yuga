import { motion } from 'framer-motion';
import RightArrowIcon from '../Icons/RightArrowIcon';
import React from 'react';
import { useTheme } from '@/context/ThemeProvider';

interface GetStartedAnimatedBtnProps {
  BtnText: string;
}

const GetStartedAnimatedBtn: React.FC<GetStartedAnimatedBtnProps> = ({ BtnText }) => {
    const {theme} = useTheme();
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      className="sm:w-[40%] w-[60%] sm:py-3 sm:pr-6 py-2 bg-black text-white sm:text-xl text-lg dark:bg-white dark:text-black rounded-3xl font-semibold shadow-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-all relative font-ubuntu"
    >
      <span>{BtnText}</span>
      
      {/*// ? This animtion didnt working so i passed the animate-pulse */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: [0, 10, 0], scale: [1, 1.1, 1] }} // Increased x values for more noticeable movement
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: 1.5,
          type: 'spring', // Use spring physics
          stiffness: 200,  // Increased stiffness for a snappier effect
          damping: 8,  // Reduced damping for more bounce
        }}
        className="sm:flex hidden rounded-full animate-pulse bg-white dark:bg-black p-3 size-10 absolute right-3 top-[0.40rem] bottom-0 items-center justify-center"
      >
        {theme === 'dark' ? <RightArrowIcon fillColor="white" size={18} /> : <RightArrowIcon fillColor="black" size={18} />}
      </motion.div>
    </motion.button>
  );
};

export default GetStartedAnimatedBtn;
