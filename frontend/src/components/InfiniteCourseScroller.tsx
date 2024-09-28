import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeProvider';

interface InfiniteCourseScrollerProps {
  imageUrls: string[];
}

const InfiniteCourseScroller: React.FC<InfiniteCourseScrollerProps> = ({ imageUrls }) => {
    const {theme} = useTheme()
  return (
    <div className="relative overflow-hidden w-full">
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
        className="flex space-x-4"
        animate={{ x: ['0%', '-100%'] }} // Move from 0% to -100%
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: imageUrls.length * 3, // Adjust speed by number of images
          ease: 'linear',
        }}
      >
        {imageUrls.map((url, index) => (
          <div key={index} className="flex-shrink-0">
            <img
              src={url}
              alt={`scrolling image ${index}`}
              className="h-32 w-32 object-cover" // Same size for all images
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default InfiniteCourseScroller;
