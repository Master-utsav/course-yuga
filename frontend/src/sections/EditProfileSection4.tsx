import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import WarningIcon from "@/Icons/WarningIcon";
import { Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import { useNavigate } from "react-router-dom";
import { getVerifiedToken } from "@/lib/cookieService";
import { userLogout } from "@/lib/getLocalStorage";

const USER_DELETE_URL = import.meta.env.VITE_PUBLIC_USER_DELETE_URL!;
// Password Validation Schema
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(passwordRegex, {
      message:
        "Password must contain at least one uppercase, one lowercase, one digit, and one special character",
    }),
});

type FieldValues = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const EditProfileSection4 = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const navigate = useNavigate();
  const submitOTP = async (data: FieldValues) => {
    console.log(USER_DELETE_URL);
    const jwt = getVerifiedToken();
    try {
      const response = await axios.post(
        USER_DELETE_URL,
        data,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response && response.data && response.data.success) {
        userLogout();
        SuccessToast(response.data.message);
        navigate("/");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error.response?.data?.message || "Something went wrong");
    }
    console.log("Password:", data.password as string);
  };
  
  const handleChangePassword = () => {
    navigate("/reset-password");
  }
  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-start px-2 py-4 gap-3">
      {/* Delete Account Button */}
      <Button className="bg-amber-700" onClick={handleChangePassword}>Change Password</Button>

      {/* Change Password Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-red-600">Delete Account</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader >
            <DialogTitle className="space-x-2 flex justify-start items-center">
              <WarningIcon fillColor="red" /> 
              <span className="font-ubuntu text-xl font-semibold">Warning</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure? You really want to delete your account permanently.
            </DialogDescription>
          </DialogHeader>

          <div className="gap-4 pb-4 flex flex-col justify-start items-center">
            <ul className="w-full dark:bg-white/10 bg-black/10 font-mono text-sm  p-4 rounded-md">
              <li >
                <span className="text-red-800 font-extrabold px-1 text-lg font-ubuntu">
                  !
                </span>
                This action cannot be undone.
              </li>
              <li className="h-px bg-gray-300 w-full my-1"></li>
              <li >
                <span className="text-red-800 font-extrabold px-1 text-lg font-ubuntu">
                  !
                </span>
                You will lose access to your account
              </li>
              <li className="h-px bg-gray-300 w-full my-1"></li>
              <li >
                <span className="text-red-800 font-extrabold px-1 text-lg font-ubuntu">
                  !
                </span>
                You will lose all associated data of your account.
              </li>
              <li className="h-px bg-gray-300 w-full my-1"></li>

              <li>
                <span className="text-red-800 font-extrabold px-1 text-lg font-ubuntu">
                  !
                </span>
                You will not be able to recover your account.
              </li>
              <li className="h-px bg-gray-300 w-full my-1"></li>
            </ul>

            {/* Password Input Form */}
            <form
              onSubmit={handleSubmit(submitOTP)}
              className="w-full flex flex-col gap-2"
            >
              <div className="relative w-full flex justify-end flex-col items-end">
                <div className="relative w-full">
                  <input
                    type={"password"}
                    placeholder="Enter your password"
                    className={`p-3 border rounded-md w-full dark:text-white text-black dark:bg-black bg-white ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-900 text-sm text-end w-[90%]">
                    {typeof errors.password.message === "string"
                      ? errors.password.message
                      : "An error occurred"}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button type="submit" className="bg-red-700">
                  Delete Confirm
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfileSection4;
