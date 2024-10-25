import { IVideoData } from "@/constants";
import {
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WarningIcon from "@/Icons/WarningIcon";
import { getVerifiedToken } from "@/lib/cookieService";
import axios from "axios";
import { VIDEO_API } from "@/lib/env";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import { Label } from "../ui/label";

interface VideoCardProps {
  video: IVideoData;
  onRefresh: (fresh: boolean) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onRefresh }) => {
  const [inputValue, setInputValue] = useState("");
  const [isInputValid, setIsInputValid] = useState(false);
  const { onClose, isOpen, onOpen } = useDisclosure();
  const navigate = useNavigate();

  const handleInputChange = (event: { target: { value: string } }) => {
    const { value } = event.target;
    setInputValue(value);
    setIsInputValid(value === "Confirm Delete");
  };

  async function handleConfirmDelete() {
    if (inputValue.trim() === `Confirm Delete`) {
      await confirmDelete();
    } else {
      ErrorToast("Please enter the correct phrase");
    }
  }

  async function confirmDelete() {
    const jwt = getVerifiedToken();
    const videoId = video.videoId;
    try {
      const response = await axios.post(
        `${VIDEO_API}/delete-video`,
        { videoId },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response && response.data && response.data.success) {
        SuccessToast(response.data.message);
        onRefresh(true);
        onClose();
      } else {
        ErrorToast(response.data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error?.response.data.message || "Something went wrong");
    }
  }

  return (
    <div className="w-full h-auto flex flex-col gap-2 justify-start items-start relative p-2 rounded-xl bg-white-700 dark:bg-gray-900">
      <Image
        isBlurred
        src={video.thumbnail}
        alt="course-img"
        className="z-0 object-cover p-2 aspect-video"
      />

      <div className="flex flex-col justify-between items-start space-y-1">
        <h2 className="text-xl line-clamp-2 font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          {video.videoName}
        </h2>

        <h4 className="text-base text-gray-600 dark:text-white font-ubuntu">
          {video.tutorName}
        </h4>

        <i className="text-gray-600 dark:text-gray-400 text-sm font-extralight font-libre line-clamp-3">
          {video?.description}
        </i>
      </div>

      <Button
        className="
    w-full py-3 font-ubuntu text-base font-medium 
    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
    shadow-md hover:shadow-lg transition-all duration-300
    hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500
    text-white
  "
        onClick={() => navigate(`/user/edit-video?v=${video.videoId}`)}
      >
        Edit Video
      </Button>
      <>
        <Button
          className="
    w-full py-3 font-ubuntu text-base font-medium 
    bg-red-300/50 dark:bg-red-500/50 
    hover:bg-red-400 hover:dark:bg-red-600
    transition-colors duration-300 shadow-md hover:shadow-lg
    text-black dark:text-white/80
  "
          onPress={onOpen}
        >
          Delete Video
        </Button>

        <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
          <ModalContent className="sm:max-w-[480px] p-6 shadow-lg rounded-lg dark:bg-gray-800 bg-white">
            <ModalHeader className="flex flex-col gap-1">
              <div className="w-full space-x-2 flex justify-start items-center">
                <WarningIcon fillColor="red" />
                <span className="font-ubuntu text-2xl font-bold text-red-700 dark:text-red-400">
                  Warning
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-base mt-2">
                Are you sure? You really want to{" "}
                <span className="font-bold">delete</span> this video
                permanently.
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="gap-4 pb-4 flex flex-col justify-start items-center">
                {/* Warning List */}
                <ul className="w-full bg-gray-50 dark:bg-gray-900 text-sm p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  {[
                    "This action cannot be undone.",
                    "You will not be able to recover this video.",
                    "All data related to this video will be deleted permanently.",
                  ].map((message, index) => (
                    <li key={index} className="flex items-center mb-2">
                      <span className="text-red-600 dark:text-red-400 font-bold text-lg mr-2">
                        !
                      </span>
                      <span className="text-gray-800 dark:text-gray-300">
                        {message}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Confirmation Input Form */}
                <div className="w-full flex flex-col gap-3 mt-4">
                  <Label>
                    Type{" "}
                    <span className="font-ubuntu font-semibold ">
                      Confirm Delete
                    </span>{" "}
                    for delete the video
                  </Label>
                  <Input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className={`p-1 border-[1px] rounded-md w-full text-gray-900 dark:text-white dark:bg-gray-700 bg-gray-100 ${
                      inputValue !== "Confirm Delete"
                        ? "border-red-300"
                        : "border-green-500"
                    }`}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-between mt-4">
              <Button
                color="danger"
                type="submit"
                isDisabled={!isInputValid}
                variant="ghost"
                onClick={handleConfirmDelete}
              >
                Confirm Deletion
              </Button>
              <Button color="default" onPress={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};

export default VideoCard;
