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
      className="w-[40%] py-3 pr-6 bg-black text-white text-xl dark:bg-white dark:text-black rounded-3xl font-semibold shadow-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-all relative font-ubuntu"
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
        className="rounded-full animate-pulse bg-white dark:bg-black p-3 size-10 absolute right-3 top-[0.40rem] bottom-0 flex items-center justify-center"
      >
        {theme === 'dark' ? <RightArrowIcon fillColor="white" size={18} /> : <RightArrowIcon fillColor="black" size={18} />}
      </motion.div>
    </motion.button>
  );
};

export default GetStartedAnimatedBtn;
