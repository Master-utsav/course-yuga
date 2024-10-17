import { motion } from "framer-motion";
import { Button , Image} from "@nextui-org/react"; 
import { IVideoData } from "@/constants";
import { Link } from "react-router-dom";
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
  hidden: (i : number) => ({ opacity: 1, scale: 1, x: i * -420 , filter: "blur(8px)", zIndex: i * -1}),
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    zIndex: i * 1,
    x: 0,
    transition: {
      delay: i * 0.3, 
      ease: [0.7, 0, 0.84, 0]
    },
  }),
};

interface VideoInterface{
    videos: IVideoData[] | [];
}

const UserVideoCard: React.FC<VideoInterface> = ({ videos }) => {
  const {theme} = useTheme();
  const {userData , setUserData} = useAuthContext();

  const debouncedHandleBookmark = debounce(async(videoId : string) =>{
    const jwt = getVerifiedToken();
    if(!videoId) return;
    try {
      const response = await axios.post(`${USER_API}/user-video-bookmarks` , {videoId} , {
        headers: {
          Authorization : `Bearer ${jwt}`,
          "Content-Type" : "application/json"
        }
      })
   
      if(response && response.data && response.data.success){
        SuccessToast(response.data.message)
        setTimeout(async() => {
          const userData = await getUserData();
          if (userData) setUserData(userData);
        } , 100) 
      }
      else{
        ErrorToast(response.data.message);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error : any) {
      ErrorToast(error?.response.data.message || "Something went wrong")
    }
  } , 500)

  const handleBookmarkClick = (videoId: string | undefined) => {
    if (!videoId) return;
    debouncedHandleBookmark(videoId);
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-5 "
      initial="hidden"
      animate="visible"
    >
      {videos.map((video, i) => (
        <motion.div
          key={i}
          className="w-full space-y-2 relative bg-white text-start dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
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

          <div className="p-3 space-y-1">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              {video.videoName}
            </h2>

            <h4 className="text-base text-gray-600 dark:text-white font-ubuntu">
              {video.tutorName}
            </h4>

            <i className="text-gray-600 dark:text-gray-400 text-sm font-extralight font-libre line-clamp-3 mb-3">
              {video.description}
            </i>
          </div>
            <Link to={`/user/video-player?videoId=${video._id}`}>
              <Button className="w-full font-medium text-lg font-ubuntu bg-blue-500 text-white hover:bg-blue-600">
                Watch Now
              </Button>
            </Link>
            <Button className="w-full font-medium text-lg font-ubuntu bg-white-600 hover:bg-white-800 text-black dark:bg-gray-700 dark:text-white dark:hover:bg-gray-900" onClick={() => handleBookmarkClick(video._id)}>
              {video && video._id ? 
              userData.bookmarks?.video.includes(video._id) ? 
              (<>
               <BookmarkIcon2 fillColor={theme === "dark" ? "white" : "black"} size={24}/> 
               <span>Bookmarked</span>
              </>) : (
                <>
                  <BookmarkIcon2 fillColor="none" size={24} strokeColor={theme === "dark" ? "white" : "black"}/> 
                  <span>Bookmark</span>
                 </>
                )
                :
                <>
                </>
              }
            </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default UserVideoCard;
