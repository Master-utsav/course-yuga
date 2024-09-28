import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TextHoverJumbledAnimationEffectProps {
  text: string;
  isHovered: boolean;
}

const randomCharacter = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:"<>?~';
  return characters[Math.floor(Math.random() * characters.length)];
};

const TextHoverJumbledAnimationEffect: React.FC<TextHoverJumbledAnimationEffectProps> = ({ text, isHovered }) => {
  const [displayText, setDisplayText] = useState<string[]>(text.split(''));

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    if (isHovered) {
      // Start jumbling the text with random characters
      intervalId = setInterval(() => {
        setDisplayText((prevText) =>
          prevText.map(() => randomCharacter())
        );
      }, 50);

      // After 0.5 seconds, reset to original text
      timeoutId = setTimeout(() => {
        clearInterval(intervalId!);
        setDisplayText(text.split('')); // Reset to original text
      }, 500);
    } else {
      // Reset to original text when hover is removed
      clearInterval(intervalId!);
      clearTimeout(timeoutId!);
      setDisplayText(text.split(''));
    }

    // Cleanup the intervals and timeouts
    return () => {
      clearInterval(intervalId!);
      clearTimeout(timeoutId!);
    };
  }, [isHovered, text]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'inline-block' }}
    >
      {displayText.map((char, index) => (
        <motion.span
          key={index}
          initial={{ y: 0 }}
          animate={{ y: [20, 0] }} // Small bouncing effect
          transition={{
            duration: 0.5,
            delay: index * 0.05, // Stagger effect for smooth transitions
          }}
          style={{ display: 'inline-block' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default TextHoverJumbledAnimationEffect;
