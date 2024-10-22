import React from "react";
import { Image, Button } from "@nextui-org/react";
import { IVideoData } from "@/constants";
import { useNavigate } from "react-router-dom";
import PlayWatchIcon from "@/Icons/PlayWatchIcon";
import EyeOpenIcon from "@/Icons/EyeOpenIcon";
import { TimeStamp } from "./AddTimeStamps";

interface DisplayVideoCardIntoPageProps {
  videoData: IVideoData;
  previewImage: string;
  timeStamps: TimeStamp[];
}
const DisplayVideoCardIntoPage: React.FC<DisplayVideoCardIntoPageProps> = ({
  videoData,
  timeStamps,
  previewImage,
}) => {
  
  const navigate = useNavigate();

  return (
    <div className="w-1/3 p-6 border-l space-y-4">
      <div className="w-full relative bg-white text-start dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl">

        <div className="relative w-full">
          <Image
            isBlurred
            src={previewImage}
            alt="course-img"
            className="z-0 object-cover aspect-video rounded-lg p-2"
          />

          <div className="absolute right-2 bottom-[-1rem] dark:bg-gray-600/50 backdrop-blur-lg bg-white/50 p-2 rounded-xl rounded-br-[2rem] rounded-bl-[2rem] shadow-lg text-xl font-libre font-semibold flex gap-1">
            <span className="text-xl font-libre font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                {videoData.watchCount}
            </span>
            <span className="dark:text-violet-100  text-gray-950">
                <EyeOpenIcon />
            </span>
          </div>

        </div>

        <div className="p-3 space-y-2 flex flex-col justify-between">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            {videoData.videoName}
          </h2>

          <h4 className="text-lg text-gray-600 dark:text-white font-ubuntu">
            {videoData.tutorName}
          </h4>

          <i className="text-gray-600 dark:text-gray-400 text-sm font-extralight font-libre line-clamp-3">
            {videoData.description}
          </i>

          <Button
            className="w-full font-medium text-lg font-ubuntu bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => navigate(`/user/video-player?v=${videoData.videoId}`)}
           >
            <PlayWatchIcon fillColor="white" size={30} /> Watch Now
           </Button>
        </div>
      </div>
      <div className="col-span-1 w-full border dark:border-white-500 border-black-600 rounded-lg h-fit">
            <h3 className="text-2xl px-1 font-ubuntu bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 font-semibold mb-3 text-center p-1 underline decoration-cyan-300">
              Timestamps
            </h3>
            <ul className="px-4 bg-transparent divide-y divide-gray-300 dark:divide-gray-700">
              {timeStamps.map((timestamp, index) => (
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
          </div>
    </div>
  );
};

export default DisplayVideoCardIntoPage;
