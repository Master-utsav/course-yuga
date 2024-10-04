import { Button } from '@nextui-org/react'

const EditProfileSection4 = () => {
  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-start px-2 py-4 gap-3">
     <Button className='bg-amber-700'>
        Change Password
     </Button>
     <Button className='bg-red-600'>
        Delete Account
     </Button>
      
    </div>
  )
}

export default EditProfileSection4
