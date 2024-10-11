import FavoriteIcon from "@/Icons/FavoriteIcon";
import { motion } from "framer-motion";
import React from "react";

const VideoCard: React.FC = () => {
    
  const videoData = {
    title: "Tu Hain Toh",
    tutorName: "Hunny, Bunny, Sagar",
    description: "Watch the lyrical video of the song 'Tu Hain Toh' and enjoy the beautiful composition.",
    videoUrl: "https://www.youtube.com/embed/tOSDRojm63o?list=RDGMEMQ1dJ7wXfLlqCjwV0xfSNbAVMWpEp3p5067c",
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-5"
      initial="hidden"
      animate="visible"
    >
      {/* Video Card */}
      <motion.div
        className="w-full relative bg-white text-start dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Video Content */}
        <div className="relative w-full">
          {/* Responsive iframe video */}
          <div className="relative aspect-video">
            <iframe
              className="w-full h-full rounded-tr-[6rem] p-2"
              src={videoData.videoUrl}
              title={videoData.title}
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share z-10"
              allowFullScreen
            ></iframe>
            <iframe
              className="w-full h-full rounded-tr-[6rem]  p-0 absolute inset-0 -z-10 "
              style={{filter : "blur(30px)"}}
              src={videoData.videoUrl}
              title={videoData.title}
              frameBorder={2}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
            <label
            className="absolute cursor-pointer top-2 right-2"
          >
            <FavoriteIcon
              fillColor={"none"}
            />
          </label>
          </div>

          {/* Video Information */}
          <div className="p-3 space-y-2">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              {videoData.title}
            </h2>

            <h4 className="text-lg text-gray-600 dark:text-white font-ubuntu">
              {videoData.tutorName}
            </h4>

            <i className="text-gray-600 dark:text-gray-400 text-sm font-extralight font-libre line-clamp-3">
              {videoData.description}
            </i>

            <div className="flex justify-between items-center mt-4">
              <motion.button
                className="w-full font-medium text-lg font-ubuntu bg-blue-500 text-white hover:bg-blue-600 py-2 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open(videoData.videoUrl, "_blank")}
              >
                Play Now
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VideoCard;
