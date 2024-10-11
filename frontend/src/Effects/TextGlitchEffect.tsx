import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import styles from '@/sass/TextGlitchEffect.module.scss'; // Import SCSS module

const glitchKeyframes = {
  initial: { x: 0, y: 0, skewX: 0, color: "#fff", opacity: 1 },
  glitch1: {
    x: [-2, 2, -2],
    y: [-2, 2, -2],
    skewX: [-5, 5, -5],
    opacity: [1, 0.8, 1],
    color: ["#ff0000", "#00ff00", "#0000ff", "#fff"], // Glitchy colors
    transition: {
      duration: 0.2,
      ease: "easeInOut",
      repeat: 2, // The number of glitches
    },
  },
  reset: {
    x: 0,
    y: 0,
    skewX: 0,
    opacity: 1,
    color: "#fff", // Back to normal color
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const TextGlitchEffect: React.FC<{ text: string }> = ({ text }) => {
  const controls = useAnimation();

  useEffect(() => {
    // Start the glitch effect on mount
    controls.start("glitch1").then(() => controls.start("reset"));
  }, [controls]);

  return (
    <motion.i className={styles.glitchContainer} animate={controls} initial="initial" variants={glitchKeyframes}>
      <span className={styles.glitchText} data-text={text}>{text}</span>
    </motion.i>
  );
};

export default TextGlitchEffect;
