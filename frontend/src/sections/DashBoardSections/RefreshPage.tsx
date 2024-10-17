import RefreshIcon from '@/Icons/RefreshIcon';
import { SuccessToast } from '@/lib/toasts';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const RefreshPage = () => {
  const navigate = useNavigate();
  
  const handleConfirmRefresh = () => {
    navigate("/user/dashboard");
    SuccessToast("Database Refreshed Successfully");
  }

  const handleCancelRefresh = () => {
    navigate("/user/dashboard");
  };
  

  return (
      <motion.div
        className="dark:bg-white/5 bg-black/5 rounded-lg flex justify-center items-center"
        variants={{
          hidden: { opacity: 0.3, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 }
        }}
        transition={{ duration: 0.3 }}
      >  
        <div className='p-6 rounded-xl bg-transparent shadow-2xl dark:shadow-sm dark:shadow-white border-2 dark:border-white border-black'>
        <div className="flex items-center mb-4">
          <RefreshIcon fillColor="rgb(0 158 11)" />
          <h2 className="text-lg font-bold">Refresh</h2>
        </div>
        <p className="text-gray-700 mb-4 font-ubuntu dark:text-white-600">
          Are you sure you want to Refresh?
        </p>
        <div className="flex gap-4 mt-4 justify-between">
          <button
            className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg shadow-md hover:bg-gray-400 transition duration-200 font-ubuntu"
            onClick={handleCancelRefresh}
          >
            Back to Dashboard
          </button>
          <button
            className="bg-red-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-200 font-ubuntu"
            onClick={handleConfirmRefresh}
          >
            Refresh
          </button>
        </div>
        </div>
      </motion.div>
  );
};

export default RefreshPage
