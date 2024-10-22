import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, DatePicker } from "@nextui-org/react";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import { getVerifiedToken } from "@/lib/cookieService";
import { USER_API } from "@/lib/env";
import axios from "axios";
import { useAuthContext } from "@/context/authContext";
import { getUserData as fetchUserData} from "@/lib/authService";


// Zod validation schema
const schema = z.object({
  dob: z.string().min(1, "Date of Birth is required"),
});

function convertDateFormat(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}

type DobAndRoleFormData = z.infer<typeof schema>;

const DobForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DobAndRoleFormData>({
    resolver: zodResolver(schema),
  });
  const {setUserData} = useAuthContext();
  const loadUserData = useCallback(async () => {
    const userData = await fetchUserData(); 
    if (userData) {
      setUserData(userData);
    }
  }, [setUserData]);

  const onSubmit = async(data: DobAndRoleFormData) => {
    const userDob = convertDateFormat(data.dob);

    const jwt = getVerifiedToken();

    try {
        const response = await axios.put(`${USER_API}/update-user` , {userDob} , {
            headers: {
                Authorization: `Bearer ${jwt}`,
                "Content-Type": "application/json",
            },
        })

        if(response && response.data && response.data.success){
            SuccessToast(response.data.message);
            loadUserData();
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
    <div className="w-full relative justify-end items-start gap-2 flex sm:flex-row flex-col ">
      <div className="w-full flex flex-col relative">
        <DatePicker
          label="Birth Date"
          variant="bordered" 
          showMonthAndYearPickers
          className=""
          {...register("dob")} // Register DOB field
          onChange={(date) => {
            const selectedDate = new Date(date?.toString() || "");
            const currentDate = new Date();
    
            if (selectedDate > currentDate) {
              setValue("dob", ""); 
              ErrorToast("You cannot select a future date.");
            } else {
              setValue("dob", date?.toString() || ""); 
            }
          }}
        />
        {errors.dob && errors.dob.message && (
          <p className="text-red-500 text-sm text-end ">
            {errors.dob.message}
          </p>
        )}
      </div>

      <Button
        className="font-ubuntu font-medium"
        type="button"
        onClick={handleSubmit(onSubmit)}
      >
        Update
      </Button>
    </div>
  );
};

export default DobForm;