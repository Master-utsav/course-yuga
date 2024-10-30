import React from "react"
import UserHistoryVideos from '@/components/history/UserHistoryVideos';
import { useAuthContext } from '@/context/authContext';
import TextFlipSmoothRevealEffect from '@/Effects/TextFlipSmoothRevealEffect';
import { getVerifiedToken } from '@/lib/cookieService';
import {getUserData as fetchUserData} from "@/lib/authService"
import { USER_API } from '@/lib/env';
import { SuccessToast, ErrorToast } from '@/lib/toasts';
import axios from 'axios';
import { motion } from 'framer-motion';
import {Button} from "@nextui-org/react"

const History = () => {
  const {userData , setUserData} = useAuthContext();

  async function confirmDelete() {
    const jwt = getVerifiedToken();
    try {
      const response = await axios.delete(
        `${USER_API}/delete-user-entire-history`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response && response.data && response.data.success) {
        SuccessToast(response.data.message);
      } else {
        ErrorToast(response.data.message || "Failed to delete video");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error?.response?.data?.message || "Something went wrong");
    }
  }
  React.useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUserData();
      if(userData){
        setUserData(userData);
      }
    };
    
    fetchData();
  }, [setUserData]);
  
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
        <div className="  flex justify-center items-center text-center gap-2 overflow-hidden">
          <TextFlipSmoothRevealEffect text="HISTORY" className="sm:text-5xl text-3xl"/>
        </div>
        <div className="  flex justify-end items-end text-center gap-2 overflow-hidden">
          <Button
          onClick={confirmDelete}
          >
           CLear all History
          </Button>
        </div>
        {userData && userData.history && 
          <UserHistoryVideos history={userData.history}/>
        }
      </motion.div>
  )
}

export default History;
