import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DOBDatePicker from "@/components/DOBDatePicker";
import { useAuthContext } from "@/context/authContext";
import { useTheme } from "@/context/ThemeProvider";
import { motion } from "framer-motion";
import { BioTextArea } from "@/components/BioTextArea";
import EditButton from "@/components/EditButton";
import EditProfileSection3 from "./EditProfileSection3";
import ChangeRole from "@/components/ChangeRole";
import EditProfileSection4 from "./EditProfileSection4";
import EditProfileSection2 from "./EditProfileSection2";

const modalVariants = {
  hidden: { opacity: 0.3, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

const EditProfile = () => {
  // const [isOpen, setIsOpen] = React.useState(true); // Toggle sidebar
  const { theme } = useTheme();
  const { localStorageUserData } = useAuthContext();
  const firstName: string = localStorageUserData?.firstName || "Unknown";
  const lastName: string = localStorageUserData?.lastName || "User";
  const fullName: string = firstName + " " + lastName;
  // const userEmail: string = localStorageUserData?.email || "unknown_user@gmail.com";
  const username = localStorageUserData?.userName || "unknown_user";
  const imageUrl: string = localStorageUserData?.profileImageUrl || "";
  const firstChar: string =
    localStorageUserData?.firstName.charAt(0).toUpperCase() || "U";
  const lastChar: string =
    localStorageUserData?.lastName.charAt(0).toUpperCase() || "K";
  const avatarFallbackText = firstChar + lastChar;
  return (
    <section className="w-full flex items-center justify-center bg-white dark:bg-black  backdrop-blur-lg transition-opacity duration-300 relative py-28 z-20">
      <motion.div
        className="w-[80%] mx-auto dark:bg-white/5  bg-black/5 rounded-lg p-6 shadow-2xl dark:shadow-sm dark:shadow-white border-2 dark:border-white border-black"
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
                  <AvatarImage src={imageUrl} className="" />
                  <AvatarFallback className="font-bold text-xl dark:text-black font-ubuntu dark:bg-white text-white bg-black ">
                    {avatarFallbackText}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center content-center flex-col flex">
                  <span className="text-center mx-2">{fullName}</span>
                  <span className="text-blue-500 text-sm">@{username}</span>
                </div>
              </div>
              <EditButton
                theme={theme}
                avatarFallbackText={avatarFallbackText}
                imageUrl={imageUrl}
                username={username}
              />
            </div>
            <div className="flex  items-center justify-between">
              <DOBDatePicker />
            </div>
            <ChangeRole theme={theme} />
          </div>

          <BioTextArea />
        </div>
        <div className="flex items-center justify-center my-4">
          <div className="h-px bg-gray-300 w-full"></div>
          <span className="px-3 whitespace-nowrap text-gray-500 text-center font-semibold font-ubuntu text-base">
            Personal Information
          </span>
          <div className="h-px bg-gray-300 w-full"></div>
        </div>
        <EditProfileSection2 />
        <div className="flex items-center justify-center my-4">
          <div className="h-px bg-gray-300 w-full"></div>
          <span className="px-3 text-gray-500 whitespace-nowrap  text-center font-semibold font-ubuntu text-base">
            Update your address
          </span>
          <div className="h-px bg-gray-300 w-full"></div>
        </div>
        <EditProfileSection3 />
        <div className="flex items-center justify-center my-4">
          <div className="h-px bg-gray-300 w-full"></div>
        </div>
        <EditProfileSection4/>
      </motion.div>
    </section>
  );
};

export default EditProfile;
