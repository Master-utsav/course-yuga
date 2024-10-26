/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import { useForm } from "react-hook-form"; // Import react-hook-form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"; // Integrate zod resolver
import SelectorIcon from "@/Icons/SelectorIcon";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import { USER_API } from "@/lib/env";
import { getVerifiedToken } from "@/lib/cookieService";
import axios from "axios";
import { getUserData as fetchUserData} from "@/lib/authService";
import { useAuthContext } from "@/context/authContext";
import { useCallback } from "react";

interface Country {
  countrycode: string;
  countryname: string;
  flagurl: string;
}

interface CountrySelectProps {
  CountryCodeData: Country[];
  theme: string;
  code: string;
  number: string;
}

// Zod schema for validation
const mobileSchema = z.object({
  countryCode: z
    .string()
    .min(1, "Please select a country code.")
    .refine((value) => value.trim() !== "", {
      message: "Please select a country code.",
    }),
  mobileNumber: z
    .string()
    .regex(/^\d+$/, "Please enter phone number (0-9 digits*).")
    .min(4, "Mobile number must be at least 4 digits.")
    .max(17, "Mobile number must be at most 17 digits."),
  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be a 6-digit number.")
    .optional()
    .or(z.literal("")),
});

type MobileFormValues = z.infer<typeof mobileSchema>;

const MobileNumberForm: React.FC<CountrySelectProps> = ({
  CountryCodeData,
  theme,
  code,
  number,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [showOtpField, setShowOtpField] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const jwt = getVerifiedToken();

  const { register, handleSubmit, setValue, formState: { errors, isValid } } = 
    useForm<MobileFormValues>({
      resolver: zodResolver(mobileSchema),
      mode: "onChange", // Validate in real-time
    });

  useEffect(() => {
    const country = CountryCodeData.find((c) => c.countrycode === code);
    if (country) {
      setSelectedCountry(country);
      setValue("countryCode", country.countrycode);
    }
    setValue("mobileNumber", number);
  }, [code, number, CountryCodeData, setValue]);

  const handleMobileNumberSubmit = async (data: MobileFormValues) => {
    setIsSubmitting(true); // Start loading
    const to = data.countryCode + data.mobileNumber;
    try {
      const response = await axios.post(
        `${USER_API}/verify-mobile-number-send-otp`,
        { to },
        { headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" } }
      );
      if (response.data?.success) {
        SuccessToast(response.data.message);
        setShowOtpField(true);
      } else {
        ErrorToast(response.data.message);
      }
    } catch (error: any) {
      ErrorToast(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false); // End loading
    }
  };

  const {setUserData} = useAuthContext();
  const loadUserData = useCallback(async () => {
    const userData = await fetchUserData(); 
    if (userData) {
      setUserData(userData);
    }
  }, [setUserData]);

  const handleOtpSubmit = async (data: MobileFormValues) => {
    if (!data.otp?.trim()) {
      ErrorToast("Please Enter the OTP");
      return;
    }
    setIsSubmitting(true); // Start loading
    const twilioFormatedData = {
      to: data.countryCode + data.mobileNumber,
      code: data.otp,
      countryCode: data.countryCode,
    };
    try {
      const response = await axios.post(
        `${USER_API}/verify-mobile-number-otp-check`,
        twilioFormatedData,
        { headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" } }
      );
      if (response.data?.success) {
        SuccessToast(response.data.message);
        setShowOtpField(false);
        loadUserData();
        setValue("otp", "");
      } else {
        ErrorToast(response.data.message);
      }
    } catch (error: any) {
      ErrorToast(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false); // End loading
    }
  };

  const handleCountrySelect = (countryCode: string) => {
    const selected = CountryCodeData.find((country) => country.countrycode === countryCode);
    if (selected) {
      setSelectedCountry(selected);
      setValue("countryCode", selected.countrycode);
    }
    setDropdownOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") setDropdownOpen(false); // Close on Esc
  };

  useEffect(() => {
    if (showOtpField) {
      document.querySelector<HTMLInputElement>("input[placeholder='Enter OTP']")?.focus();
    }
  }, [showOtpField]);

  return (
    <div className="w-full flex flex-col items-center justify-start gap-2 relative">
      {/* <div className="w-full flex relative gap-2"> */}
        <div
          className="w-full flex items-start border rounded-md text-black dark:text-white dark:bg-black/10 relative"
          onKeyDown={handleKeyDown} // Handle Esc key for accessibility
        >
          <div className="w-full">
            <div
              className="w-full flex gap-4 py-3 px-2 cursor-pointer border-r justify-between"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedCountry ? (
                <div className="flex gap-2 items-center">
                  <img src={selectedCountry.flagurl} alt={selectedCountry.countryname} className="size-5" />
                  <span className="font-ubuntu font-semibold">{selectedCountry.countrycode}</span>
                  <span className="font-ubuntu">{selectedCountry.countryname}</span>
                </div>
              ) : (
                <span className="font-ubuntu text-gray-500">Select Country</span>
              )}
              <SelectorIcon fillColor={theme === "dark" ? "gray" : "black"} />
            </div>

            {dropdownOpen && (
              <div className="absolute z-[999] w-full bg-white dark:bg-black shadow-md mt-2 rounded-md max-h-48 overflow-y-auto">
                {CountryCodeData.map((data, index) => (
                  <div
                    key={index}
                    className="flex gap-2 items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer"
                    onClick={() => handleCountrySelect(data.countrycode)}
                  >
                    <img src={data.flagurl} alt={data.countryname} className="size-5" />
                    <span className="font-ubuntu font-semibold">{data.countrycode}</span>
                    <span className="font-ubuntu">{data.countryname}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            type="text"
            readOnly
            placeholder="Code"
            className="py-3 text-center w-20 border-transparent focus:outline-none"
            value={selectedCountry?.countrycode || ""}
          />
          <input
            type="text"
            placeholder="Mobile Number"
            {...register("mobileNumber")}
            className="p-3 w-full"
          />
        </div>

        <Button
          className="w-full font-ubuntu"
          onClick={handleSubmit(handleMobileNumberSubmit)}
          disabled={!isValid || isSubmitting} // Disable until valid
        >
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
      {/* </div> */}

      {errors.mobileNumber && (
        <span className="text-red-500">{errors.mobileNumber.message}</span>
      )}

      {showOtpField && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="px gap-3 flex items-center w-full">
          <Input type="text" placeholder="Enter OTP" {...register("otp")} className=" w-full" maxLength={6} />
          <Button
            className="font-ubuntu max-sm:w-full"
            onClick={handleSubmit(handleOtpSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default MobileNumberForm;

