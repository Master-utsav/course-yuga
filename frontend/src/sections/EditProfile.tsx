import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/context/ThemeProvider";
import { motion } from "framer-motion";
import { BioForm } from "@/components/BioForm";
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
import { Button } from "@nextui-org/react";

interface UserDataProps {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  userName: string;
  profileImageUrl: string;
  emailVerificationStatus: boolean;
  phoneNumber: {
    code: string;
    number: string;
  };
  phoneNumberVerificationStatus: boolean;
  address: string;
  bio: string;
  userDob: string;
  role: string;
  avatarFallbackText: string;
}

const defaultUserData: UserDataProps = {
  firstName: "Unknown",
  lastName: "User",
  fullName: "Unknown User",
  email: "unknown@gmail.com",
  userName: "unknown_user",
  profileImageUrl: "",
  emailVerificationStatus: false,
  phoneNumber: {
    code: "",
    number: "",
  },
  address: "",
  phoneNumberVerificationStatus: false,
  userDob: "",
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
          email: responseData.email || "unknown@gmail.com",
          userName: responseData.userName || "unknown_user",
          profileImageUrl: responseData.profileImageUrl || "",
          emailVerificationStatus:
            responseData.emailVerificationStatus || false,
          phoneNumber: {
            code: responseData.phoneNumber.code || "",
            number: responseData.phoneNumber.number || "",
          },
          address: responseData.address.country !== undefined ? responseData.address.city + ", " + responseData.address.state + ", " + responseData.address.country :  "",
          phoneNumberVerificationStatus:
            responseData.phoneNumberVerificationStatus || false,
          bio: responseData.bio || "",
          role: responseData.role || "STUDENT",
          userDob: responseData.userDob || "",
          avatarFallbackText:
            (responseData.firstName.charAt(0).toUpperCase() || "U") +
            (responseData.lastName.charAt(0).toUpperCase() || "G"),
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
          <div className="w-full flex gap-4 relative justify-start items-center">
            <div className="w-[90%] bg-white rounded-2xl dark:bg-black/20 border-[1px] shadow-sm dark:shadow-white-600 border-black/40 dark:border-white/10 flex justify-center items-center flex-col px-4 pb-4 gap-2">
            <div className="w-full flex  items-center justify-between ">
              <div className="w-full flex items-center justify-center space-x-2 pt-2">
                <Avatar className="border-2 border-blue-500">
                  <AvatarImage src={userData.profileImageUrl} className="" />
                  <AvatarFallback className="font-bold text-xl dark:text-black font-ubuntu dark:bg-white text-white bg-black ">
                    {userData.avatarFallbackText}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center content-center flex-col flex">
                  <span className="text-center mx-2">{userData.fullName}</span>
                  <span className="text-blue-500 text-sm">@{userData.userName}</span>
                </div>
              </div>
              <EditButton
                theme={theme}
                avatarFallbackText={userData.avatarFallbackText}
                imageUrl={userData.profileImageUrl}
                userName={userData.userName}
              />
            </div>
            <div className="w-full rounded-xl flex  gap-4 justify-center items-center relative py-1 border-b-[1px] font-ubuntu font-light">
              <span className="font-semibold font-ubuntu">Bio</span>{`"`}{userData.bio}{`"`}
            </div>
            <div className="w-full flex flex-col gap-2 justify-start relative">
              <StatusField
                inputValue={userData.email}
                isInputVerified={userData.emailVerificationStatus}
                type="email"
              />
              <StatusField
                inputValue={userData.phoneNumber.number}
                isInputVerified={userData.phoneNumberVerificationStatus}
                countryCode={userData.phoneNumber.code}
                type="mobile"
              />
              <StatusField
                inputValue={userData.userDob}
                isInputVerified={userData.userDob !== "" ? true : false}
                type="dob"
              />
              <StatusField
                inputValue={userData.address}
                isInputVerified={userData.address !== "" ? true : false}
                type="address"
              />
            </div>
            
            {/* <ChangeRole theme={theme} /> */}
          </div>
        </div>
            

          <BioForm />
        </div>
        <div className="flex items-center justify-center my-4">
          <div className="h-px border-black/40 dark:border-gray-300/20 w-full rounded-xl border-dotted border-[1px]"></div>
          <span className="px-3 whitespace-nowrap dark:text-white/60 text-black/60 text-center font-semibold font-ubuntu text-base">
            Personal Information
          </span>
          <div className="h-px border-black/40 dark:border-gray-300/20 w-full rounded-xl border-dotted border-[1px]"></div>
        </div>
        <EditProfileSection2 />
        <div className="flex items-center justify-center my-4">
          <div className="h-px border-black/40 dark:border-gray-300/20 w-full rounded-xl border-dotted border-[1px]"></div>
          <span className="px-3  whitespace-nowrap  dark:text-white/60 text-black/60  text-center font-semibold font-ubuntu text-base">
            Update your address
          </span>
          <div className="h-px border-black/40 dark:border-gray-300/20 w-full rounded-xl border-dotted border-[1px]"></div>
        </div>
        <EditProfileSection3 />
        <div className="flex items-center justify-center my-4">
          <div className="h-px border-black/40 dark:border-gray-300/20 w-full rounded-xl border-dotted border-[1px]"></div>
          <span className="px-3  whitespace-nowrap dark:text-white/60 text-black/60  text-center font-semibold font-ubuntu text-base">
            Apply Changes
          </span>
          <div className="h-px border-black/40 dark:border-gray-300/20 w-full rounded-xl border-dotted border-[1px]"></div>
        </div>
        <div className="w-full flex justify-center">
          <Button className="w-full mx-auto dark:bg-white-600 dark:hover:bg-white-700 transition-colors duration-200 font-semibold font-ubuntu dark:text-black/80 place-items-end" onClick={getUserData}>
          Apply Changes
        </Button>
        </div>
        <div className="flex items-center justify-center my-4">
          <div className="h-px border-black/40 dark:border-gray-300/20 w-full rounded-xl border-dotted border-[2px]"></div>
        </div>
        <EditProfileSection4 />
      </motion.div>
    </section>
  );
};

export default EditProfile ;
