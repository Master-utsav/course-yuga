import { ICourseData } from "@/constants";
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
import React from "react";
import RatingComponent from "../RatingComponent";
import { useNavigate } from "react-router-dom";
import WarningIcon from "@/Icons/WarningIcon";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getVerifiedToken } from "@/lib/cookieService";
import axios from "axios";
import { COURSE_API } from "@/lib/env";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import { useVideoContext } from "@/context/videoContext";
import Seperator from "../Seperator";

interface VideoCourseCardProps {
  courseData: ICourseData;
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(passwordRegex, {
      message:
        "Password must contain at least one uppercase, one lowercase, one digit, and one special character",
    }),
});

type resetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const VideoCourseCard: React.FC<VideoCourseCardProps> = ({ courseData }) => {
  const { setRefresh } = useVideoContext();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function confirmDelete(data: resetPasswordFormData) {
    const jwt = getVerifiedToken();
    const password = data.password;
    const courseId = courseData.courseId;
    try {
      const response = await axios.post(
        `${COURSE_API}/delete-course`,
        { password, courseId },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response && response.data && response.data.success) {
        SuccessToast(response.data.message);
        setRefresh(true);
        onClose();
      } else {
        ErrorToast(response.data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error?.response.data.message || "Something went wrong");
    }
  }

  const nameParams = courseData.courseName.includes("&")
    ? courseData.courseName.replace("&", "and")
    : courseData.courseName;
  return (
    <div className="w-full relative flex flex-col py-1">
      <Seperator text={courseData.courseName} />
      <div className="w-full h-auto flex gap-2 justify-start items-center relative px-2">
        <div className="w-1/4">
          <Image
            isBlurred
            src={courseData.thumbnail}
            alt="course-img"
            className="z-0 object-cover p-2 aspect-video"
          />
        </div>
        <div className="flex flex-col justify-between items-start space-y-4 w-1/2 relative">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            {courseData.courseName}
          </h2>

          <h4 className="text-lg text-gray-600 dark:text-white font-ubuntu">
            {courseData.tutorName}
          </h4>

          <i className="w-full text-gray-600 dark:text-gray-400 text-sm font-extralight font-libre line-clamp-3s break-words">
            {courseData.description}
          </i>

          <div className="flex justify-start items-center gap-2">
            <RatingComponent rating={courseData.rating} />
            <span className="font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              ({courseData.ratingCount})
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-4 text-base font-medium font-ubuntu justify-end  w-1/4 items-center">
          {courseData.courseType === "REDIRECT" ? (
            <Button
              isDisabled
              className="
                    w-full py-3 font-ubuntu text-base font-medium 
    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
    shadow-md hover:shadow-lg transition-all duration-300
    hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500
    text-white"
            >
              <WarningIcon fillColor="yellow" /> Can't manage the videos
            </Button>
          ) : (
            <Button
              className="
                    w-full py-3 font-ubuntu text-base font-medium 
    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
    shadow-md hover:shadow-lg transition-all duration-300
    hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500
    text-white
                "
              onClick={() =>
                navigate(
                  `/user/add-videos?c=${courseData.courseId}&name=${nameParams}`
                )
              }
            >
              Manage Videos
            </Button>
          )}

          <Button
            className="
                    w-full py-3 font-ubuntu text-base font-medium 
    bg-green-500 text-white hover:bg-green-600 
    dark:bg-green-400 dark:hover:bg-green-500 
    shadow-md hover:shadow-lg transition-all duration-300
     
                "
            onClick={() =>
              navigate(`/course-intro-page?c=${courseData.courseId}`)
            }
          >
            Update Course
          </Button>

          <>
            <Button
              className="w-full py-3 font-ubuntu text-base font-medium 
    bg-red-300/50 dark:bg-red-500/50 
    hover:bg-red-400 hover:dark:bg-red-600
    transition-colors duration-300 shadow-md hover:shadow-lg
    text-black dark:text-white/80"
              onPress={onOpen}
            >
              Delete Course
            </Button>

            <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
              <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="w-full space-x-2 flex justify-start items-center">
                    <WarningIcon fillColor="red" />
                    <span className="font-ubuntu text-2xl font-bold text-red-700 dark:text-red-400">
                      Warning
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-base mt-2">
                    Are you sure? You really want to{" "}
                    <span className="font-bold">delete</span> this course
                    permanently.
                  </p>
                </ModalHeader>

                <ModalBody>
                  <div className="gap-4 pb-4 flex flex-col justify-start items-center">
                    {/* Warning List */}
                    <ul className="w-full bg-gray-50 dark:bg-gray-900 text-sm p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      {[
                        "This action cannot be undone.",
                        "You will lose access to your course.",
                        "You will lose all associated data of your course.",
                        "You will not be able to recover your course.",
                        "All course videos, user data will be deleted permanently.",
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

                    {/* Password Input Form */}
                    <div className="w-full flex flex-col gap-3 mt-4">
                      <div className="relative w-full">
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className={`p-3 border rounded-md w-full text-gray-900 dark:text-white dark:bg-gray-700 bg-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                            errors.password
                              ? "border-red-500 focus:ring-red-700"
                              : ""
                          }`}
                          {...register("password")}
                          isInvalid={!!errors.password}
                        />
                        {errors.password && (
                          <p className="text-red-700 text-sm mt-1">
                            {typeof errors.password.message === "string"
                              ? errors.password.message
                              : "An error occurred"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button
                    color="danger"
                    type="submit"
                    variant="light"
                    onClick={handleSubmit(confirmDelete)}
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
      </div>
    </div>
  );
};

export default VideoCourseCard;
