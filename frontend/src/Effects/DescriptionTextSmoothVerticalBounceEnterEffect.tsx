import React from 'react';
import { motion } from 'framer-motion';

interface TextSmoothVerticalBounceEnterEffectProps {
  text: string;
}

const DescriptionTextSmoothVerticalBounceEnterEffect: React.FC<TextSmoothVerticalBounceEnterEffectProps> = ({ text }) => {
  const displayText = text.split(''); 

  return (
    <span style={{ display: 'inline-block' , overflow : "hidden"}}>
      {displayText.map((char, index) => (
        <motion.span
          key={index}
          initial={{ y: char === ' ' ? 0 : 200 }} 
          animate={{ y: 0 }} 
          transition={{
            duration: 0.5,
            delay: index * 0.01, 
          }}
          style={{
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal', 
          }}
        >
          {char === ' ' ? '\u00A0' : char} 
        </motion.span>
      ))}
    </span>
  );
};

export default DescriptionTextSmoothVerticalBounceEnterEffect;
