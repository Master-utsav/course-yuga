import { useAuthContext } from "@/context/authContext";
import CrossIcon from "@/Icons/CrossIcon";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GetStartedAnimatedBtn from "./GetStartedAnimatedBtn";
import { toast } from "react-toastify";
import axios from "axios";

const Verify_Email_OTP_API_URL = import.meta.env
  .VITE_PUBLIC_Verify_Email_OTP_API_URL;
interface OTPComponentProps {
  userEmail: string;
}

function isValidOtp(otpValue: string) {
  return otpValue.length === 6 && /^[0-9]+$/.test(otpValue);
}

const SignUpOTPModal: React.FC<OTPComponentProps> = ({ userEmail }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isResendEnabled, setIsResendEnabled] = useState(true);
  const navigate = useNavigate();
  const { setIsSignupOpen , setIsLoginOpen } = useAuthContext();

  const closeSignup = () => {
    setIsSignupOpen(false);
    navigate("/");
  };

  async function submitOTP() {
    const otpValue = otp.join("");
    if (isValidOtp(otpValue)) {
      try {
        const response = await axios.post(Verify_Email_OTP_API_URL, {
          email: userEmail,
          otp: otpValue,
        });

        const responseData: { success: boolean; message: string } =
          response.data;

        if (responseData.success) {
          toast.success(responseData.message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setIsLoginOpen(true);
          closeSignup();
        } else {
          throw new Error(responseData.message);
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      toast.error("Otp must be of 6 numbers", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
      // Focus on the next input automatically when a digit is entered
      const nextSibling = document.getElementById(`otp-input-${index + 1}`);
      nextSibling?.focus();
    } else if (
      !value &&
      (e.nativeEvent as InputEvent).inputType === "deleteContentBackward" &&
      index > 0
    ) {
      // Focus on the previous input when backspace is pressed and input is empty
      const prevSibling = document.getElementById(`otp-input-${index - 1}`);
      prevSibling?.focus();
    }
  };

  const handleResend = () => {
    setIsResendEnabled(false);
    // Add logic for resending OTP here
    setTimeout(() => {
      setIsResendEnabled(true); // Enable resend after some time
    }, 30000); // Enable resend after 30 seconds
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="bg-purple-700 dark:bg-purple-600 text-white rounded-lg text-center relative w-full mx-auto h-fit py-8  max-w-lg flex flex-col justify-center items-center shadow-xl dark:shadow-md dark:shadow-white-700"
    >
      <h3 className="text-2xl font-semibold mb-4 font-ubuntu">
        Verfiy your Email
      </h3>
      <p className="mb-6">
        6 Digit OTP sent to <span className="font-bold">{userEmail}</span>
      </p>

      <div className="flex justify-center space-x-2 mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            className="size-12 bg-white text-purple-700 font-bold caret-purple-400  text-center rounded-lg text-3xl focus:outline-none"
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
      <div className="w-full" onClick={submitOTP}>
        <GetStartedAnimatedBtn BtnText={"Submit"} />
      </div>

      <motion.button
        whileHover={{ scale: 1.2 }}
        className="absolute top-2 right-2 text-white font-bold text-2xl"
        onClick={closeSignup}
      >
        <CrossIcon fillColor="red" size={24} />
      </motion.button>
    </motion.div>
  );
};

export default SignUpOTPModal;
