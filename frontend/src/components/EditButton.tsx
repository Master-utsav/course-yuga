import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditIcon from "@/Icons/EditIcon";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface EditButtonProps {
  theme: string;
  imageUrl?: string | "https://github.com/Master-utsav/course-yuga/blob/main/frontend/favicon/android-chrome-512x512.png";
  avatarFallbackText?: string | "UG";
  username?: string | "unknown_user";
}
const EditButton: React.FC<EditButtonProps> = ({
  theme,
  imageUrl,
  avatarFallbackText,
  username,
}) => {

    console.log(theme,
        imageUrl,
        avatarFallbackText,
        username,)
        console.log("edit button renders")
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="p-2">
          {theme === "dark" ? (
            <EditIcon fillColor="white" />
          ) : (
            <EditIcon fillColor="black" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit your username & profile pic</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid  items-center gap-2 font-ubuntu justify-center">
            <Avatar className="border-2 border-blue-500 w-20 h-20">
              <AvatarImage src={imageUrl} className="" />
              <AvatarFallback className="font-sans font-bold text-xl dark:text-black dark:bg-white text-white bg-black ">
                {avatarFallbackText}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="grid grid-cols-4 items-center gap-2 font-ubuntu">
            <Label htmlFor="username" className="text-start">
              Username
            </Label>
            <Input
              id="username"
              defaultValue={`@${username}`}
              className="col-span-4"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditButton;
