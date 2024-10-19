import { IVideoData } from "@/constants";
import { VIDEO_API } from "@/lib/env";
import { ErrorToast } from "@/lib/toasts";
import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VideoPlayer from "@/components/VideoPlayer";
import MDEditor from "@uiw/react-md-editor";
import Seperator from "@/components/Seperator";

const extractYouTubeVideoId = (url: string) => {
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=))([^&?/\s]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

const VideoPlaySection: React.FC = () => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<IVideoData | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false); // Track if player can mount
  const location = useLocation();
  const navigate = useNavigate();
  
  const fetchVideoById = useCallback(async () => {
    if (!videoId) return;

    try {
      const response = await axios.get(
        `${VIDEO_API}/get-video-by-id?videoId=${videoId}`
      );
      if (response?.data?.success) {
        setVideoData(response.data.video);
        setIsPlayerReady(true); // Mark as ready only when video data is fetched
      } else {
        ErrorToast(response.data.message);
        setVideoData(null);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error?.response.data.message || "Something went wrong");
      setVideoData(null);
    }
  }, [videoId]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const videoIdFromParams = queryParams.get("videoId");
    if (videoIdFromParams) setVideoId(videoIdFromParams);
    fetchVideoById();
  }, [fetchVideoById, location.search]);

  return (
    <motion.div
      className="dark:bg-white/5 bg-black/5 rounded-lg p-6"
      variants={{
        hidden: { opacity: 0.3, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
      }}
      transition={{ duration: 0.3 }}
    >
      {videoData === null ? (
        <div className="w-full flex flex-col justify-center items-center gap-4 p-6 bg-yellow-100 border border-yellow-300 rounded-md shadow-md">
          <p className="text-lg font-ubuntu text-center text-yellow-800">
            Oops! It seems like the server is down and unable to fetch the video.{" "}
            <span className="font-bold">
              Try after some time or go back to watch another video.
            </span>
          </p>
          <Button className="w-full" onClick={() => navigate(-1)}>
            Back to Course
          </Button>
        </div>
      ) : (
        <div className="w-full p-4 grid grid-cols-4 gap-4 relative">
          {/* Main Content */}
          <div className="col-span-3 w-full relative">
            {/* Video Display */}
            <div className="mb-4">
              {videoData?.videoType !== "YOUTUBE" ? (
                <div className="w-full aspect-video rounded-xl dark:bg-gray-700 bg-white-600">
                  {isPlayerReady && videoData?.videoUrl ? (
                    <VideoPlayer videoUrl={"/videos/sample.mp4"} />
                  ) : (
                    <div className="flex justify-center items-center">
                      <h1 className="text-2xl dark:text-white text-center w-full mx-auto text-black">
                        Unable to fetch the video.
                      </h1>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full aspect-video rounded-2xl dark:bg-gray-700 bg-white-600 object-cover overflow-hidden">
                  {videoData?.videoUrl ? (
                    <iframe
                      className="w-full aspect-video "
                      src={`https://www.youtube.com/embed/${extractYouTubeVideoId(
                        videoData.videoUrl
                      )}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex justify-center items-center">
                      <h1 className="text-2xl dark:text-white text-center w-full mx-auto text-black">
                        Unable to fetch the video.
                      </h1>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Video Information */}
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold line-clamp-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                {videoData?.videoName}
              </h2>
              <div className="flex justify-between w-full items-center mb-4">
                <h4 className="text-lg text-gray-600 dark:text-white font-ubuntu">
                  {videoData?.tutorName}
                </h4>
                <p className="text-lg text-gray-600 dark:text-white font-ubuntu">
                  {videoData?.watchCount} views
                </p>
              </div>

              {/* Video Description Accordion */}
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-5 shadow-inner">
                <Accordion>
                  <AccordionItem
                    key="1"
                    aria-label="Accordion 1"
                    subtitle="Video Description"
                    title="Read more about the Video"
                  >
                    <div className="flex flex-col items-start gap-3 font-ubuntu">
                      {videoData?.description}
                      {videoData.markdownContent && (
                        <div className="w-full text-black dark:text-white mt-6 bg-transparent">
                          <Seperator text={"more about content"} />
                          <MDEditor.Markdown
                            source={videoData.markdownContent}
                            className="prose dark:prose-invert bg-transparent font-ubuntu text-black dark:text-white"
                          />
                        </div>
                      )}
                    </div>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <aside className="col-span-1 w-full border dark:border-white-500 border-black-600 rounded-lg h-fit">
            <h3 className="text-2xl px-1 font-ubuntu bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 font-semibold mb-3 text-center p-1 underline decoration-cyan-300">
              Timestamps
            </h3>
            <ul className="px-4 bg-transparent divide-y divide-gray-300 dark:divide-gray-700">
              {videoData?.videoTimeStamps?.map((timestamp, index) => (
                <li key={index} className="flex items-center justify-between py-2">
                  {/* Timestamp Button */}
                  <Button
                    variant="ghost"
                    className="text-blue-400 p-0 w-28 hover:bg-white dark:hover:bg-gray-800 transition-colors duration-300"
                  >
                    {timestamp.time}
                  </Button>

                  {/* Text aligned to the end */}
                  <span className="w-[80%] text-end flex-grow text-gray-600 dark:text-gray-300 font-medium">
                    {timestamp.text}
                  </span>
                </li>
              ))}
            </ul>


          </aside>
        </div>
      )}
    </motion.div>
  );
};

export default VideoPlaySection;
