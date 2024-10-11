import { useCourseContext } from '@/context/courseContext';
import { ErrorToast } from '@/lib/toasts';
import { Select, SelectItem } from '@nextui-org/react'
import React from 'react'

const OrderFilter: React.FC = () => {  
  const selectOrder = ["Latest", "A to Z", "Z to A", "Oldest"];
  const {coursesData , setupdatedCourseData } = useCourseContext();

  async function handleOrderChange (e:string) {

    const order = selectOrder[parseFloat(e)]

    try {
        const sortedCourses = [...coursesData];
        switch (order) {
          case "Latest":
            sortedCourses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case "Oldest":
            sortedCourses.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
          case "A to Z":
            sortedCourses.sort((a, b) => a.courseName.localeCompare(b.courseName));
            break;
          case "Z to A":
            sortedCourses.sort((a, b) => b.courseName.localeCompare(a.courseName));
            break;
        }
        setupdatedCourseData(sortedCourses);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
          ErrorToast(error.response?.data?.message);
        
    }
  }
  return (
    <Select
        label="Order"
        variant="underlined"
        onChange={(e) => handleOrderChange(e.target.value)}
        className="max-w-[10rem] focus-visible:border-none focus-visible:outline-none text-xl"
      >
        {selectOrder.map((order, index) => (
          <SelectItem key={index} value={order}>
            {order}
          </SelectItem>
        ))}
      </Select>
  )
}

export default OrderFilter
