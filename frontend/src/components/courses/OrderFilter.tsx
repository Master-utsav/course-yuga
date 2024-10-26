import { Select, SelectItem } from '@nextui-org/react'
import React from 'react'

interface OrderFilterProps{
  onChangeFilter: (data : {order:string}) => void
}
const OrderFilter: React.FC<OrderFilterProps> = ({onChangeFilter}) => {  
  const selectOrder = ["Latest", "A to Z", "Z to A", "Oldest"];

  function handleOrderChange (e:string) {
    const order = selectOrder[parseFloat(e)]
    onChangeFilter({order});
  }
  return (
    <Select
        label="Order"
        variant="underlined"
        onChange={(e) => handleOrderChange(e.target.value)}
        className="focus-visible:border-none focus-visible:outline-none text-xl"
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
