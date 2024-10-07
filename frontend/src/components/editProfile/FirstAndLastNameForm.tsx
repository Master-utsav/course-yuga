import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { USER_API } from "@/lib/env";
import { getVerifiedToken } from "@/lib/cookieService";
import axios from "axios";
import { ErrorToast, SuccessToast } from "@/lib/toasts";

const firstNameRegex = /^[a-zA-Z]{2,}$/;

const editProfileLastAndFullNameSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" })
    .regex(firstNameRegex, {
      message: "First name should only contain letters",
    }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" })
    .regex(firstNameRegex, {
      message: "Last name should only contain letters",
    }),
});

type editProfileLastAndFullNameData = z.infer<
  typeof editProfileLastAndFullNameSchema
>;

const FirstAndLastNameForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<editProfileLastAndFullNameData>({
    resolver: zodResolver(editProfileLastAndFullNameSchema),
  });

  const onSubmit = async(data: editProfileLastAndFullNameData) => {
    const firstName = data.firstName;
    const lastName = data.lastName;
    const jwt = getVerifiedToken();

    try {
        const response = await axios.put(`${USER_API}update-user` , {firstName, lastName} , {
            headers: {
                Authorization: `Bearer ${jwt}`,
                "Content-Type": "application/json",
            },
        })

        if(response && response.data && response.data.success){
            SuccessToast(response.data.message);
        }
        else{
            ErrorToast(response.data.message);
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        ErrorToast(error.response?.data?.message);
    }
  };
  return (
    <div className="relative w-full flex flex-col sm:flex-row items-start justify-between gap-2 ">
      <div className="w-full flex justify-center flex-col items-end">
        <input
          type="text"
          placeholder="First Name"
          className={`p-3 border rounded-md w-full text-black dark:text-white dark:bg-black/10 bg-white-800/10 dark:border-white-800/20 border-black/20 ${
            errors.firstName ? "border-red-500" : ""
          }`}
          {...register("firstName")}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm text-end">
            {errors.firstName.message}
          </p>
        )}
      </div>
      <div className="w-full flex justify-center flex-col items-end">
        <input
          type="text"
          placeholder="Last Name"
          className={`p-3 border rounded-md w-full text-black dark:text-white dark:bg-black/10 bg-white-800/10 dark:border-white-800/20 border-black/20 ${
            errors.lastName ? "border-red-500" : ""
          }`}
          {...register("lastName")}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm text-end">
            {errors.lastName.message}
          </p>
        )}
      </div>
      <Button
        type="button"
        className="font-medium font-ubuntu"
        onClick={handleSubmit(onSubmit)}
      >
        Update
      </Button>
    </div>
  );
};

export default FirstAndLastNameForm;
