import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { ErrorToast, SuccessToast } from "@/lib/toasts"
import { getVerifiedToken } from "@/lib/cookieService"
import { USER_API } from "@/lib/env"
import axios from "axios"
 import { getUserData as fetchUserData} from "@/lib/authService";
import { useCallback } from "react";
import { useAuthContext } from "@/context/authContext"


const FormSchema = z.object({
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(500, {
      message: "Bio must not be longer than 500 characters.",
    }),
})

const BioForm: React.FC = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
 const {setUserData} = useAuthContext();
const loadUserData = useCallback(async () => {
  const userData = await fetchUserData(); 
  if (userData) {
    setUserData(userData);
  }
}, [setUserData]);
 async function onSubmit(data: z.infer<typeof FormSchema>) {
  const bio = data.bio
  const jwt = getVerifiedToken();
    
  try {
      const response = await axios.put(`${USER_API}/update-user` , {bio} , {
          headers: {
              Authorization: `Bearer ${jwt}`,
              "Content-Type": "application/json",
          },
      })

      if(response && response.data && response.data.success){
          SuccessToast(response.data.message);
          form.setValue("bio" , "");
          loadUserData();
      }
      else{
          ErrorToast(response.data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
          ErrorToast(error.response?.data?.message);
      }
  }

  return (
    <Form {...form} >
      <div className="sm:w-2/3 w-full space-y-6 items-end grid">
        <FormField
          control={form.control}
          name="bio"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel className="font-ubuntu font-semibold text-xl sm:text-center text-start">Update your Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Update you Bio / tell more about yourself"
                  className="resize-none"
                  maxLength={500}
                  rows={7}
                  {...field}
                />
              </FormControl>
              {/* <FormDescription>
                You can <span>@mention</span> other users and organizations.
                </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
          />
        <Button type="submit" className="w-full font-ubuntu font-medium max-sm:w-full" onClick={form.handleSubmit(onSubmit)}>Confirm</Button>
      </div>
      </Form>

  )
}

export default BioForm;