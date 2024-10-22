import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/context/ThemeProvider";
import { motion } from "framer-motion";
import  BioForm  from "@/components/editProfile/BioForm";
import EditButton from "@/components/editProfile/EditButton";
import DeleteAccountAndChangePassword from "../components/editProfile/DeleteAccountAndChangePassword";
import StatusField from "@/components/editProfile/StatusField";
import { useAuthContext } from "@/context/authContext";
import Seperator from "@/components/Seperator";
import { CountryCodeData } from "@/constants";
import FirstAndLastNameForm from "@/components/editProfile/FirstAndLastNameForm";
import DobForm from "@/components/editProfile/DobForm";
import MobileNumberForm from "@/components/editProfile/MobileNumberForm";
import SelectAddressForm from "@/components/editProfile/SelectAddressForm";
import ChangeRoleField from "@/components/editProfile/ChangeRoleField";

const modalVariants = {
  hidden: { opacity: 0.3, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

const EditProfile = () => {
  const { theme } = useTheme();
  const {userData} = useAuthContext();

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
        <div className="w-full flex justify-between items-center px-2 py-4">
          <div className="w-full flex gap-4 relative justify-start items-center">
            <div className="w-full bg-white rounded-2xl dark:bg-black/20 border-[1px] shadow-sm dark:shadow-white-600 border-black/40 dark:border-white/10 flex justify-center items-center flex-col px-4 pb-4 gap-2">
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
            <div className="w-full rounded-xl flex gap-4 justify-center items-center relative py-1 border-b-[1px] font-ubuntu font-extralight text-center text-medium">
              {` "`}{userData.bio}{`" `}
              {/* <span className="font-semibold font-ubuntu">Bio</span> */}
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
          </div>
        </div>
        </div>
        <Seperator text={"Personal Information"} />
          <div className="w-full flex flex-col justify-between items-start px-2 py-4 gap-3">
            <div className="relative w-full flex flex-row items-start justify-between gap-5">
              <div className="flex flex-col w-full relative gap-2">
              <FirstAndLastNameForm  firstName={userData.firstName} lastName={userData.lastName} />
                <MobileNumberForm CountryCodeData={CountryCodeData} theme={theme} code={userData.phoneNumber.code} number={userData.phoneNumber.number} />
                <DobForm/>
              </div>
             <BioForm  />
            </div>
          </div>
        <Seperator text={"Update your address"}/>
          <div className="w-full flex flex-col justify-between items-start px-2 py-4 gap-3">
            <SelectAddressForm />
          </div>
        {/* <Seperator text={"Apply Changes"} />
        <div className="w-full flex justify-center">
          <Button className="w-full mx-auto dark:bg-white-600 dark:hover:bg-white-700 transition-colors duration-200 font-semibold font-ubuntu dark:text-black/80 place-items-end" >
          Apply Changes
        </Button>
        </div> */}
        <Seperator text={"Critical Section"} />
        {userData.role === "STUDENT" && <ChangeRoleField />}
        <DeleteAccountAndChangePassword />
      </motion.div>
    </section>
  );
};

export default EditProfile ;
