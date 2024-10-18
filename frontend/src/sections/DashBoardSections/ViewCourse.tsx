import { Avatar, AvatarImage } from '@/components/ui/avatar';
import UserVideoCard from '@/components/UserVideoCard';
import { IVideoData } from '@/constants';
import { useAuthContext } from '@/context/authContext';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import React from "react";
import axios from 'axios';
import { VIDEO_API } from '@/lib/env';
import { ErrorToast } from '@/lib/toasts';
import { Button } from '@nextui-org/react';
import TextFlipSmoothRevealEffect from '@/Effects/TextFlipSmoothRevealEffect';
import SmileIcon from '@/Icons/SmileIcon';
import { useTheme } from '@/context/ThemeProvider';


const ViewCourse: React.FC = () => {
  const {userData} = useAuthContext();
  const [videos , setVideos] = React.useState<IVideoData[] | []>([]);
  const location = useLocation();
  const {theme} = useTheme();

  const fetchVideos = React.useCallback(async(courseId : string) => {
    if(!courseId) return;
    try {
        const response = await axios.get(`${VIDEO_API}/get-videos?courseId=${courseId}`)
        if(response && response.data && response.data.success){
            setVideos(response.data.videos);
        }
        else{
            ErrorToast(response.data.message);
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        ErrorToast(error?.response.data.message || "Something went wrong")
    }
  } , [])

  React.useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const courseId = queryParams.get("courseId"); 
    if(courseId){
        fetchVideos(courseId);
    }
  } , [fetchVideos, location.search])

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
        <motion.div className="flex items-center gap-3 mb-5 px-2">
        <Avatar className="border-2 border-purple-500">
            <AvatarImage src={userData.profileImageUrl} />
            <AvatarFallback className="font-bold text-xl dark:text-black dark:bg-white text-white bg-black">
            {userData.avatarFallbackText}
            </AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-semibold font-libre bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ">
          <span className="text-3xl font-medium font-ubuntu">
            Good to see you
          </span>
          ,{" "}
          <TextFlipSmoothRevealEffect text={`${userData.firstName}`} endsWith={<SmileIcon fillColor={theme === "dark" ? 'white' : "black"}/>} className="text-3xl font-libre underline" />
        </h1>
      </motion.div>
      <motion.div className="flex items-center gap-3 mb-5 px-2">
      <i>
            {`We're excited to have you here. You’ve made great progress so far, and
        your journey continues with the courses you’ve enrolled in. Keep up the
        fantastic work as you explore and master new skills in your current
        courses. Let's dive into learning and achieve your goals!`}
          </i>
      </motion.div>
      {videos.length === 0 && (
        <div className="w-full flex flex-col justify-center items-center gap-4 p-6 bg-yellow-100 border border-yellow-300 rounded-md shadow-md">
            <p className="text-lg font-ubuntu text-center text-yellow-800">
            Oops! It seems like you haven't uploaded any video yet. <br />
            <span className="font-bold">
                Add a video first to start gaining users attention and enrich your learning platform!
            </span>
            <br />
            </p>
            <Link to={"/user/dashboard"} className='w-full flex justify-end items-end'>
            <Button >Back to Course</Button>
            </Link>
        </div>
      )}
      <UserVideoCard videos={videos} />
    </motion.div>
  )
}

export default ViewCourse
