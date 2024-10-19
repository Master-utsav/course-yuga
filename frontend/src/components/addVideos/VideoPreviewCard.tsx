import React from 'react'
import VideoPlayer from '../VideoPlayer'
import { IVideoData } from '@/constants';


const extractYouTubeVideoId = (url: string) => {
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=))([^&?/\s]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
};

interface VideoPreviewCardProps{
    isPlayerReady: boolean;
    videoData: IVideoData;
}

const VideoPreviewCard: React.FC<VideoPreviewCardProps> = ({isPlayerReady , videoData}) => {
  return (
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
  )
}

export default VideoPreviewCard
