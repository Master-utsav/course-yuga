import { ICourseData } from '@/constants'
import {Button, Image} from "@nextui-org/react"
import React from 'react'
import RatingComponent from '../RatingComponent'
import { Link } from 'react-router-dom'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import WarningIcon from '@/Icons/WarningIcon'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { getVerifiedToken } from '@/lib/cookieService'
import axios from 'axios'
import { COURSE_API } from '@/lib/env'
import { ErrorToast, SuccessToast } from '@/lib/toasts'
import { useVideoContext } from '@/context/videoContext'
import Seperator from '../Seperator'

interface VideoCourseCardProps{
    courseData : ICourseData
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


const VideoCourseCard: React.FC<VideoCourseCardProps> = ({courseData}) => {
    const {setRefresh} = useVideoContext();
    const {
        register,
        handleSubmit,
        formState: { errors },
        } = useForm<resetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        });
    
    async function confirmDelete (data: resetPasswordFormData){
        const jwt = getVerifiedToken();
        const password = data.password;
        const courseId = courseData._id;
        try {
            const response = await axios.post(`${COURSE_API}/delete-course`, {password , courseId} , {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    "Content-Type": "application/json",
                },
            });

            if (response && response.data && response.data.success) {
                SuccessToast(response.data.message);
                setRefresh(true);
            }
            else{
                ErrorToast(response.data.message);
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            ErrorToast(error?.response.data.message ||"Something went wrong");
        }
    }
    
  const nameParams = courseData.courseName.includes("&") ? courseData.courseName.replace("&" , "and") : courseData.courseName
  return (
    <div className='w-full relative flex flex-col py-1'>
    <Seperator text={courseData.courseName}/>
    <div className='w-full h-auto flex gap-2 justify-start items-center relative '>
        <div className='w-1/4'>
        <Image
                isBlurred
                src={courseData.thumbnail}
                alt="course-img"
                className="z-0 object-cover p-2 aspect-video"
            />
        </div>
        <div className='flex flex-col justify-between items-start space-y-4 w-1/2 relative'>
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
        <div className='flex flex-col space-y-4 text-base font-medium font-ubuntu justify-end  w-1/4 items-center'>
            <Link to={`/user/add-videos?courseId=${courseData._id}&name=${nameParams}`} className="w-full">
                <Button
                className="
                    w-full py-3 font-ubuntu text-base font-medium 
                    bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 
                    shadow-md hover:shadow-lg transition-all duration-300
                "
                >
                Manage Videos
                </Button>
            </Link>

            <Link to={`/course-intro-page?courseId=${courseData._id}`} className="w-full">
                <Button
                className="
                    w-full py-3  font-ubuntu text-base font-medium 
                    bg-green-500 text-white hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-500 
                    shadow-md hover:shadow-lg transition-all duration-300
                "
                >
                Update Course
                </Button>
            </Link>
          
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="dark:bg-red-600/50 bg-red-300 hover:bg-red-600 dark:hover:bg-red-500 transition-colors duration-200 font-semibold font-ubuntu text-black dark:text-white/80 w-full">
                    Delete Course
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] p-6 shadow-lg rounded-lg dark:bg-gray-800 bg-white">
                    <DialogHeader>
                    <DialogTitle className="space-x-2 flex justify-start items-center">
                        <WarningIcon fillColor="red" />
                        <span className="font-ubuntu text-2xl font-bold text-red-700 dark:text-red-400">
                        Warning
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-300 text-base mt-2">
                        Are you sure? You really want to{" "}
                        <span className="font-bold">delete</span> your account
                        permanently.
                    </DialogDescription>
                    </DialogHeader>

                    <div className="gap-4 pb-4 flex flex-col justify-start items-center">
                    {/* Warning List */}
                    <ul className="w-full bg-gray-50 dark:bg-gray-900 text-sm p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        {[
                        "This action cannot be undone.",
                        "You will lose access to your course.",
                        "You will lose all associated data of your course.",
                        "You will not be able to recover your course.",
                        "All course-videos, user-data, will be delete premanantly",
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
                    <div
                        className="w-full flex flex-col gap-3 mt-4"
                    >
                        <div className="relative w-full">
                        <input
                            type={"password"}
                            placeholder="Enter your password"
                            className={`p-3 border rounded-md w-full text-gray-900 dark:text-white dark:bg-gray-700 bg-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                            errors.password ? "border-red-500 focus:ring-red-700" : ""
                            }`}
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-red-700 text-sm mt-1">
                            {typeof errors.password.message === "string"
                                ? errors.password.message
                                : "An error occurred"}
                            </p>
                        )}
                        </div>

                        <DialogFooter className="flex justify-between mt-4">
                        <Button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 transition-colors duration-200 text-white font-semibold px-4 py-2 rounded-md"
                            onClick={handleSubmit(confirmDelete)}
                        >
                            Confirm Deletion
                        </Button>
                        </DialogFooter>
                    </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    </div>
    </div>
  )
}

export default VideoCourseCard
