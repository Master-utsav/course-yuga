import Header from '@/components/addCourses/Header'
import PersonalCourseForm from '@/components/addCourses/PersonalCourseForm'
import RedirectCourseForm from '@/components/addCourses/RedirectCourseForm'
import YoutubeCourseForm from '@/components/addCourses/YoutubeCourseForm'
import { motion } from 'framer-motion'
import React from 'react'

const AddCourses = () => {

  const [selectedCategory , setSelectedCategory] = React.useState<string>("");

  const handleSelectedCategory = (category : string) => {
    setSelectedCategory(category)
  }
  return (
    <motion.div
      className="w-full bg-white dark:bg-gray-800 min-h-screen"
      variants={{
        hidden: { opacity: 0.3, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 }
      }}
      transition={{ duration: 0.3 }}
    >
    <Header onCategory={handleSelectedCategory}/>
    
    {selectedCategory === "YouTube Course" && <YoutubeCourseForm />}
    {selectedCategory === "Redirecting Course" && <RedirectCourseForm />}
    {selectedCategory === "Personal Course" && <PersonalCourseForm />}
    
    </motion.div>
  )
}

export default AddCourses
