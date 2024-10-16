import UserCourses from '@/components/addVideos/UserCourses'
import VideoHeader from '@/components/addVideos/VideoHeader'
import { VideoContextProvider } from '@/context/videoContext'
import { motion } from 'framer-motion'
import React from 'react'

const AddVideos = () => {

  return (
    <VideoContextProvider>
        <motion.div
        className="w-full bg-white dark:bg-gray-800 min-h-screen"
        variants={{
            hidden: { opacity: 0.3, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 }
        }}
        transition={{ duration: 0.3 }}
        >
        <VideoHeader/>
        <UserCourses/>
        </motion.div>
    </VideoContextProvider>
  )
}

export default AddVideos
