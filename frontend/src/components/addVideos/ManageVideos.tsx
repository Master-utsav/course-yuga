import React from 'react'
import ManageVideosHeader from './ManageVideosHeader'
import { motion } from 'framer-motion'

const ManageVideos = () => {

  const [category , setCategory] = React.useState<string>("")

  const handleOnCategory = (data : string) => {
    setCategory(data)
  }
  
  return (
    <motion.div
        className="w-full bg-white dark:bg-gray-800 min-h-screen"
        variants={{
            hidden: { opacity: 0.3, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 }
        }}
        transition={{ duration: 0.3 }}
        >
       <ManageVideosHeader onCategory={handleOnCategory}/>
    </motion.div>
  )
}

export default ManageVideos
