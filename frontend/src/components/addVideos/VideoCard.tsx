import {IVideoData } from '@/constants'
import {Button, Image} from "@nextui-org/react"
import React from 'react'
import { Link } from 'react-router-dom'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import WarningIcon from '@/Icons/WarningIcon'
import { getVerifiedToken } from '@/lib/cookieService'
import axios from 'axios'
import { VIDEO_API } from '@/lib/env'
import { ErrorToast, SuccessToast } from '@/lib/toasts'

interface VideoCardProps{
    video : IVideoData;
    onRefresh: (fresh : boolean) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({video , onRefresh}) => {
    
    async function confirmDelete (){
        const jwt = getVerifiedToken();
        const videoId = video._id;
        try {
            const response = await axios.post(`${VIDEO_API}/delete-video`, {videoId} , {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    "Content-Type": "application/json",
                },
            });

            if (response && response.data && response.data.success) {
                SuccessToast(response.data.message);
                onRefresh(true);
            }
            else{
                ErrorToast(response.data.message);
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            ErrorToast(error?.response.data.message ||"Something went wrong");
        }
    }
    
  return (
    <div className='w-full h-auto flex flex-col gap-2 justify-start items-start relative p-2 rounded-xl bg-white-700 dark:bg-gray-900'>
        <Image
            isBlurred
            src={video.thumbnail}
            alt="course-img"
            className="z-0 object-cover p-2 aspect-video"
        />

        <div className='flex flex-col justify-between items-start space-y-1'>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            {video.videoName}
          </h2>

          <h4 className="text-base text-gray-600 dark:text-white font-ubuntu">
            {video.tutorName}
          </h4>

          <i className="text-gray-600 dark:text-gray-400 text-sm font-extralight font-libre line-clamp-3">
            {video?.description}
          </i>

        </div>
        <Link to={`/user/edit-video?videoId=${video._id}`} className="w-full">
            <Button
            className="
                w-full py-3 font-ubuntu text-base font-medium 
                bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 
                shadow-md hover:shadow-lg transition-all duration-300
            "
            >
            Edit Video
            </Button>
        </Link>
          
        <Dialog>
            <DialogTrigger asChild>
                <Button className="dark:bg-red-600/50 bg-red-300 hover:bg-red-600 dark:hover:bg-red-500 transition-colors duration-200 font-semibold font-ubuntu text-black dark:text-white/80 w-full">
                Delete Video
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] p-6 shadow-lg rounded-lg dark:bg-gray-800 bg-white">
                <DialogHeader>
                <DialogTitle className="space-x-2 flex justify-start items-center">
                    <WarningIcon fillColor="red" />
                    <span className="font-ubuntu text-2xl font-bold text-red-700 dark:text-red-400">
                    Warning
                    </span>
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300 text-base mt-2">
                    Are you sure? You really want to{" "}
                    <span className="font-bold">delete</span> your account
                    permanently.
                </DialogDescription>
                </DialogHeader>

                <div className="gap-4 pb-4 flex flex-col justify-start items-center">
                {/* Warning List */}
                <ul className="w-full bg-gray-50 dark:bg-gray-900 text-sm p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    {[
                    "This action cannot be undone.",
                    "You will not be able to recover this video.",
                    "All data related to this video will be delete premanantly",
                    ].map((message, index) => (
                    <li key={index} className="flex items-center mb-2">
                        <span className="text-red-600 dark:text-red-400 font-bold text-lg mr-2">
                        !
                        </span>
                        <span className="text-gray-800 dark:text-gray-300">
                        {message}
                        </span>
                    </li>
                    ))}
                </ul>

                {/* Password Input Form */}
                <div
                    className="w-full flex flex-col gap-3 mt-4"
                >
                    <DialogFooter className="flex justify-between mt-4">
                    <Button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 transition-colors duration-200 text-white font-semibold px-4 py-2 rounded-md"
                        onClick={confirmDelete}
                    >
                        Confirm Deletion
                    </Button>
                    </DialogFooter>
                </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default VideoCard
