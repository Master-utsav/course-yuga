import React, { useState } from "react";
import { motion } from "framer-motion";
import CrossIcon from "@/Icons/CrossIcon";
import { loginSchema } from "@/validChecksSchema/zodSchemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useAuthContext } from "@/context/authContext";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@/Icons/GoogleIcon";
import GitHubIcon from "@/Icons/GithubIcon";
import axios from "axios";
import { setTokenCookie } from "@/lib/cookieService";
import { LoginUserDataProps } from "@/constants";
import EyeOpenIcon from "@/Icons/EyeOpenIcon";
import EyeCloseIcon from "@/Icons/EyeCloseIcon";
import { useTheme } from "@/context/ThemeProvider";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import { USER_API } from "@/lib/env";

type loginSchemaData = z.infer<typeof loginSchema>;

const LoginModal: React.FC = () => {
  const navigate = useNavigate();
  // const {setUserData} = useAuthContext();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {theme} = useTheme();
  const closeLogin = () => {
    navigate("/");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginSchemaData>({
    resolver: zodResolver(loginSchema),
  });


  const onSubmit = async (data: loginSchemaData) => {
    try {
      const response = await axios.post(`${USER_API}login`, data);
      const responseData: { success: boolean; message: string; token: string , userData: LoginUserDataProps} = response.data;
      
      if (responseData.success) {
        setTokenCookie(responseData.token);
        SuccessToast(responseData.message )
        closeLogin();
      } else {
        throw new Error(responseData.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error : any) {
      ErrorToast(error.response?.data?.message );
    }
  };

  const handelGoogleBtn = () => {
    try {
      window.location.href = `${USER_API}signup-google`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast("An error occurred Google OAuth" + error);
    }
  }
  const handelGithubBtn = () => {
    try {
      window.location.href = `${USER_API}signup-github`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch (error: any) {
      ErrorToast("An error occurred Github OAuth" + error);
    }
  }
  
  return (
    <section className="w-full mx-auto px-5 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative w-full mx-auto h-fit py-10 mt-8 max-w-lg p-8 flex flex-col justify-center items-center bg-white dark:bg-gray-800 rounded-3xl shadow-lg z-30"
        >
          <h2 className="text-4xl font-bold mb-6 text-center">
            Login<span className="text-purple-500">{" "}Now</span>
          </h2>
          <form
            className="w-full flex flex-col space-y-3 font-sans relative"
            onSubmit={handleSubmit(onSubmit)}
          > 
            <div className="w-full flex justify-center flex-col items-start ">
                <input
                type="text"
                placeholder="Username or Email"
                className={`p-3 border rounded-md w-full text-black dark:text-white ${
                    errors.identity ? "border-red-500" : ""
                }`}
                {...register("identity")}
                />
                {errors.identity && (
                <p className="text-red-500 text-sm">{errors.identity.message}</p>
                )}
            </div>

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
            <Link to="/reset-password" className="flex justify-end cursor-pointer">
              <span className="font-ubuntu hover:text-blue-500 dark:text-white/80 text-black/80">forgot password?{" "}</span>
            </Link>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="py-3 px-6 bg-purple-500 text-white rounded-lg shadow-md"
            >
              Login
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
              <GoogleIcon size={24} /> <span className="ml-4">Login with Google</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              className="py-3 px-6 bg-gray-800/20 dark:bg-slate-700 text-black dark:text-white hover:shadow-sm hover:shadow-purple-700 dark:hover:shadow-purple-600 transition-all rounded-lg flex items-center justify-center"
              onClick={handelGithubBtn}
            >
              <GitHubIcon size={24} /> <span className="ml-4">Login with GitHub</span>
            </motion.button>
          </form>

          <motion.button
            whileHover={{ scale: 1.2 }}
            onClick={closeLogin}
            className="mt-4 text-blue-600 underline flex items-center absolute top-2 right-4"
          >
            <CrossIcon fillColor="red" size={24} />
          </motion.button>
        </motion.div>
    </section>
  );
};

export default LoginModal;
