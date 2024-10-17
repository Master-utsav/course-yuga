import ManageVideos from '@/components/addVideos/ManageVideos'
import { VideoContextProvider } from '@/context/videoContext'
import { motion } from 'framer-motion'

const AddVideos = () => {

  return (
    <VideoContextProvider>
        <motion.div
        className="w-full relative bg-white dark:bg-gray-800 min-h-screen"
        variants={{
            hidden: { opacity: 0.3, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 }
        }}
        transition={{ duration: 0.3 }}
        >
        <ManageVideos/>
        </motion.div>
    </VideoContextProvider>
  )
}

export default AddVideos
