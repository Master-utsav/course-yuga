import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/context/ThemeProvider";
import { motion } from "framer-motion";
import { BioTextArea } from "@/components/BioTextArea";
import EditButton from "@/components/EditButton";
import EditProfileSection3 from "./EditProfileSection3";
import EditProfileSection4 from "./EditProfileSection4";
import EditProfileSection2 from "./EditProfileSection2";
import StatusField from "@/components/StatusField";
import { USER_API } from "@/lib/env";
import { getVerifiedToken } from "@/lib/cookieService";
import { useCallback, useEffect, useState } from "react";
import { ErrorToast } from "@/lib/toasts";
import axios from "axios";

interface UserDataProps {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  username: string;
  profileImageUrl: string;
  emailVerificationStatus: boolean;
  phoneNumber: string;
  phoneNumberVerificationStatus: boolean;
  bio: string;
  role: string;
  avatarFallbackText: string;
}

const defaultUserData: UserDataProps = {
  firstName: "Unknown",
  lastName: "User",
  fullName: "Unknown User",
  email: "unknown_user@gmail.com",
  username: "unknown_user",
  profileImageUrl: "",
  emailVerificationStatus: false,
  phoneNumber: "",
  phoneNumberVerificationStatus: false,
  bio: "",
  role: "STUDENT",
  avatarFallbackText: "U" + "K", // Default fallback for avatar text
};

const modalVariants = {
  hidden: { opacity: 0.3, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

const EditProfile = () => {
  // const [isOpen, setIsOpen] = React.useState(true); // Toggle sidebar
  const { theme } = useTheme();
  const [userData, setUserData] = useState<UserDataProps>(defaultUserData);
  const getUserData = useCallback(async () => {
    const jwt = getVerifiedToken();
    try {
      const response = await axios.get(`${USER_API}get-user`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (response && response.data && response.data.success) {
        const responseData = response.data.data;
        setUserData({
          firstName: responseData.firstName || "Unknown",
          lastName: responseData.lastName || "User",
          fullName:  (responseData.firstName + " " + responseData.lastName) || "Unknown User",
          email: responseData.email || "unknown_user@gmail.com",
          username: responseData.userName || "unknown_user",
          profileImageUrl: responseData.profileImageUrl || "",
          emailVerificationStatus:
            responseData.emailVerificationStatus || false,
          phoneNumber: responseData.phoneNumber || "",
          phoneNumberVerificationStatus:
            responseData.phoneNumberVerificationStatus || false,
          bio: responseData.bio || "",
          role: responseData.role || "STUDENT",
          avatarFallbackText:
            (responseData.firstName.charAt(0).toUpperCase() || "U") +
            (responseData.lastName.charAt(0).toUpperCase() || "K"),
        });
      } else {
        ErrorToast(response.data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error.response?.data?.message || "Something went wrong");
    }
  }, []);

  // Call getUserData when the component mounts (if needed)
  useEffect(() => {
    getUserData();
  }, [getUserData]);

  return (
    <section className="w-full flex items-center justify-center bg-white dark:bg-black  backdrop-blur-lg transition-opacity duration-300 relative py-28 z-20">
      <motion.div
        className="w-[80%] mx-auto dark:bg-white/5  bg-white-800/30 rounded-lg p-6 shadow-2xl dark:shadow-sm dark:shadow-white/20 border-2 dark:border-white/20 border-purple-500/20"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        <div className="w-full flex justify-between items-start px-2 py-4">
          <div className="w-full flex flex-col space-y-4">
            <div className="w-full flex  items-center justify-between pr-10 ">
              <div className="w-full flex items-center justify-start space-x-2">
                <Avatar className="border-2 border-blue-500">
                  <AvatarImage src={userData.profileImageUrl} className="" />
                  <AvatarFallback className="font-bold text-xl dark:text-black font-ubuntu dark:bg-white text-white bg-black ">
                    {userData.avatarFallbackText}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center content-center flex-col flex">
                  <span className="text-center mx-2">{userData.fullName}</span>
                  <span className="text-blue-500 text-sm">@{userData.username}</span>
                </div>
              </div>
              <EditButton
                theme={theme}
                avatarFallbackText={userData.avatarFallbackText}
                imageUrl={userData.profileImageUrl}
                username={userData.username}
              />
            </div>
            <StatusField
              inputValue={userData.email}
              isInputVerified={userData.emailVerificationStatus}
              type="email"
            />
            <StatusField
              inputValue={userData.phoneNumber}
              isInputVerified={userData.phoneNumberVerificationStatus}
              type="mobile"
            />
            {/* <ChangeRole theme={theme} /> */}
          </div>

          <BioTextArea />
        </div>
        <div className="flex items-center justify-center my-4">
          <div className="h-px border-black/40 dark:border-gray-300/20 w-full rounded-xl border-dotted border-[1px]"></div>
          <span className="px-3 whitespace-nowrap text-gray-500 text-center font-semibold font-ubuntu text-base">
            Personal Information
          </span>
          <div className="h-px border-black/40 dark:border-gray-300/20 w-full rounded-xl border-dotted border-[1px]"></div>
        </div>
        <EditProfileSection2 />
        <div className="flex items-center justify-center my-4">
          <div className="h-px border-black/40 dark:border-gray-300/20 w-full rounded-xl border-dotted border-[1px]"></div>
          <span className="px-3 text-gray-500 whitespace-nowrap  text-center font-semibold font-ubuntu text-base">
            Update your address
          </span>
          <div className="h-px border-black/40 dark:border-gray-300/20 w-full rounded-xl border-dotted border-[1px]"></div>
        </div>
        <EditProfileSection3 />
        <div className="flex items-center justify-center my-4">
          <div className="h-px border-black/40 dark:border-gray-300/20 w-full rounded-xl border-dotted border-[2px]"></div>
        </div>
        <EditProfileSection4 />
      </motion.div>
    </section>
  );
};

export default EditProfile;
