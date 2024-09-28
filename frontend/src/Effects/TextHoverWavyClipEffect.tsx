import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface HoverEffectWrapperProps {
  text: string;
  isHovered: boolean;
}

const TextHoverWavyClipEffect: React.FC<HoverEffectWrapperProps> = ({ text, isHovered }) => {
  const maskRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (maskRef.current) {
      const mask = maskRef.current;

      gsap.set(mask, { 
        position: "absolute", 
        width: "2%", 
        height: "100%", 
        rotate: "0deg",
        color: "white",
        x: "0%", 
        y: "0%",
        top: "0%", 
        left: "0%", 
        bottom: "0%",
        backgroundColor: "rgba(228 228 230 )",
        //  backdropFilter: "blur(10px)",
        //  mixBlendMode: "difference",
        transformOrigin: "top left", 
        zIndex: 1 
      });
  

      if (isHovered) {
        gsap.to(mask, { 
            x: "0%", 
            y: "0%",
            height: "500%",
            width: "500%",
            rotate: "-90deg", 
            duration: 0.1, 
            ease: "power2.out"
        });
      } else {
        gsap.to(mask, { 
            x: "0%", 
            y: "0%",
            height: "500%",
            width: "500%",
            rotate: "180deg", 
            duration: 0.1, 
            ease: "power2.out"
        });
      }
    }
  }, [isHovered]);
  
  return (
    <>
      <span className="hidden mask sm:block backdrop-blur-xl -z-10 " ref={maskRef}></span>
      {text}
    </>
  );
};

export default TextHoverWavyClipEffect;
