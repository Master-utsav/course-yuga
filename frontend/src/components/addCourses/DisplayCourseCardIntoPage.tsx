import React from 'react'
import RatingComponent from '../RatingComponent'
import { Chip , Image , Button} from '@nextui-org/react'
import FavoriteIcon from '@/Icons/FavoriteIcon'
import PercentageOffIcon from '@/Icons/PercentageOffIcon'
import { CourseData } from '@/constants'

interface DisplayCourseCardIntoPageProps{
    courseData : CourseData
    previewImage : string
}
const DisplayCourseCardIntoPage: React.FC<DisplayCourseCardIntoPageProps> = ({courseData , previewImage}) => {
      
    
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
          <span className="text-xl font-libre font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            {courseData.currency}
          </span>
          <span className="dark:text-violet-100 text-gray-950">
            {courseData.sellingPrice}
          </span>
        </div>
       <label className="absolute top-2 right-2">
        <FavoriteIcon
            fillColor={"rgb(239 68 68)"}
        />
       </label>
      </div>

      <div className="p-3 space-y-2">
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
            {courseData.originalPrice === courseData.sellingPrice ? 100 : ((courseData.originalPrice - courseData.sellingPrice) / courseData.originalPrice * 100).toFixed(2)}{"% "}<span className="font-ubuntu">Off</span>
          </Chip>
        </div>

        <Button className="w-full font-medium text-lg font-ubuntu bg-blue-500 text-white hover:bg-blue-600">
          Buy Now
        </Button>
      </div>
    </div>
  </div>
  )
}

export default DisplayCourseCardIntoPage