import { userLogout } from "@/lib/getLocalStorage";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import WarningIcon from "@/Icons/WarningIcon";
import { SuccessToast } from "@/lib/toasts";
import { useAuthContext } from "@/context/authContext";

const LogoutModal = () => {
  const navigate = useNavigate();
  const {setIsLoggedIn} = useAuthContext();
  
  const handleConfirmLogout = () => {
    userLogout();
    setIsLoggedIn(false);
    navigate("/");
    SuccessToast("Logout Successful");
  };
  
  const handleCancelLogout = () => {
    navigate("/");
  };

  const modalVariants = {
    hidden: { opacity: 0.3, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  return (
    <section className='w-full h-screen fixed inset-0 flex items-center justify-center bg-white dark:bg-black  backdrop-blur-lg transition-opacity duration-300'>
        <motion.div
          className="dark:bg-white/5 bg-black/5 rounded-lg p-6 shadow-2xl dark:shadow-sm dark:shadow-white border-2 dark:border-white border-black"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <WarningIcon fillColor="rgb(202 138 4)" />
            <h2 className="text-lg font-bold">Warning</h2>
          </div>
          <p className="text-gray-700 mb-4 font-ubuntu dark:text-white-600 ">Are you sure you want to logout?</p>
          <div className="flex gap-4 mt-4 justify-between">
            <button className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg shadow-md hover:bg-gray-400 transition duration-200 font-ubuntu" onClick={handleCancelLogout}>
              Cancel
            </button>
            <button className="bg-red-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-200 font-ubuntu" onClick={handleConfirmLogout}>
              Confirm
            </button>
          </div>
        </motion.div>
    </section>
  );
};

export default LogoutModal;
