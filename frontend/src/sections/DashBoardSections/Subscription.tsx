import UserEnrolledCourses from '@/components/subscription/UserEnrolledCourses';
import TextFlipSmoothRevealEffect from '@/Effects/TextFlipSmoothRevealEffect';
import { motion } from 'framer-motion';

const Subscription = () => {
    console.log('subscrip rendered');
  return (
      <motion.div
        className="dark:bg-white/5 bg-black/5 rounded-lg p-6 "
        variants={{
          hidden: { opacity: 0.3, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 }
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="  flex justify-center items-center text-center gap-2 overflow-hidden">
          <TextFlipSmoothRevealEffect text="ENROLLMENTS" className="sm:text-5xl text-3xl"/>
        </div>
        <UserEnrolledCourses/>
      </motion.div>
  )
}

export default Subscription
