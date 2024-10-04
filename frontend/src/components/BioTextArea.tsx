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
import { SuccessToast } from "@/lib/toasts"

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

export function BioTextArea() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // TODO: adding a bio
    SuccessToast(`Your Bio is : ${data.bio}`)
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
