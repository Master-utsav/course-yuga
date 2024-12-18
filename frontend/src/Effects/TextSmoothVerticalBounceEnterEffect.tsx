import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextSmoothVerticalBounceEnterEffectProps {
  text: string;
  className?: string;
}

const TextSmoothVerticalBounceEnterEffect: React.FC<TextSmoothVerticalBounceEnterEffectProps> = ({ text , className}) => {
  const displayText = text.split(''); 

  return (
    <span style={{ display: 'inline-block' }} >
      {displayText.map((char, index) => (
        <motion.span
          key={index}
          initial={{ y: char === ' ' ? 0 : 20 }} 
          animate={{ y: 0 }} 
          transition={{
            duration: 0.5,
            delay: index * 0.05, 
          }}
          style={{
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal', 
          }}
          className={cn("" , className)}
        >
          {char === ' ' ? '\u00A0' : char} 
        </motion.span>
      ))}
    </span>
  );
};

export default TextSmoothVerticalBounceEnterEffect;
