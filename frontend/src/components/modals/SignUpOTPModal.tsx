import CrossIcon from "@/Icons/CrossIcon";
import { motion } from "framer-motion";
import React, { useState, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import GetStartedAnimatedBtn from "@/components/GetStartedAnimatedBtn";
import axios from "axios";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import { USER_API } from "@/lib/env";

interface OTPComponentProps {
  userEmail: string;
}

const SignUpOTPModal: React.FC<OTPComponentProps> = ({ userEmail }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [disable, setDisable] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string[]>(Array(6).fill(""));
  const [isResendEnabled, setIsResendEnabled] = useState(true);
  const navigate = useNavigate();

  const closeSignup = () => {
    navigate("/");
  };

  const isValidOtp = (otpValue: string) => otpValue.length === 6 && /^[0-9]+$/.test(otpValue);

  const submitOTP = async () => {
    const otpValue = inputValue.join("");
    console.log(otpValue)
    setDisable(true);

    if (isValidOtp(otpValue)) {
      try {
        const response = await axios.post(`${USER_API}/verify-email-otp`, {
          email: userEmail,
          otp: otpValue,
        });

        const responseData = response.data as { success: boolean; message: string };

        if (responseData.success) {
          SuccessToast(responseData.message);
          navigate("/login");
        } else {
          throw new Error(responseData.message);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          ErrorToast(error.response?.data?.message || "An error occurred.");
        } else {
          ErrorToast("An unexpected error occurred.");
        }
      } finally {
        setDisable(false);
      }
    } else {
      ErrorToast("OTP must be 6 digits.");
      setDisable(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (!/^[0-9]$/.test(value) && value) return;

    const newValue = [...inputValue];
    newValue[index] = value;
    setInputValue(newValue);

    if (value && index < inputValue.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && index > 0 && !e.currentTarget.value) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleCopyPaste = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const copiedOtp = e.clipboardData.getData("text");

    if (!/^[0-9]+$/.test(copiedOtp)) return;

    const newValue = [...inputValue];
    copiedOtp.split("").forEach((char, i) => {
      if (index + i < newValue.length) {
        newValue[index + i] = char;
      }
    });
    setInputValue(newValue);

    const nextIndex = Math.min(index + copiedOtp.length, newValue.length - 1);
    inputsRef.current[nextIndex]?.focus();
    
  };

  const handleResend = () => {
    setIsResendEnabled(false);
    // TODO : logic for resending OTP here
    setTimeout(() => {
      setIsResendEnabled(true);
    }, 30000); 
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="bg-purple-700 dark:bg-purple-600 text-white rounded-lg text-center relative w-full mx-auto h-fit py-8 max-sm:mt-8 max-w-lg flex flex-col justify-center items-center shadow-xl dark:shadow-md dark:shadow-white-700"
    >
      <h3 className="text-2xl font-semibold mb-4 font-ubuntu">Verify your Email</h3>
      <p className="mb-6">
        6 Digit OTP sent to <span className="font-bold">{userEmail}</span>
      </p>

      <div className="flex justify-center space-x-2 mb-4">
        {inputValue.map((_, index) => (
          <input
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            maxLength={1}
            value={inputValue[index]}
            className="w-[40px] h-[50px] rounded-md outline-none text-violet-500 text-center bg-white text-2xl focus:outline-none font-extrabold focus:ring-2 focus:ring-violet-500 caret-violet-500"
            key={index}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleBackspace(e, index)}
            onPaste={(e) => handleCopyPaste(e, index)}
          />
        ))}
      </div>

      <p className="mb-4">
        Didn’t get a code?{" "}
        <button
          onClick={handleResend}
          disabled={!isResendEnabled}
          className={`underline ${!isResendEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Click to resend
        </button>
      </p>
      <div className="w-full" onClick={submitOTP}>
        <GetStartedAnimatedBtn BtnText="Submit" isDisabled={disable} />
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
