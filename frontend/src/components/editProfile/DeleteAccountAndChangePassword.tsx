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
import { USER_API } from "@/lib/env";
import { useAuthContext } from "@/context/authContext";

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

const DeleteAccountAndChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const navigate = useNavigate();
  const {setIsLoggedIn} = useAuthContext();
  const confirmDelete = async (data: FieldValues) => {
    const jwt = getVerifiedToken();
    try {
      const response = await axios.post(`${USER_API}/delete-account`, data, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      });

      if (response && response.data && response.data.success) {
        userLogout();
        setIsLoggedIn(false);
        SuccessToast(response.data.message);
        navigate("/");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error :any) {
      ErrorToast(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full flex sm:flex-row justify-between items-start px-2 py-4 gap-3">
        <Button
          className=" dark:bg-amber-700/50 bg-amber-300 hover:bg-amber-600 font-semibold font-ubuntu text-black dark:text-white/80"
          onClick={() => navigate("/reset-password")}
          >
          Change Password
        </Button>

        {/* Delete Account Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="dark:bg-red-600/50 bg-red-300 hover:bg-red-600 dark:hover:bg-red-500 transition-colors duration-200 font-semibold font-ubuntu text-black dark:text-white/80 ">
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px] p-6 shadow-lg rounded-lg dark:bg-gray-800 bg-white">
            <DialogHeader>
              <DialogTitle className="space-x-2 flex justify-start items-center">
                <WarningIcon fillColor="red" />
                <span className="font-ubuntu text-2xl font-bold text-red-700 dark:text-red-400">
                  Warning
                </span>
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300 text-base mt-2">
                Are you sure? You really want to{" "}
                <span className="font-bold">delete</span> your account
                permanently.
              </DialogDescription>
            </DialogHeader>

            <div className="gap-4 pb-4 flex flex-col justify-start items-center">
              {/* Warning List */}
              <ul className="w-full bg-gray-50 dark:bg-gray-900 text-sm p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                {[
                  "This action cannot be undone.",
                  "You will lose access to your account.",
                  "You will lose all associated data of your account.",
                  "You will not be able to recover your account.",
                ].map((message, index) => (
                  <li key={index} className="flex items-center mb-2">
                    <span className="text-red-600 dark:text-red-400 font-bold text-lg mr-2">
                      !
                    </span>
                    <span className="text-gray-800 dark:text-gray-300">
                      {message}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Password Input Form */}
              <form
                onSubmit={handleSubmit(confirmDelete)}
                className="w-full flex flex-col gap-3 mt-4"
              >
                <div className="relative w-full">
                  <input
                    type={"password"}
                    placeholder="Enter your password"
                    className={`p-3 border rounded-md w-full text-gray-900 dark:text-white dark:bg-gray-700 bg-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.password ? "border-red-500 focus:ring-red-700" : ""
                    }`}
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-700 text-sm mt-1">
                      {typeof errors.password.message === "string"
                        ? errors.password.message
                        : "An error occurred"}
                    </p>
                  )}
                </div>

                <DialogFooter className="flex justify-between mt-4">
                  <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 transition-colors duration-200 text-white font-semibold px-4 py-2 rounded-md"
                  >
                    Confirm Deletion
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default DeleteAccountAndChangePassword;
