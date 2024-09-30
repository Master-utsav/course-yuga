import { motion } from "framer-motion";

const HeroRightSection = () => {
  return (
    <section className="w-full h-[90vh] flex flex-col justify-center items-center relative px-5">
      {/* Add some floating elements */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{
          scale: 1,
          y: [0, -10, 0], // Floating effect (up and down)
        }}
        transition={{
          duration: 3, // Time it takes to complete one floating cycle
          repeat: Infinity, // Infinite loop
          repeatType: "reverse", // Reverses back to the original position
          ease: "easeInOut", // Smooth transition
        }}
        className="absolute top-10 right-10 p-5 text-lg rounded-full cursor-pointer bg-purple-500 text-white shadow-lg dark:shadow-white-500/60"
        >
        Join our Learning Platform!
      </motion.div>

      {/* Hero Image with subtle floating animation */}
      <motion.img
        src="images/hero-section-right-image.png"
        alt="Girl Studying Image"
        className="w-[90%] max-w-xl rounded-xl shadow-lg object-cover dark:shadow-white-500/60"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1,
          delay: 0.5,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.05 }} // Zoom effect on hover
        whileTap={{ scale: 0.95 }} // Slight shrink effect on click
      />

      {/* Some interesting text that animates in */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 1.5,
          delay: 0.2,
          ease: "easeOut",
        }}
        whileHover={{ scale: 1.05 }}
        className="absolute bottom-16 right-10 p-4 bg-white dark:bg-black dark:text-white dark:shadow-white-500/60 text-black/90 rounded-full shadow-lg"
      >
        <p className="font-semibold text-xl">
          "Master new skills and boost your career with us!"
        </p>
      </motion.div>
    </section>
  );
};

export default HeroRightSection;
