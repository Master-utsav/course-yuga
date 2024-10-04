import SelectInput from '@/components/SelectInput'
import { Button } from '@nextui-org/react'

const EditProfileSection3 = () => {
  return (
    <div className="w-full flex flex-col justify-between items-start px-2 py-4 gap-3">
        <div className="relative w-full flex flex-col sm:flex-row items-start justify-between gap-2 ">
        <SelectInput label='Select Country' />
        <SelectInput label='Select State' />
        <SelectInput label='Select City' />
        </div>
        <Button type='submit' >Update</Button>
    </div>
  )
}

export default EditProfileSection3
