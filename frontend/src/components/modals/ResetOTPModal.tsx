import { useTheme } from "@/context/ThemeProvider";
import EyeCloseIcon from "@/Icons/EyeCloseIcon";
import EyeOpenIcon from "@/Icons/EyeOpenIcon";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import axios from "axios";
import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CrossIcon from "@/Icons/CrossIcon";
import { USER_API } from "@/lib/env";
import GetStartedAnimatedBtn from "@/components/GetStartedAnimatedBtn";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(passwordRegex, {
        message:
          "Password must contain at least one uppercase, one lowercase, one digit, and one special character",
      }),

    confirmPassword: z
      .string()
      .min(8, {
        message: "Confirm Password must be at least 8 characters long",
      })
      .regex(passwordRegex, {
        message: "Confirm Password must match the required pattern",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface OTPComponentProps {
  userEmail: string;
}

const ResetOTPModal: React.FC<OTPComponentProps> = ({ userEmail }) => {
  const [otp, setOtp] = React.useState<string[]>(Array(6).fill(""));
  const [isResendEnabled, setIsResendEnabled] = React.useState(true);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = React.useState(
    false
  );
  const navigate = useNavigate();
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const closeSignup = () => {
    navigate("/");
  };

  async function submitOTP(data: FieldValues) {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      ErrorToast("Otp must be 6 numbers");
      return;
    }

    const { password } = data;
    try {
      const response = await axios.post(`${USER_API}/reset-password-otp`, {
        email: userEmail,
        otp: otpValue,
        newPassword: password,
      });

      const responseData: { success: boolean; message: string } = response.data;

      if (responseData.success) {
        SuccessToast(responseData.message);
        closeSignup();
      } else {
        throw new Error(responseData.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error.response?.data?.message || "Something went wrong");
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newOtp = [...otp];
    const value = e.target.value.slice(0, 1); // Allow only 1 digit per input

    // Update the current OTP digit
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextSibling = document.getElementById(`otp-input-${index + 1}`);
      nextSibling?.focus();
    } else if (
      !value &&
      (e.nativeEvent as InputEvent).inputType === "deleteContentBackward" &&
      index > 0
    ) {
      const prevSibling = document.getElementById(`otp-input-${index - 1}`);
      prevSibling?.focus();
    }
  };

  const handleResend = async() => {
    setIsResendEnabled(false);
    await resendOTP(userEmail);
    // Add logic for resending OTP here
    setTimeout(() => {
      setIsResendEnabled(true);
    }, 600000); // Enable resend after 10min 
  };

  const resendOTP = async (userEmail: string) => {
    try {
      const response = await axios.post(`${USER_API}reset-password`, {email : userEmail});

      const responseData: { success: boolean; message: string} = response.data;
      
      if (responseData.success) {   
        SuccessToast(responseData.message )
      } else {
        throw new Error(responseData.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error : any) {
      ErrorToast(error.response?.data?.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="bg-purple-700 dark:bg-purple-600 text-white rounded-lg text-center relative w-full mx-auto h-fit py-8 max-w-lg flex flex-col justify-center items-center shadow-xl dark:shadow-md dark:shadow-white-700"
    >
      <h3 className="text-2xl font-semibold mb-4 font-ubuntu">
        Change Your Password
      </h3>
      <p className="mb-6">
        6 Digit OTP sent to <span className="font-bold">{userEmail? userEmail : "your registered email"}</span>
      </p>

      <div className="flex justify-center space-x-2 mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            className="size-12 bg-white text-purple-700 font-bold caret-purple-400 text-center rounded-lg text-3xl focus:outline-none"
            maxLength={1}
          />
        ))}
      </div>

      <p className="mb-4">
        Didn’t get a code?{" "}
        <button
          onClick={handleResend}
          disabled={!isResendEnabled}
          className={`underline ${
            !isResendEnabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Click to resend
        </button>
      </p>

      {/* Password fields */}
      <form
        onSubmit={handleSubmit(submitOTP)}
        className="w-full flex flex-col gap-2"
      >
        <div className="relative w-full flex flex-col sm:flex-row items-start justify-between gap-2 px-4">
          <div className="relative w-full flex justify-end flex-col items-end">
            <div className="relative w-full">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                className={`p-3 border rounded-md w-full text-purple-700 bg-white ${
                  errors.password ? "border-red-500" : ""
                }`}
                {...register("password")}
              />
              <div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {theme === "dark" ? (
                  passwordVisible ? (
                    <EyeOpenIcon fillColor="rgb(88 28 135)" size={24} />
                  ) : (
                    <EyeCloseIcon fillColor="rgb(88 28 135)" size={24} />
                  )
                ) : passwordVisible ? (
                  <EyeOpenIcon fillColor="rgb(126 34 206)" size={24} />
                ) : (
                  <EyeCloseIcon fillColor="rgb(126 34 206)" size={24} />
                )}
              </div>
            </div>
            {errors.password && (
              <p className="text-red-900 text-sm text-end w-[90%]">
                {typeof errors.password.message === "string"
                  ? errors.password.message
                  : "An error occurred"}
              </p>
            )}
          </div>

          {/* Confirm password field with visibility toggle */}
          <div className="relative w-full flex justify-end flex-col items-end">
            <div className="relative w-full">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Confirm Password"
                className={`p-3 border rounded-md w-full text-purple-700 bg-white ${
                  errors.password ? "border-red-500" : ""
                }`}
                {...register("confirmPassword")}
              />
              <div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                {theme === "dark" ? (
                  confirmPasswordVisible ? (
                    <EyeOpenIcon fillColor="rgb(88 28 135)" size={24} />
                  ) : (
                    <EyeCloseIcon fillColor="rgb(88 28 135)" size={24} />
                  )
                ) : confirmPasswordVisible ? (
                  <EyeOpenIcon fillColor="rgb(126 34 206)" size={24} />
                ) : (
                  <EyeCloseIcon fillColor="rgb(126 34 206)" size={24} />
                )}
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-900 text-sm text-end w-[90%]">
                {typeof errors.confirmPassword.message === "string"
                  ? errors.confirmPassword.message
                  : "An error occurred"}
              </p>
            )}
          </div>
        </div>

        <div className="w-full py-2" onClick={handleSubmit(submitOTP)}>
          <GetStartedAnimatedBtn BtnText={"Submit"} />
        </div>
      </form>

      <motion.button
        whileHover={{ scale: 1.2 }}
        className="absolute top-2 right-2 text-white font-bold text-2xl"
        onClick={closeSignup}
      >
        <CrossIcon fillColor="red" size={26} />
      </motion.button>
    </motion.div>
  );

}

export default ResetOTPModal;


