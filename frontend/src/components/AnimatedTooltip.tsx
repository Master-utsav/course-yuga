import React from "react";
import { motion, useTransform, useMotionValue, useSpring } from "framer-motion";

const AnimatedTooltip = ({
  items,
}: {
  items: {
    id: number;
    userProfileLink: string;
    userName: string;
    image: string;
    courseName: string;
  }[];
}) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); 

  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );

  return (
    <>
      {items.map((item, idx) => (
        <div
          className="-mr-4  relative group"
          key={item.userName ||idx}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {hoveredIndex === item.id && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 10,
                },
              }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              style={{ translateX: translateX, rotate: 0, whiteSpace: "nowrap", 
              }}
              className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs flex-col items-center justify-center  bg-black z-50 shadow-xl px-4 py-2 rounded-3xl"
            >
              <div
                className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px"
                style={{
                  position: "absolute",
                  left: 10,
                  bottom: -1,
                  width: "20%",
                  zIndex: 30,
                }}
              />
              <div
                className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px"
                style={{
                  position: "absolute",
                  left: 10,
                  bottom: -1,
                  width: "40%",
                  zIndex: 30,
                }}
              />
              <div className="font-bold text-white relative z-30 text-base">
                {item.userName}
              </div>
              {item.courseName ? (
                <div className="text-white text-xs">{item.courseName}</div>
              ) : ""}
              
            </motion.div>
          )}
          <a href={item.userProfileLink} target="_blank">
            <img
              height={100}
              width={100}
              src={item.image}
              alt={item.userName}
              className="object-cover !m-0 !p-0 object-top rounded-full h-14 w-14 border-2 group-hover:scale-105 group-hover:z-30 border-white  relative transition duration-500"
            />
          </a>
        </div>
      ))}
    </>
  );
};

export default AnimatedTooltip