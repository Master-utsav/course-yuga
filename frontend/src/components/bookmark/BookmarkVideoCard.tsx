import { motion } from "framer-motion";
import { Button, Image } from "@nextui-org/react";
import { IVideoData } from "@/constants";
import { useNavigate } from "react-router-dom";
import BookmarkIcon2 from "@/Icons/BookmarkIcon2";
import { useTheme } from "@/context/ThemeProvider";
import { getVerifiedToken } from "@/lib/cookieService";
import axios from "axios";
import { USER_API } from "@/lib/env";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import React from "react";
import { useAuthContext } from "@/context/authContext";
import { getUserData } from "@/lib/authService";
import { debounce } from "@/lib/debounce";

const cardVariants = {
  hidden: (i: number) => ({
    opacity: 1,
    scale: 1,
    x: i * -420,
    filter: "blur(8px)",
    zIndex: i * -1,
  }),
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    zIndex: i * 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      ease: [0.7, 0, 0.84, 0],
    },
  }),
};

interface VideoInterface {
    videoIds: string[] | undefined;
}

const BookmarkVideoCard: React.FC<VideoInterface> = ({ videoIds }) => {
  const { theme } = useTheme();
  const { userData, setUserData } = useAuthContext();
  const navigate = useNavigate();
  const [bookmarkVideos , setBookmarkVideos] = React.useState<IVideoData[] | []>([])

  const fetchUserBookmarkVideos = React.useCallback(async() =>{
    const jwt = getVerifiedToken();
    if(!videoIds || videoIds.length === 0) return;

    try {
        const response = await axios.post(`${USER_API}/get-bookmarked-videos` , {videoIds} , {
            headers: {
                Authorization: `Bearer ${jwt}`,
                "Content-Type" : "application/json"
            }
        })

        if(response && response.data && response.data.success){
            if(response.data.videos){
                setBookmarkVideos(response.data.videos)
            } 
            else{
                setBookmarkVideos([]);
            }
        }
        else{
            setBookmarkVideos([]);
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        ErrorToast(error?.response.data.message || "Something went wrong")
        setBookmarkVideos([])
    }

  }, [videoIds])

  React.useEffect(() => {
    fetchUserBookmarkVideos();
  } , [fetchUserBookmarkVideos]);

  const debouncedHandleBookmark = debounce(async (videoId: string) => {
    const jwt = getVerifiedToken();
    if (!videoId) return;
    try {
      const response = await axios.post(
        `${USER_API}/user-video-bookmarks`,
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
        setTimeout(async () => {
          const userData = await getUserData();
          if (userData) setUserData(userData);
        }, 100);
      } else {
        ErrorToast(response.data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error?.response.data.message || "Something went wrong");
    }
  }, 500);

  const handleBookmarkClick = (videoId: string | undefined) => {
    if (!videoId) return;
    debouncedHandleBookmark(videoId);
  };

  return (
    <motion.div
      className="w-full relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-5 "
      initial="hidden"
      animate="visible"
    >
      {bookmarkVideos.length === 0 ?
      <div className="w-full flex flex-col justify-center items-center gap-4 p-6 bg-yellow-100 border border-yellow-300 rounded-md shadow-md">
            <p className="text-lg font-ubuntu text-center text-yellow-800">
            Oops! It seems like you haven't Bookmarked any video yet.
            <br/>
            Or wait we are fetching Data
            </p>
        </div>
        :
        bookmarkVideos.map((video, i) => (
            video && video.videoId && userData.bookmarks?.video.includes(video.videoId) && 
            <motion.div
               key={i}
               className="w-full sm:space-y-2 space-y-1 relative bg-white text-start dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
               custom={i}
               variants={cardVariants}
             >
               <div className="w-full relative bg-transparent">
                 <Image
                   isBlurred
                   src={video.thumbnail}
                   alt="NextUI Album Cover"
                   className="z-0 object-cover aspect-video"
                 />
               </div>
     
               <div className="sm:p-3 p-1 space-y-1 overflow-hidden">
                 <h2 className="text-xl font-bold  bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 line-clamp-2">
                   {video.videoName}
                 </h2>
     
                 <h4 className="text-base text-gray-600 dark:text-white font-ubuntu">
                   {video.tutorName}
                 </h4>
     
                 <i className="text-gray-600 dark:text-gray-400 text-sm font-extralight font-libre line-clamp-3 mb-3">
                   {video.description}
                 </i>
               </div>
               
                 <Button className="w-full font-medium sm:text-lg text-base font-ubuntu bg-blue-500 text-white hover:bg-blue-600" onClick={() => navigate(`/user/video-player?v=${video.videoId}`)}>
                   Watch Now
                 </Button>
             
               <div className="flex w-full sm:flex-row flex-col gap-2">
                 <Button
                   className="w-full font-medium sm:text-base text-sm font-ubuntu bg-white-700 hover:bg-white-800 text-black  dark:bg-gray-700 dark:text-white dark:hover:bg-gray-900"
                   onClick={() => handleBookmarkClick(video.videoId)}
                 >
                     <BookmarkIcon2
                         fillColor={
                         theme === "dark" ? "rgb(192 132 252)" : "rgb(88 28 135)"
                         }
                         size={24}
                     />
                     <span className="">Remove from Bookmark</span>
                   </Button>
               </div>
             </motion.div>
           ))
      }
      
    </motion.div>
  );
};

export default BookmarkVideoCard;
