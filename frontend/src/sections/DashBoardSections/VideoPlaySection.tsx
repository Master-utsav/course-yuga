import { IVideoData } from '@/constants';
import { VIDEO_API } from '@/lib/env';
import { ErrorToast } from '@/lib/toasts';
import { Accordion, AccordionItem, Button } from '@nextui-org/react';
import axios from 'axios';
import { motion } from 'framer-motion'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';


const extractYouTubeVideoId = (url: string) => {
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=))([^&?/\s]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

const VideoPlaySection = () => {

  const [videoId , setVideoId] = React.useState<string | null>(null);
  const [videoData , setVideoData] = React.useState<IVideoData | null>();

  const location = useLocation();
  const navigate = useNavigate();
  
  const fetchVideoById = React.useCallback(async() => {
    if (!videoId) return;
    
    try {
        const response = await axios.get(`${VIDEO_API}/get-video-by-id?videoId=${videoId}`)
        if(response && response.data && response.data.success){
            setVideoData(response.data.video);
        }
        else{
            ErrorToast(response.data.message);
            setVideoData(null);
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        ErrorToast(error?.response.data.message || "Something went wrong");
        setVideoData(null);
    }
    
  } , [videoId])

  React.useEffect(() => {
    const querySeachParams = new URLSearchParams(location.search);
    const videoIdFromParams = querySeachParams.get("videoId");
    if(videoIdFromParams !== null){
        setVideoId(videoIdFromParams);
    }
    fetchVideoById();
  }, [fetchVideoById, location.search])

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
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
      {videoData === null ?
       (<div className="w-full flex flex-col justify-center items-center gap-4 p-6 bg-yellow-100 border border-yellow-300 rounded-md shadow-md">
            <p className="text-lg font-ubuntu text-center text-yellow-800">
            Oops! It seems like sever is down and unable to fetch the video. <br />
            <span className="font-bold">
                Try after some time or go back watch another video
            </span>
            <br />
            </p>
            <Button className='w-full' onClick={() => navigate(-1)}>Back to Course</Button>
        </div>
       ):(
        <div className="w-full p-4 grid grid-cols-4 gap-4 relative">
            {/* Main Content */}
            <div className="col-span-3 w-full relative">
                {/* Video Display */}
                <div className="mb-4">
                {videoData?.videoType === "YOUTUBE" ? (
                   <div className='w-full aspect-video rounded-xl dark:bg-gray-700 bg-white-600'>
                       <iframe
                           className="w-full aspect-video rounded-xl"
                           src={`https://www.youtube.com/embed/${extractYouTubeVideoId(videoData.videoUrl)}`}
                           title="YouTube video player"
                           frameBorder="0"
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                           allowFullScreen
                       />
                   </div>
                 
                ) : (
                    <div className="relative">
                        <video
                            ref={videoRef}
                            className="w-full h-auto"
                            src={videoData?.videoUrl}
                        />
                        <button
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg"
                            onClick={handlePlayPause}
                        >
                            {isPlaying ? "Pause" : "Play"}
                        </button>
                    </div>
                )}
                </div>

                {/* Video Information */}
                <div>
                <h1 className="text-2xl font-semibold mb-2">{videoData?.videoName}</h1>
                <div className="flex justify-between w-full items-center mb-4">
                    <h4 className="text-lg font-medium">{videoData?.tutorName}</h4>
                    <p className="text-gray-500">{videoData?.watchCount} views</p>
                </div>

                {/* Video Description Accordion */}
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-5 shadow-inner">
                    <Accordion defaultExpandedKeys={["1"]}>
                    <AccordionItem
                        key="1"
                        aria-label="Accordion 1"
                        subtitle="Video Description"
                        title="Read more about the Video"
                    >
                        <div className="flex items-start gap-3 font-ubuntu">
                        {videoData?.description}
                        </div>
                    </AccordionItem>
                    </Accordion>
                </div>
                </div>
            </div>

            {/* Timestamps */}
            <aside className="col-span-1 w-full">
                <h3 className="text-xl font-semibold mb-3">Timestamps</h3>
                <ul className="space-y-2">
                {videoData && videoData?.videoTimeStamps && videoData.videoTimeStamps.map((timestamp, index) => (
                    <li key={index} className="flex justify-between items-center">
                    <span className="font-medium">{timestamp.time}</span>
                    <span className="text-gray-500">{timestamp.text}</span>
                    </li>
                ))}
                </ul>
            </aside>
            </div>
       )
      }
    
      


      </motion.div>
  )
}

export default VideoPlaySection
