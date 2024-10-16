import React from 'react'
import { motion } from 'framer-motion'
import PersonalVideoForm from './PersonalVideoForm'
import YoutubeVideoForm from './YoutubeVideoForm'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { VIDEO_API } from '@/lib/env'
import { ErrorToast } from '@/lib/toasts'
import { IVideoData } from '@/constants'
import VideoCard from './VideoCard'
import VideoHeader from './VideoHeader'

const ManageVideos = () => {

  const [category , setCategory] = React.useState<string>("")
  const [videosData , setVideosData] = React.useState<IVideoData[]>([]);
  const [refresh , setRefresh] = React.useState<boolean>(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get("courseId");
  const courseName = queryParams.get("name");
    
  const handleOnCategory = (data : string) => {
    setCategory(data)
  }

  const fetchAllVideosOfCourseId = React.useCallback(async() => {
    if(!courseId){
      return;
    }
    
    try {
      const response = await axios.get(`${VIDEO_API}/get-videos?courseId=${courseId}`)
      if(response && response.data && response.data.success){
        if(Array.isArray(response.data.videos)){
          setVideosData(response.data.videos);
        }
        setRefresh(false);
      }
      else{
        ErrorToast(response.data.message);
        setVideosData([])
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error?.response.data.message || "Something went wrong");
      setVideosData([])
    }

  }, [courseId])

  React.useEffect(() => {
    fetchAllVideosOfCourseId();
  } , [fetchAllVideosOfCourseId , refresh]);

  const handleRefresh = (fresh : boolean) => {
    setRefresh(fresh);
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
       <VideoHeader onCategory={handleOnCategory} courseId={courseId} courseName={courseName}/>

      {category === "Personal Video" && <PersonalVideoForm />}
      {category === "YouTube Video" && <YoutubeVideoForm  courseId={courseId} onRefresh={handleRefresh} courseName={courseName}/>}
      {videosData.length === 0 && (
            <div className="flex flex-col justify-center items-center gap-4 p-6 bg-yellow-100 border border-yellow-300 rounded-md shadow-md">
                <p className="text-lg font-ubuntu text-center text-yellow-800">
                Oops! It seems like you haven't uploaded any video yet. <br />
                <span className="font-bold">
                    Add a video first to start gaining users attention and enrich your learning platform!
                </span>
                </p>
            </div>
        )}
       {videosData.length !== 0 &&
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-5 px-3'>
          {videosData.map((video , i) => (
                <VideoCard key={i} video={video} onRefresh={handleRefresh} />
          ))}
        </div>
       }
    </motion.div>
  )
}

export default ManageVideos
