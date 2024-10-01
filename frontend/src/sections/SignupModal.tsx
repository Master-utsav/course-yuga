import React, { useState } from "react";
import { motion } from "framer-motion";
import CrossIcon from "@/Icons/CrossIcon";
import { signupSchema } from "@/validChecksSchema/zodSchemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "@/context/authContext";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@/Icons/GoogleIcon";
import GitHubIcon from "@/Icons/GithubIcon";
import axios from "axios";
import SignUpOTPModal from "@/components/SignUpOTPModal";
import EyeCloseIcon from "@/Icons/EyeCloseIcon";
import EyeOpenIcon from "@/Icons/EyeOpenIcon";
import {useTheme } from "@/context/ThemeProvider";
import { ErrorToast, SuccessToast } from "@/lib/toasts";

type SignupFormData = z.infer<typeof signupSchema>;
const SIGNUP_API_URL = import.meta.env.VITE_PUBLIC_SIGNUP_API_URL;

const SignupModal: React.FC = () => {
  const navigate = useNavigate();
  const {theme} = useTheme();
  const { setIsSignupOpen } = useAuthContext();
  const [showOTPComponent, setShowOTPComponent] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const closeSignup = () => {
    setIsSignupOpen(false);
    navigate("/");
  };

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  

  const formData = getValues();

  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await axios.post(SIGNUP_API_URL, data);
      const responseData: { success: boolean; message: string } = response.data;
    
      if (responseData.success) {
        SuccessToast(responseData.message)
        setShowOTPComponent(true);
      } else {
        throw new Error(responseData.message);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error.response?.data?.message);
    }
  };
  
  const handelGoogleBtn = () => {
    try {
      window.location.href = import.meta.env.VITE_PUBLIC_GOOGLE_SIGNUP_URL!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast("An error occurred Google OAuth" + error);
    }
  }
  const handelGithubBtn = () => {
    try {
      window.location.href = import.meta.env.VITE_PUBLIC_GITHUB_SIGNUP_URL!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch (error: any) {
      ErrorToast("An error occurred Github OAuth" + error);
    }
  }
  
  return (
    <section className="w-full mx-auto px-5 flex justify-center items-center">
      {!showOTPComponent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative w-full mx-auto h-fit py-10 mt-8 max-w-lg p-8 flex flex-col justify-center items-center bg-white dark:bg-gray-800 rounded-3xl shadow-lg z-30"
        >
          <h2 className="text-4xl font-bold mb-6 text-center">
            Sign Up for <span className="text-purple-500">Free</span>
          </h2>
          <form
            className="w-full flex flex-col space-y-3 font-sans relative"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="relative w-full flex flex-col sm:flex-row items-start justify-between gap-2 ">
              <div className=" w-full flex justify-center flex-col items-start">
                <input
                  type="text"
                  placeholder="First Name"
                  className={`p-3 border rounded-md w-full text-black dark:text-white  ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm text-end w-[90%]">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="w-full flex justify-center flex-col items-end">
                <input
                  type="text"
                  placeholder="Last Name"
                  className={`p-3 border rounded-md w-full text-black dark:text-white ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm text-end w-[90%]">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full flex justify-center flex-col items-start">
              <input
                type="text"
                placeholder="Username"
                className={`p-3 border rounded-md w-full text-black dark:text-white ${
                  errors.userName ? "border-red-500" : ""
                }`}
                {...register("userName")}
              />
              {errors.userName && (
                <p className="text-red-500 text-sm">{errors.userName.message}</p>
              )}
            </div>

            <div className="w-full flex justify-center flex-col items-start">
              <input
                type="email"
                placeholder="Email"
                className={`p-3 border rounded-md w-full  text-black dark:text-white ${
                  errors.email ? "border-red-500" : ""
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password field with visibility toggle */}
            <div className="relative w-full flex flex-col sm:flex-row items-start justify-between gap-2 ">
              <div className="relative w-full flex justify-end flex-col items-end">
                <div className="relative w-full">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  className={`p-3 border rounded-md w-full text-black dark:text-white ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  {...register("password")}
                />
                <div
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                {
                  theme === 'dark' ? (
                    passwordVisible ? <EyeOpenIcon fillColor="white" size={24} /> : <EyeCloseIcon fillColor="white"  size={24} /> 
                  ):(
                    passwordVisible ? <EyeOpenIcon fillColor="grey" size={24} /> : <EyeCloseIcon fillColor="grey" size={24} /> 
                  )
                }
                </div>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm text-end w-[90%]">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm password field with visibility toggle */}
              <div className="relative w-full flex justify-end flex-col items-end">
                <div className="relative w-full">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm Password"
                  className={`p-3 border rounded-md w-full text-black dark:text-white ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  {...register("confirmPassword")}
                />
                <div
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                >
                {
                  theme === 'dark' ? (
                    confirmPasswordVisible ? <EyeOpenIcon fillColor="white" size={24} /> : <EyeCloseIcon fillColor="white"  size={24} /> 
                  ):(
                    confirmPasswordVisible ? <EyeOpenIcon fillColor="grey" size={24} /> : <EyeCloseIcon fillColor="grey" size={24} /> 
                  )
                }
                </div>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm text-end w-[90%]">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              className="py-3 px-6 bg-purple-500 text-white rounded-lg shadow-md"
            >
              Sign Up
            </motion.button>

            <div className="flex items-center justify-center my-4">
              <div className="h-px bg-gray-300 w-full"></div>
              <span className="px-3 text-sm text-gray-500">OR</span>
              <div className="h-px bg-gray-300 w-full"></div>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              className="py-3 px-6 bg-[#e7f3ff] dark:bg-slate-700 text-black  hover:shadow-sm hover:shadow-purple-700 dark:hover:shadow-purple-600 transition-all dark:text-white rounded-lg flex items-center justify-center"
              onClick={handelGoogleBtn}
            >
              <GoogleIcon size={24} /> <span className="ml-4">Sign Up with Google</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              className="py-3 px-6 bg-gray-800/20 dark:bg-slate-700 text-black dark:text-white hover:shadow-sm hover:shadow-purple-700 dark:hover:shadow-purple-600 transition-all rounded-lg flex items-center justify-center"
              onClick={handelGithubBtn}
            >
              <GitHubIcon size={24} /> <span className="ml-4">Sign Up with GitHub</span>
            </motion.button>
          </form>
          <motion.button
            whileHover={{scale : 1.2}}
            className="absolute top-4 right-4 cursor-pointer"
            onClick={closeSignup}
          >
            <CrossIcon size={30} fillColor="red" />
          </motion.button>
        </motion.div>
      ) : (
        <SignUpOTPModal userEmail={formData.email}/>
      )}
    </section>
  );
};

export default SignupModal;
