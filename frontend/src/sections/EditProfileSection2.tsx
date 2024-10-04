import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { Button } from '@nextui-org/react';

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
})


type editProfileLastAndFullNameData = z.infer<typeof editProfileLastAndFullNameSchema>;
const EditProfileSection2 = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<editProfileLastAndFullNameData>({
    resolver: zodResolver(editProfileLastAndFullNameSchema),
  });

  const onSubmit = (data: editProfileLastAndFullNameData) => {
    console.log(data);
  }
  return (
    <form className="w-full flex flex-col justify-between items-start px-2 py-4 gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative w-full flex flex-col sm:flex-row items-start justify-between gap-2 ">
              <div className=" w-full flex justify-center flex-col items-start">
                <input
                  type="text"
                  placeholder="First Name"
                  className={`p-3 border rounded-md w-full text-black dark:text-white  ${
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
                  className={`p-3 border rounded-md w-full text-black dark:text-white ${
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
            </div>

            <Button type="submit" >Update</Button>
          
        </form>
  )
}

export default EditProfileSection2
