import BookIcon from '@/Icons/BookIcon';
import ExamTestIcon from '@/Icons/ExamTestIcon';
import VideoIcon from '@/Icons/VideoIcon';
import { Button } from '@nextui-org/react'
import React from 'react'

interface SelectBookmarkCategoryProps{
    currentCategory : string;
    onCategory: (category: string) => void;
}

const SelectBookmarkCategory: React.FC<SelectBookmarkCategoryProps> = ({onCategory , currentCategory}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-5">
        {["Bookmarked Courses", "Bookmarked Videos", "Bookmarked Test"].map(
          (category) => (
            <Button
              key={category}
              className={`w-full p-6 text-base rounded-lg dark:text-white text-black font-ubuntu font-medium border-[1px] transition-colors ${
                currentCategory === category
                  ? "bg-gradient-to-r  from-indigo-600 to-purple-600 hover:from-blue-600 hover:to-indigo-800"
                  : "bg-black/10 dark:bg-black/30 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => onCategory(category)}
            >
             {category === "Bookmarked Courses" ? <BookIcon fillColor='white' /> : category === "Bookmarked Videos"  ? <VideoIcon fillColor='white'/> : <ExamTestIcon fillColor='white'/>} {category}
            </Button>
          )
        )}
    </div>
  )
}

export default SelectBookmarkCategory
