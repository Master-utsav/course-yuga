import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, DatePicker, Select, SelectItem } from "@nextui-org/react";
import SelectorIcon from "@/Icons/SelectorIcon";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import axios from "axios";
import { USER_API } from "@/lib/env";
import { getVerifiedToken } from "@/lib/cookieService";

// Zod validation schema
const schema = z.object({
  dob: z.string().min(1, "Date of Birth is required"),
  role: z.string().min(1, "Please select a role."),
});

interface DobAndRoleFormProps {
  theme: string;
}

function convertDateFormat(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}

type DobAndRoleFormData = z.infer<typeof schema>;

const DobAndRoleForm: React.FC<DobAndRoleFormProps> = ({ theme }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DobAndRoleFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async(data: DobAndRoleFormData) => {
    const userDob = convertDateFormat(data.dob);
    const role:string = data.role === "0" ?  "STUDENT" : "TEACHER"
    const jwt = getVerifiedToken();

    try {
        const response = await axios.put(`${USER_API}update-user` , {userDob, role} , {
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
    <div className="w-full relative justify-start items-start gap-2 flex sm:flex-row flex-col ">
      <div className="w-full flex flex-col relative">
        <DatePicker
          label="Birth Date"
          variant="bordered" 
          showMonthAndYearPickers
          className="w-full"
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

      {/* Role Selection Field */}
      <div className="w-full relative">
        <Select
          label=""
          placeholder="Change your Role"
          labelPlacement="outside"
          className="w-full border-2 rounded-md dark:border-white/20 border-black/40 py-1"
          style={{ background: "transparent" }}
          disableSelectorIconRotation
          selectorIcon={
            theme === "dark" ? (
              <SelectorIcon fillColor="gray" />
            ) : (
              <SelectorIcon fillColor="gray" />
            )
          }
          {...register("role")} 
        >
          {["Student", "Teacher"].map((role, index) => (
            <SelectItem key={index} value={role} className="w-full">
              {role}
            </SelectItem>
          ))}
        </Select>
        {errors.role && errors.role.message && (
          <p className="text-red-500 text-sm text-end">
            {errors.role.message}
          </p>
        )}
      </div>

      <Button
        className="font-ubuntu text-semibold"
        type="button"
        onClick={handleSubmit(onSubmit)}
      >
        Update
      </Button>
    </div>
  );
};

export default DobAndRoleForm;
