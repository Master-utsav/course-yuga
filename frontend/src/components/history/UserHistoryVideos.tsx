/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useCallback, useState } from "react";
import { IVideoData } from "@/constants";
import { Button, Image } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { getVerifiedToken } from "@/lib/cookieService";
import axios from "axios";
import { USER_API } from "@/lib/env";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import Seperator from "../Seperator";
import YoutubeIcon from "@/Icons/YoutubeIcon";
import { useTheme } from "@/context/ThemeProvider";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: (i: number) => ({
    opacity: 1,
    scale: 1,
    x: i * -500,
    filter: "blur(8px)",
  }),
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    x: 0,
    transition: {
      delay: i * 0.2,
      ease: [0.7, 0, 0.84, 0],
    },
  }),
};

const UserHistoryVideos: React.FC<{ history: { video: string; time: string }[] } > = ({ history }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [videoData, setVideoData] = useState<IVideoData[] | []>([]);

  // Format the time difference
  function formatTimeDifference(dateString: string) {
    const timestamp = new Date(dateString).getTime();
    const currentTime = Date.now();
  
    if (isNaN(timestamp) || timestamp > currentTime) {
      return "Just now";
    }
  
    const seconds = Math.floor((currentTime - timestamp) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
  
  // Fetch video data from the backend based on video IDs in userData.history
  const getUserHistory = useCallback(async () => {
    const jwt = getVerifiedToken();
    try {
      const videoIds = history.map((item) => item.video);
      const response = await axios.post(
        `${USER_API}/get-user-history`,
        { videoIds },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response && response.data && response.data.success) {
        setVideoData(response.data.videos); // Assuming response.data.videos is an array of IVideoData
      } else {
        ErrorToast(response.data.message || "Failed to fetch video data");
      }
    } catch (error: any) {
      ErrorToast(error?.response?.data?.message || "Something went wrong");
    }
  }, [history]);

  // Call getUserHistory on component mount
  useEffect(() => {
    getUserHistory();
  }, [getUserHistory]);

  // Delete video from history
  async function confirmDelete(videoId: string) {
    const jwt = getVerifiedToken();
    try {
      const response = await axios.post(
        `${USER_API}/delete-user-history-video`,
        { videoId },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response && response.data && response.data.success) {
        SuccessToast(response.data.message);
        setVideoData((prev) => prev.filter((video) => video.videoId !== videoId)); // Remove deleted video from state
      } else {
        ErrorToast(response.data.message || "Failed to delete video");
      }
    } catch (error: any) {
      ErrorToast(error?.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <motion.div 
      className="w-full relative" 
      initial="hidden"
      animate="visible"
    >
      {history.slice().reverse().map((item, i) => {
        const video = videoData.find((video) => video.videoId === item.video);
        if (!video) return null; // Skip rendering if video data is not loaded

        return (
          <motion.div className="w-full relative flex flex-col py-1" key={i}  custom={i} variants={cardVariants}>
            <Seperator text={formatTimeDifference(item.time)} />
            <div className="w-full h-auto flex md:flex-row flex-col gap-2 justify-start items-center relative px-2">
              <div className="md:w-1/4 w-full">
                <Image
                  isBlurred
                  src={video.thumbnail}
                  alt="course-img"
                  className="z-0 object-cover p-2 aspect-video"
                />
              </div>
              <div className="flex flex-col justify-between items-start space-y-4 md:w-1/2 w-full relative">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  {video.videoName}
                </h2>
                <h4 className="text-lg text-gray-600 dark:text-white font-ubuntu">
                  {video.tutorName}
                </h4>
                <i className="w-full text-gray-600 dark:text-gray-400 text-sm font-extralight font-libre line-clamp-3s break-words">
                  {video.description}
                </i>
                <div className="flex justify-start items-center gap-2">
                  {video.watchCount}
                  <span className="font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    views
                  </span>
                </div>
              </div>
              <div className="flex flex-col space-y-4 text-base font-medium font-ubuntu justify-end md:w-1/4 w-full max-md:px-2 items-center">
                <Button
                  className="
                    w-full py-3 font-ubuntu text-base font-medium 
                    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                    shadow-md hover:shadow-lg transition-all duration-300
                    hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500
                    text-white"
                  onClick={() => navigate(`/user/video-player?v=${video.videoId}`)}
                >
                  <YoutubeIcon fillColor={theme === "dark" ? "white" : "black"} /> Watch Now
                </Button>
                <Button
                  className="w-full py-3 font-ubuntu text-base font-medium 
                    bg-red-300/50 dark:bg-red-500/50 
                    hover:bg-red-400 hover:dark:bg-red-600
                    transition-colors duration-300 shadow-md hover:shadow-lg
                    text-black dark:text-white/80"
                  onClick={() => confirmDelete(video.videoId)}
                >
                  Remove from history
                </Button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default UserHistoryVideos;
