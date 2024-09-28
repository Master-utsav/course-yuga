import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthContext } from '../context/authContext';

const SignupModal: React.FC = () => {
  const navigate = useNavigate();
  const { setIsSignupOpen } = useAuthContext();

  const closeSignup = () => {
    setIsSignupOpen(false);
    navigate('/'); 
  };

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.5 }} // Start small and invisible
      animate={{ opacity: 1, scale: 1 }}   // Grow to full size with full opacity
      exit={{ opacity: 0, scale: 0.5 }}     // Shrink back and disappear
      transition={{ duration: 0.5, ease: "easeInOut" }} 
      className="w-full h-screen flex flex-col justify-center items-start px-10 bg-white shadow-lg z-50"
    >
      <h2 className="text-3xl font-semibold mb-6">Create Your Account</h2>
      <form className="w-full flex flex-col space-y-4">
        <input type="text" placeholder="Username" className="p-3 border rounded-md" />
        <input type="email" placeholder="Email" className="p-3 border rounded-md" />
        <input type="password" placeholder="Password" className="p-3 border rounded-md" />
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="py-3 px-6 bg-blue-600 text-white rounded-lg shadow-md"
        >
          Sign Up
        </motion.button>
      </form>
      <button onClick={closeSignup} className="mt-4 text-blue-600 underline">
        Close
      </button>
    </motion.section>
  );
};

export default SignupModal;
