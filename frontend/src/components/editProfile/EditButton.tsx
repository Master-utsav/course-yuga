import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditIcon from "@/Icons/EditIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getVerifiedToken } from "@/lib/cookieService";
import axios from "axios";
import { USER_API } from "@/lib/env";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import {getUserData} from "@/lib/authService";
import {useAuthContext} from "@/context/authContext";

interface EditButtonProps {
  theme: string;
  imageUrl: string;
  avatarFallbackText: string;
  userName: string;
}

const EditButton: React.FC<EditButtonProps> = ({
  theme,
  imageUrl,
  avatarFallbackText,
  userName,
}) => {

  const [updatedImageFile, setUpdatedImageFile] = React.useState<File | null>(null);
  const {setUserData} = useAuthContext();
  const loadUserData = React.useCallback(async () => {
    const userData = await getUserData(); 
    if (userData) {
      setUserData(userData);
    }
  }, [setUserData]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file !== undefined) {
      setUpdatedImageFile(file as File);
    }
  };

  const handleImageEditBtnSubmit = async () => {
    if(updatedImageFile){
      const formData = new FormData();
      formData.append("image", updatedImageFile);
      const jwt = getVerifiedToken();

      try {
        const response = await axios.post(
          `${USER_API}/update-user-image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response && response.data && response.data.success) {
          SuccessToast(response.data.message);
          setUpdatedImageFile(null);
          loadUserData();
        } else {
          ErrorToast(response.data.message);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        ErrorToast(error.response?.data?.message);
      }
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="p-2">
          {theme === "dark" ? (
            <EditIcon fillColor="gray" />
          ) : (
            <EditIcon fillColor="gray" />
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
        <div className="flex flex-col gap-4 py-4">
          <div className="w-full flex items-center gap-2 font-ubuntu justify-center relative">
            <Avatar className="border-2 border-blue-500 w-28 h-28">
              {updatedImageFile ? (
                <img
                src={URL.createObjectURL(updatedImageFile)} // Convert file object to URL
                alt="Selected Avatar"
                className="w-full h-full object-cover"
              />
              ) : (
                imageUrl && (
                  <>
                    <AvatarImage src={imageUrl} className="" />{" "}
                    <AvatarFallback className="font-sans font-bold text-xl dark:text-black dark:bg-white text-white bg-black ">
                      {avatarFallbackText}
                    </AvatarFallback>
                  </>
                )
              )}
            </Avatar>
            <div className="w-full absolute inset-0 top-10 flex flex-col items-center space-y-11 justify-center">
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {
                    updatedImageFile ? (
                      <EditIcon fillColor="rgba(146, 162, 168 , 0)" size={30} />
                    ) : (
                      <EditIcon fillColor="white" size={30} />
                    )
                  }
                </label>
                {!!updatedImageFile && (
                  <div className="flex justify-center items-center ">
                    <Button
                      type="submit"
                      onClick={handleImageEditBtnSubmit}
                      className="font-ubuntu font-medium"
                    >
                      upload
                    </Button>
                  </div>
                )}
              </div>
            
          </div>
          <div className="flex flex-col items-start justify-center gap-2 font-ubuntu mt-10">
            <Label htmlFor="userName" className="text-start">
              Username
            </Label>
            <Input
              id="userName"
              readOnly
              defaultValue={`@${userName}`}
              className="col-span-4"
              type="text"
            />
          </div>
        </div>
        {/* <DialogFooter>
          <Button
            type="submit"
            onClick={handleEditBtnSubmit}
            className="font-ubuntu font-medium"
          >
            Save changes
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default EditButton;
