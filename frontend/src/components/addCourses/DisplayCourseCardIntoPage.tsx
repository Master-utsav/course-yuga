import React from "react";
import RatingComponent from "../RatingComponent";
import { Chip, Image, Button } from "@nextui-org/react";
import FavoriteIcon from "@/Icons/FavoriteIcon";
import PercentageOffIcon from "@/Icons/PercentageOffIcon";
import { ICourseData } from "@/constants";
import { useAuthContext } from "@/context/authContext";
import YoutubeIcon from "@/Icons/YoutubeIcon";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RedirectLinkIcon from "@/Icons/RedirectLinkIcon";
import { getVerifiedToken } from "@/lib/cookieService";
import axios from "axios";
import { COURSE_API } from "@/lib/env";
import { ErrorToast, SuccessToast, WarningToast } from "@/lib/toasts";

interface DisplayCourseCardIntoPageProps {
  courseData: ICourseData;
  previewImage: string;
}
const DisplayCourseCardIntoPage: React.FC<DisplayCourseCardIntoPageProps> = ({
  courseData,
  previewImage,
}) => {
  
  const { userData } = useAuthContext();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get("courseId");
  const navigate = useNavigate();
  async function handleEnrolledRequest() {
    const jwt = getVerifiedToken();
    if(!jwt){
      navigate("/login");
      WarningToast("Login Required")
      return;
    }

    try {
      const response = await axios.post(
        `${COURSE_API}/enroll-in-course`,
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response && response.data && response.data.success) {
        SuccessToast(response.data.message);
        WarningToast("View you Dashboard");
      } else {
        console.log("this hits")
        ErrorToast(response.data.message);
        WarningToast("Go to your Dashboard");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ErrorToast(error.response?.data?.message || "Something went wrong");
      WarningToast("Go to your Dashboard");
    }
  }
  
  return (
    <div className="w-1/3 p-6 border-l">
      <div className="w-full relative bg-white text-start dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
        <div className="relative w-full">
          <Image
            isBlurred
            src={previewImage}
            alt="course-img"
            className="z-0 object-cover aspect-video rounded-tr-[6rem] p-2"
          />
          <div className="absolute right-2 bottom-[-1rem] dark:bg-gray-600/50 backdrop-blur-lg bg-white/50 p-2 rounded-xl rounded-br-[2rem] rounded-bl-[2rem] shadow-lg text-xl font-libre font-semibold flex gap-1">
            {courseData.sellingPrice === 0 ? (
              <span className="text-xl px-1 font-ubuntu bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-blue-500">
                FREE
              </span>
            ) : (
              <>
                <span className="text-xl font-libre font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  {courseData.currency}
                </span>
                <span className="dark:text-violet-100  text-gray-950">
                  {courseData.sellingPrice}
                </span>
              </>
            )}
          </div>
          <label className="absolute top-2 right-2">
            <FavoriteIcon fillColor={"rgb(239 68 68)"} />
          </label>
        </div>

        <div className="p-3 space-y-2 flex flex-col justify-between">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            {courseData.courseName}
          </h2>

          <h4 className="text-lg text-gray-600 dark:text-white font-ubuntu">
            {courseData.tutorName}
          </h4>

          <i className="text-gray-600 dark:text-gray-400 text-sm font-extralight font-libre line-clamp-3">
            {courseData.description}
          </i>

          <div className="flex justify-between items-center">
            <div className="flex justify-start items-center gap-2">
              <RatingComponent rating={courseData.rating} />
              <span className="font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                ({courseData.ratingCount})
              </span>
            </div>

            <Chip
              startContent={<PercentageOffIcon fillColor="green" size={24} />}
              variant="faded"
              color="success"
              className="font-libre text-sm"
            >
              {courseData.originalPrice === courseData.sellingPrice
                ? 100
                : (
                    ((courseData.originalPrice - courseData.sellingPrice) /
                      courseData.originalPrice) *
                    100
                  ).toFixed(2)}
              {"% "}
              <span className="font-ubuntu">Off</span>
            </Chip>
          </div>

          {courseData.uploadedBy === userData.id ? (
            courseData.courseType === "YOUTUBE" ? (
              <Link to={`/user/add-videos?courseId=${courseId}&name=${courseData.courseName}`}>
                <Button className="w-full font-medium text-lg font-ubuntu bg-blue-500 text-white hover:bg-blue-600">
                  <YoutubeIcon fillColor="white" size={30} /> Manage Uploads
                </Button>
              </Link>
            ) : courseData.courseType === "REDIRECT" &&
              courseData.redirectLink ? (
              <Link
                to={courseData.redirectLink}
                className="w-full mt-2"
                target="_blank"
              >
                <Button className="w-full font-medium text-lg font-ubuntu bg-blue-500 text-white hover:bg-blue-600">
                  <RedirectLinkIcon fillColor="white" size={30} /> Visit Now
                </Button>
              </Link>
            ) : (
              <Link to={`/user/add-videos?courseId=${courseData._id}&courseName=${courseData.courseName}`}>
                <Button className="w-full font-medium text-lg font-ubuntu bg-blue-500 text-white hover:bg-blue-600">
                  <YoutubeIcon fillColor="white" size={30} /> Manage Uploads
                </Button>
              </Link>
            )
          ) : courseData.courseType === "YOUTUBE" ? (
            <Button
              className="w-full font-medium text-lg font-ubuntu bg-blue-500 text-white hover:bg-blue-600"
              onClick={handleEnrolledRequest}
            >
              <YoutubeIcon fillColor="white" size={30} /> Enroll Now
            </Button>
          ) : courseData.courseType === "REDIRECT" &&
            courseData.redirectLink ? (
            <Link
              to={courseData.redirectLink}
              className="w-full mt-2"
              target="_blank"
            >
              <Button className="w-full font-medium text-lg font-ubuntu bg-blue-500 text-white hover:bg-blue-600">
                <RedirectLinkIcon fillColor="white" size={30} /> Visit Now
              </Button>
            </Link>
          ) : (
            <Button className="w-full font-medium text-lg font-ubuntu bg-blue-500 text-white hover:bg-blue-600">
              Buy Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayCourseCardIntoPage;
