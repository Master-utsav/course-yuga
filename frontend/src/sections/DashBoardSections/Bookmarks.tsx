import BookmarkCourseCard from "@/components/bookmark/BookmarkCourseCard";
import BookmarkVideoCard from "@/components/bookmark/BookmarkVideoCard";
import SelectBookmarkCategory from "@/components/bookmark/SelectBookmarkCategory";
import { useAuthContext } from "@/context/authContext";
import TextFlipSmoothRevealEffect from "@/Effects/TextFlipSmoothRevealEffect";
import { motion } from "framer-motion";
import React from "react";



const Bookmarks = () => {
  
  const [category , setCategory] = React.useState("Bookmarked Videos");
  const {userData} = useAuthContext();
  function handleCategoryChange(category : string){
    setCategory(category);
  }


  return (
    
      <motion.div
        className="w-full relative dark:bg-white/5 bg-black/5 rounded-lg p-4 sm:p-6 space-y-6 "
        variants={{
          hidden: { opacity: 0.3, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 }
        }}
        transition={{ duration: 0.3 }}
      >
      <div className="  flex justify-center items-center text-center gap-2 overflow-hidden">
        <TextFlipSmoothRevealEffect text="BOOKMARKS" className="sm:text-5xl text-3xl"/>
      </div>
      <SelectBookmarkCategory onCategory={handleCategoryChange}  currentCategory={category}/>
      {category==="Bookmarked Videos" && <BookmarkVideoCard  videoIds={userData.bookmarks?.video}/>}
      {category==="Bookmarked Courses" && <BookmarkCourseCard  courseIds={userData.bookmarks?.course}/>}
      </motion.div>
  );
};

export default Bookmarks;
