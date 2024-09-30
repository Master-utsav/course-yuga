import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { HoverCard, HoverCardTrigger } from "./ui/hover-card";
import ProfileIcon from "@/Icons/ProfileIcon";
import BookmarkIcon from "@/Icons/BookmarkIcon";
import SubscriptionIcon from "@/Icons/SubscriptionIcon";
import HistoryIcon from "@/Icons/HistoryIcon";
import LogoutIcon from "@/Icons/LogoutIcon";
import { useNavigate } from "react-router-dom";

interface AvatarProps {
  avatarFallbackText?: string;
  imageUrl?: string | "";
  firstName?: string;
  lastName?: string;
  username?: string;
}

const AvatarComponent: React.FC<AvatarProps> = ({
  avatarFallbackText = "UK",
  firstName = "Unknown",
  imageUrl,
  lastName = "User",
  username = "unknow_user",
}) => {
  const fullName = firstName + " " + lastName;
  const navigate = useNavigate();

  const handelLogout = () => navigate("/logout");
  return (
    <HoverCard>
      <HoverCardTrigger>
        <DropdownMenu>
          <DropdownMenuTrigger className="focus-visible:outline-none">
            <Avatar className="border-2 border-purple-500">
              {/* userData?.image  */}
              <AvatarImage src={imageUrl} className="" />
              <AvatarFallback className="font-sans font-bold text-xl dark:text-black dark:bg-white text-white bg-black ">
                {avatarFallbackText}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="overflow-hidden backdrop-blur-md dark:bg-black/70 bg-white/70 font-ubuntu font-semibold mt-1">
            <DropdownMenuLabel className="flex gap-1">
              <Avatar className="border-2 border-purple-500">
                <AvatarImage src={imageUrl} className="" />
                <AvatarFallback className="font-sans font-bold text-xl dark:text-black dark:bg-white text-white bg-black ">
                  {avatarFallbackText}
                </AvatarFallback>
              </Avatar>
              <div className="text-center content-center flex-col flex">
                <span className="text-center mx-2">{fullName}</span>
                <span className="text-blue-500 text-sm">@{username}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="border-b-2 flex gap-2">
              <ProfileIcon fillColor="rgb(74 222 128)" />
              <span>Edit Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="border-b-2 flex gap-2">
              <BookmarkIcon fillColor="rgb(168 85 247)" />
              <span>Bookmarks</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="border-b-2 flex gap-2">
              <SubscriptionIcon fillColor="rgb(37 99 235)" />
              <span>Subscriptions</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="border-b-2 flex gap-2">
              <HistoryIcon fillColor="rgb(245 158 11)" />
              <span>History</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-2" onClick={handelLogout}>
              <LogoutIcon fillColor="red" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </HoverCardTrigger>
    </HoverCard>
  );
};

export default AvatarComponent;
