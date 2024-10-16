import React from "react";
import { motion } from "framer-motion";
import { useAuthContext } from "@/context/authContext";
import BulbIcon from "@/Icons/BulbIcon";
import { Accordion, AccordionItem } from "@nextui-org/react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";
import { useVideoContext } from "@/context/videoContext";

const VideoHeader: React.FC = () => {
  const { userData } = useAuthContext();
  const {isAlertActive} = useVideoContext();
  
  const containerVariants = {
    hidden: { opacity: 1, x: -1500, filter: "blur(50px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
  };

  return (
    <motion.section
      className="w-full mx-auto p-5 rounded-tr-xl rounded-tl-xl shadow-lg transition-all duration-300 bg-white dark:bg-gray-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.5,
      }}
    >
      <motion.div className="flex items-center gap-3 mb-5 px-2">
        <Avatar className="border-2 border-purple-500">
            <AvatarImage src={userData.profileImageUrl} />
            <AvatarFallback className="font-bold text-xl dark:text-black dark:bg-white text-white bg-black">
            {userData.avatarFallbackText}
            </AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-semibold font-libre bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ">
          <span className="text-3xl font-medium font-ubuntu">
            Good to see you
          </span>
          ,{" "}
          <i className="font-libre underline decoration-purple-500">
            {userData.firstName}!
          </i>
        </h1>
      </motion.div>

      <motion.div
        className="bg-gray-100 dark:bg-gray-700 px-4 py-1 rounded-lg mb-5 shadow-inner"
        variants={containerVariants}
      >  
      <Accordion defaultExpandedKeys={["2"]}>
        <AccordionItem key="1" aria-label="Accordion 1" subtitle="Please read before uploading" title="Instructions you need to read first?">
        <div className="flex items-start gap-3 font-ubuntu">
            <BulbIcon fillColor="rgb(234 179 8)" size={32} />
            <p className="text-gray-700 dark:text-gray-300">
                If you want to upload a <b>YouTube Course Video</b>, it will be <b>free of cost</b>. 
                Each video will first be <b>verified</b> by the website owner before being added 
                to the course. You will receive an <b>email notification</b> whether the video 
                is approved or rejected.
                <br />
                If you want to upload your own <b>Personal Course Video</b>, you must first <b>top up 
                your wallet</b>. A <b>nominal fee</b> will be charged for each video based on its size.
                <br />
                <b>Pricing:</b> The fee is calculated as <b>X currency / 100MB</b> (via Cloudinary).
            </p>
        </div>
        </AccordionItem>
      </Accordion>
        
      </motion.div>

      {isAlertActive && (
            <div className="flex flex-col justify-center items-center gap-4 p-6 bg-yellow-100 border border-yellow-300 rounded-md shadow-md">
                <p className="text-lg font-ubuntu text-center text-yellow-800">
                Oops! It seems like you haven't uploaded any courses yet. <br />
                <span className="font-bold">
                    Add a course first to start uploading videos and enrich your learning platform!
                </span>
                </p>

                <div className="w-full flex justify-end items-end mt-4">
                <Link
                    to="/user/add-courses"
                    className="px-4 py-2 bg-yellow-600 text-white font-ubuntu text-sm rounded-md shadow-md 
                            hover:bg-yellow-500 transition-all duration-300 ease-in-out"
                >
                    Add Course
                </Link>
                </div>
            </div>
         )}
    </motion.section>
  );
};

export default VideoHeader;
