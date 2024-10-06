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
import axios from "axios"
import { getVerifiedToken } from "@/lib/cookieService"
import { USER_API } from "@/lib/env"

const FormSchema = z.object({
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 30 characters.",
    }),
})

export function BioForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

 async function onSubmit(data: z.infer<typeof FormSchema>) {
    const bio = data.bio;
    const jwt = getVerifiedToken();
    
    try {
        const response = await axios.put(`${USER_API}update-user` , {bio} , {
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
  }

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 items-end grid">
        <FormField
          control={form.control}
          name="bio"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Update your Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Update you Bio / tell more about yourself"
                  className="resize-none"
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
        <Button type="submit" className="">Submit</Button>
      </form>
    </Form>
  )
}
