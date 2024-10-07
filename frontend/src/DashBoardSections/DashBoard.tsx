import PageTransitionSwipeAnimation from "@/Effects/PageTransitionSwipeAnimation";
import StaggeredBlurTextEffect from "@/Effects/StaggeredBlurTextEffect";
import { motion } from "framer-motion";

const DashBoard = () => {
  console.log("DashBoard rendered");
  return (
    <PageTransitionSwipeAnimation>
      {/* <motion.div
        className="dark:bg-white/5 bg-black/5 rounded-lg p-6 shadow-2xl dark:shadow-sm dark:shadow-white border-2 dark:border-white border-black"
        variants={{
          hidden: { opacity: 0.3, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 }
        }}
        transition={{ duration: 0.3 }}
      >
      </motion.div> */}
      <div className="font-libre dark:text-white/90 text-black flex gap-1 text-[56px]">
      {
      "Welcome, ".split("").map((char, i) => (
        <motion.i
          initial={{fontSize : "18px" , fontWeight: "100" , opacity: 0.2 , letterSpacing: 2}}
          animate={{fontSize : "56px" , fontWeight: "600" , opacity : 1 , letterSpacing : 0}}
          transition={{ duration: 0.7, delay: 0.1 * i , type :  "spring" , damping : "20" , stiffness: "200" }}
          key={i}
          
        >
          {char}
        </motion.i>
      ))
      }
      <span className="px-2 dark:text-gray-400">
        <StaggeredBlurTextEffect text="Utsav" className="font-sans font-semibold" delayNumber={0.3} />
      </span>

      </div>
    </PageTransitionSwipeAnimation>
  );
};

export default DashBoard;
