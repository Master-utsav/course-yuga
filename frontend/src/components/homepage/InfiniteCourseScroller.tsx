import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeProvider';
import MiniCard from '@/components/ui/mini-card';
import { educatorsInfiniteScrollData } from '@/constants';


const InfiniteCourseScroller: React.FC = () => {
    const {theme} = useTheme()
  return (
    <div className="relative overflow-hidden w-full dark:bg-black bg-white">
      {/* Faded gradient effect */}
      <div
        className="absolute top-0 bottom-0 left-0 z-10"
        style={{
          width: '100px',
          background: theme === 'dark' ? 'linear-gradient(to right, black, transparent)' : 'linear-gradient(to right, white, transparent)',
        }}
      />
      <div
        className="absolute top-0 bottom-0 right-0 z-10"
        style={{
          width: '100px',
          background: theme === 'dark' ? 'linear-gradient(to left, black, transparent)' : 'linear-gradient(to left, white, transparent)',
        }}
      />

      {/* Scrolling container */}
      <motion.div
        className="flex space-x-4 "
        animate={{ x: ['0%', '-100%'] }} 
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: educatorsInfiniteScrollData.length * 2,
          ease: 'linear',
        }}
      >
        {educatorsInfiniteScrollData.map((edu, index) => (
          <div key={index} className="flex-shrink-0">
            <MiniCard {...edu} />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default InfiniteCourseScroller;
