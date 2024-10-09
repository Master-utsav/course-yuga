import CourseCard from '@/components/CourseCard'
import React from 'react'
import CoursesNavbar from './CoursesNav'
import Seperator from '@/components/Seperator'

const Courses: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto flex-col flex xl:pt-24 md:pt-56 px-5">
      <CoursesNavbar/>
      <Seperator text="COURSES"/>
      <CourseCard />
    </section>
     
  )
}

export default Courses
