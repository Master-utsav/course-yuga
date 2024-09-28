import React from 'react';
import { motion } from 'framer-motion';

interface TextSmoothVerticalBounceEnterEffectProps {
  text: string;
}

const TextBorderCutEffect: React.FC<TextSmoothVerticalBounceEnterEffectProps> = ({ text }) => {
  const displayText = text.split('');

  return (
    <span
      style={{
        display: 'inline-block',
        position: 'relative',
        overflow: 'hidden', 
        paddingBottom: '4px', 
      }}
    >
      {displayText.map((char, index) => (
        <motion.span
          key={index}
          initial={{ y: char === ' ' ? 0 : 200 }} // Start below the container
          animate={{ y: 0 }} // Animate to its final position
          transition={{
            duration: 0.5,
            delay: index * 0.05, // Stagger effect
            type: 'spring', // Adds a slight bounce for a better effect
            stiffness: 80,
            damping: 15,
          }}
          style={{
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal', // Maintain spacing
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

export default TextBorderCutEffect;
