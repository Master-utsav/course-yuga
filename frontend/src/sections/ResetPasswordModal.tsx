import React, { useState } from "react";
import { motion } from "framer-motion";
import CrossIcon from "@/Icons/CrossIcon";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import ResetOTPModal from "@/components/ResetOTPModal";
import { USER_API } from "@/lib/env";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ResetPasswordSchema = z.object({
    email: z
      .string()
      .email({ message: "Invalid email format" })
      .regex(emailRegex, { message: "Please provide a valid email" }),
})

type ResetPasswordSchemaData = z.infer<typeof ResetPasswordSchema>;

const ResetPasswordModal: React.FC = () => {
  const navigate = useNavigate();
  const [showOTPComponent, setShowOTPComponent] = useState(false);
  
  const closeResetPassword = () => {
    setShowOTPComponent(false);
    navigate("/");
  };
  
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ResetPasswordSchemaData>({
    resolver: zodResolver(ResetPasswordSchema),
  });
  
  const formData = getValues();
  const onSubmit = async (data: ResetPasswordSchemaData) => {
    try {
      const response = await axios.post(`${USER_API}reset-password`, data);

      const responseData: { success: boolean; message: string} = response.data;
      
      if (responseData.success) {   
        SuccessToast(responseData.message )
        setShowOTPComponent(true);
      } else {
        throw new Error(responseData.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error : any) {
      ErrorToast(error.response?.data?.message);
    }
  };
  
  const handleAlreadyHaveAnOTP = () => {
    navigate("/reset-password")
    setShowOTPComponent(true);
  }

  
  return (
    <section className="w-full mx-auto px-5 flex justify-center items-center ">
        {!showOTPComponent ? 
        (<motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative w-full mx-auto h-fit py-10 mt-8 max-w-lg p-8 flex flex-col justify-center items-center bg-white dark:bg-gray-800 rounded-3xl shadow-lg z-30"
        >
          <h2 className="text-4xl font-bold mb-6 text-center">
            Enter your<span className="text-purple-500">{" "}Email</span>
          </h2>
          <form
            className="w-full flex flex-col space-y-3 font-sans relative"
            onSubmit={handleSubmit(onSubmit)}
          > 
            <div className="w-full flex justify-center flex-col items-start ">
                <input
                type="text"
                placeholder="email required"
                className={`p-3 border rounded-md w-full text-black dark:text-white ${
                    errors.email ? "border-red-500" : ""
                }`}
                {...register("email")}
                />
                {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
            </div>
            <span onClick={handleAlreadyHaveAnOTP} className="flex justify-end cursor-pointer">
              <span className="font-ubuntu hover:text-blue-500 dark:text-white/80 text-black/80">Already have an OTP?{" "}</span>
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="py-3 px-6 bg-purple-500 text-white rounded-lg shadow-md"
            >
              Send
            </motion.button>
          </form>

          <motion.button
            whileHover={{ scale: 1.2 }}
            onClick={closeResetPassword}
            className="mt-4 text-blue-600 underline flex items-center absolute top-2 right-4"
          >
            <CrossIcon fillColor="red" size={24} />
          </motion.button>
        </motion.div>):
        <ResetOTPModal userEmail={formData.email} />
        }
    </section>
  );
};

export default ResetPasswordModal;
