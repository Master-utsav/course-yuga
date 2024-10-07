import { motion } from 'framer-motion'

const modalVariants = {
  hidden: { opacity: 0.3, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

const HelpSection = () => {
  return (
    <section className='w-full h-screen fixed inset-0 flex items-center justify-center bg-white dark:bg-black  backdrop-blur-lg transition-opacity duration-300'>
      <motion.div
        className="dark:bg-white/5 bg-black/5 rounded-lg p-6 shadow-2xl dark:shadow-sm dark:shadow-white border-2 dark:border-white border-black"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
      >

        this is the Help & SupportPage Page
    </motion.div>
    </section>
  )
}

export default HelpSection
