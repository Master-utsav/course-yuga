import { useAuthContext } from '@/context/authContext'
import UnauthorizedOwnerPage from "@/components/UnauthorizedOwnerPage"
import React from 'react'
import {motion} from "framer-motion"
import TextFlipSmoothRevealEffect from  "@/Effects/TextFlipSmoothRevealEffect";
import SelectVerifyCoursesCategory from "@/components/verifyCourses/SelectVerifyCoursesCategory"

const VerifyCourses: React.FC = () => {
  const {userData} = useAuthContext();
  const [category , setCategory] = React.useState("Unverified Videos");

  function handleCategoryChange(category : string){
    setCategory(category);
  }

  return (
    <div className="min-h-screen h-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-300 lg:py-12 lg:pt-24 relative overflow-x-hidden px-2 py-4 pt-40 md:pt-56">
        {userData.role === "MASTER" ?  (
            <motion.div
            className="w-full relative dark:bg-white/5 bg-black/5 rounded-lg p-4 sm:p-6 space-y-6 "
            variants={{
              hidden: { opacity: 0.3, scale: 0.8 },
              visible: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.8 }
            }}
            transition={{ duration: 0.3 }}
          >
          <div className="  flex justify-center items-center text-center gap-2 overflow-hidden">
            <TextFlipSmoothRevealEffect text="COURSE VERIFICATION" className="sm:text-3xl text-xl"/>
          </div>
          <SelectVerifyCoursesCategory onCategory={handleCategoryChange}  currentCategory={category}/>
          </motion.div>
        )
        : (
            <UnauthorizedOwnerPage />
        )
        }
    </div> 
  )
}

export default VerifyCourses
