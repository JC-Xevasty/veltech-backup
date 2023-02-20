import React, { useState } from 'react'

interface Props{
    type: {
        value: string
        color: string
    }
}

const StatusIndicator = ({ type }:Props) => {
  const [status,] = useState(type)

  return (
    <div className='flex gap-x-2 items-center'>
        <div className={`w-[10px] h-[10px] rounded-lg ${status.color}`}></div>
        <span className='tracking-wide'>{status.value}</span>
    </div>
  )
}

export default StatusIndicator