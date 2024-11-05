import BookIcon from '@/Icons/BookIcon';
import ExamTestIcon from '@/Icons/ExamTestIcon';
import VideoIcon from '@/Icons/VideoIcon';
import { Button } from '@nextui-org/react'
import React from 'react'

interface SelectVerifyCoursesCategoryProps{
    currentCategory : string;
    onCategory: (category: string) => void;
}

const SelectVerifyCoursesCategory: React.FC<SelectVerifyCoursesCategoryProps> = ({onCategory , currentCategory}) => {
  return (
    <div className="w-full flex flex-col md:flex-row justify-center gap-4 mb-5">
        {["Unverified Courses", "Unverified Videos", "Unverified Test" , "Verified Courses", "Verified Videos", "Verified Test"].map(
          (category) => (
            <Button
              key={category}
              className={`w-fit sm:p-6 p-3 sm:text-base text-sm rounded-lg dark:text-white text-black font-ubuntu font-medium border-[1px] transition-colors ${
                currentCategory === category
                  ? "bg-gradient-to-r  from-indigo-600 to-purple-600 hover:from-blue-600 hover:to-indigo-800"
                  : "bg-black/10 dark:bg-black/30 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => onCategory(category)}
            >
             {category === "Unverified Courses" ? <BookIcon fillColor='white' /> : category === "Unverified Videos"  ? <VideoIcon fillColor='white'/> : <ExamTestIcon fillColor='white'/>} {category}
            </Button>
          )
        )}
    </div>
  )
}

export default SelectVerifyCoursesCategory
