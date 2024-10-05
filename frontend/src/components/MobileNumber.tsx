import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import { useForm } from "react-hook-form"; // Import react-hook-form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"; // Integrate zod resolver
import SelectorIcon from "@/Icons/SelectorIcon";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import { USER_API } from "@/lib/env";
import { getVerifiedToken } from "@/lib/cookieService";
import axios from "axios";
// Define a type for country data
interface Country {
  countrycode: string;
  countryname: string;
  flagurl: string;
}

// Props for the component
interface CountrySelectProps {
  CountryCodeData: Country[];
  theme: string;
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

const MobileNumber: React.FC<CountrySelectProps> = ({
  CountryCodeData,
  theme,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [showOtpField, setShowOtpField] = useState<boolean>(false);

  // Using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<MobileFormValues>({
    resolver: zodResolver(mobileSchema),
  });
  
  if (!selectedCountry) {
    setValue("countryCode", "");
  }
  const jwt = getVerifiedToken();

  const handleMobileNumberSubmit = async(data: MobileFormValues) => {
    const to:string = data.countryCode + data.mobileNumber;
    try {
      const response = await axios.post(`${USER_API}verify-mobile-number-send-otp` , {to} , {
        headers: {
           Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      })

      if(response && response.data && response.data.success){
        SuccessToast(response.data.message);
        setShowOtpField(true);
      }
      else{
        ErrorToast(response.data.message);
      }
       
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error.response?.data?.message || "Something went wrong");
    }
  };
  
  const handleCountrySelect = (countryCode: string) => {
    const selected = CountryCodeData.find(
      (country) => country.countrycode === countryCode
    );
    if (selected) {
      setSelectedCountry(selected);
      setValue("countryCode", selected.countrycode);
    }
    setDropdownOpen(false);
  };

  // Handle OTP submission
  const handleOtpSubmit = async(data: MobileFormValues) => {
    const twilioFormatedData = {
      to: data.countryCode + data.mobileNumber,
      code: data.otp
    }

    if(data.otp?.trim() === ""){
      ErrorToast("Please Enter the OTP");
    }
    else if(data.otp?.length !== 6){
      ErrorToast("OTP must be 6 numbers");
    }
    else{
      try {
        const response = await axios.post(`${USER_API}verify-mobile-number-otp-check` , twilioFormatedData , {
          headers: {
             Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        })
  
        if(response && response.data && response.data.success){
          SuccessToast(response.data.message);
          setShowOtpField(false);
          setValue("otp" , "")
        }
        else{
          ErrorToast(response.data.message);
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        ErrorToast(error.response?.data?.message || "Something went wrong");
      }
    }
    


  };

  return (
    <div className="w-full flex items-center justify-start gap-2 relative">
      {/* Country and Mobile Number Input */}
      <div className="w-1/2 flex justify-center flex-row items-start border rounded-md text-black dark:text-white dark:bg-black/10 bg-white-800/10 relative">
        <div className="relative w-1/2">
          {/* Custom dropdown */}
          <div
            className="w-full flex flex-row gap-4  border-gray-300 py-3 px-2 cursor-pointer outline-none border-r-[1px] dark:border-r-white/20 border-r-black/40 justify-between"
            style={{ background: "transparent" }}
            onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown on click
          >
            {selectedCountry ? (
              <div className="w-full flex flex-row gap-2 justify-start items-center outline-none border-none">
                <img
                  src={selectedCountry.flagurl}
                  alt={selectedCountry.countryname}
                  className="size-5"
                />
                <span className="font-ubuntu font-semibold">
                  {selectedCountry.countrycode}
                </span>
                <span className="text-start font-ubuntu">
                  {selectedCountry.countryname}
                </span>
              </div>
            ) : (
              <span className="font-ubuntu text-gray-500">Select Country</span>
            )}

            {theme === "dark" ? (
              <SelectorIcon fillColor="gray" />
            ) : (
              <SelectorIcon fillColor="black" />
            )}
          </div>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="z-[999] absolute w-full bg-white/20 dark:bg-black dark:text-white text-black shadow-md mt-2 rounded-md max-h-48 overflow-y-auto scrollbar-none">
              {CountryCodeData.map((data, index) => (
                <div
                  key={index}
                  className="w-full flex flex-row gap-2 justify-start items-center p-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-900"
                  onClick={() => handleCountrySelect(data.countrycode)} // Select country and close dropdown
                >
                  <div className="w-1/3 flex flex-row gap-2">
                    <img
                      src={data.flagurl}
                      alt={data.countryname}
                      className="size-5"
                    />
                    <span className="font-ubuntu font-semibold">
                      {data.countrycode}
                    </span>
                  </div>
                  <span className="text-start font-ubuntu">
                    {data.countryname}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          className="flex justify-center items-center"
        >
          <input
            type="text"
            readOnly
            placeholder="Code"
            className={`py-3 text-center border rounded-md text-black w-20 dark:text-white dark:bg-black/10 bg-white-800/10 border-transparent focus:outline-none`}
            value={selectedCountry?.countrycode || ""} // Directly set the input value to selectedCountry
          />

          <input
            type="text"
            placeholder="Mobile Number"
            {...register("mobileNumber")}
            className={`p-3 border rounded-md w-full text-black dark:text-white dark:bg-black/10 bg-white-800/10 border-transparent`}
          />
        </div>
      </div>
      
      {/* Update button for form submission */}
      <div className="flex items-center justify-start gap-2">
        <div className="flex flex-col items-center justify-start gap-2 ">
          {errors.countryCode && (
            <p className="text-red-500 text-sm text-end">
              {errors.countryCode.message}
            </p>
          )}
          {errors.mobileNumber && (
            <p className="text-red-500 text-sm text-end">
              {errors.mobileNumber.message}
            </p>
          )}
        </div>

        {!showOtpField && (
          <Button
            className="font-ubuntu text-semibold"
            type="button"
            onClick={handleSubmit(handleMobileNumberSubmit)}
          >
            Update
          </Button>
        )}
      </div>

      {/* OTP Section (appears only if mobile number is valid) */}
      {showOtpField && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: showOtpField ? 1 : 0,
            // height: showOtpField ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
          className="flex items-center w-1/2"
        >
          <input
            type="text"
            placeholder="Enter OTP"
            {...register("otp")}
            className="p-3 border rounded-md  text-black dark:text-white dark:bg-black/10 bg-white-800/10 outline-none focus:outline-none focus:border-b-[1px] border-transparent focus:border-b-black dark:focus:border-b-white/40"
            maxLength={6} // Limit input to 6 digits
          />

          {errors.otp && <p className="text-red-500">{errors.otp.message}</p>}
          {showOtpField && !errors.otp && (
            <Button
              className="font-ubuntu text-semibold"
              type="button"
              onClick={handleSubmit(handleOtpSubmit)}
            >
              Submit
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MobileNumber;
