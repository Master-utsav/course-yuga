import { useAuthContext } from '@/context/authContext'
import UnauthorizedOwnerPage from "@/components/UnauthorizedOwnerPage"
import React from 'react'

const VerifyCourses: React.FC = () => {
  const {userData} = useAuthContext();
  return (
    <div className="min-h-screen h-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-300 lg:py-12 lg:pt-24 relative overflow-x-hidden px-2 py-4 pt-40 md:pt-56">
        {userData.role === "MASTER" ?  (
            <div>
              this is the ownwer page
            </div>
        )
        : (
            <UnauthorizedOwnerPage />
        )
        }
    </div> 
  )
}

export default VerifyCourses
