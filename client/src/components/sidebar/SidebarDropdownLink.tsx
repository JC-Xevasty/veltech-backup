import React from 'react'
import { NavLink } from 'react-router-dom'

interface Props{
  path: string
  label: string
}

const SidebarDropdownLink = ({ path, label }: Props) => {
  return (
    <NavLink className={ ({ isActive }) => ['transition-all mb-2 ease-in-out duration-300 flex items-center rounded px-16 w-full py-1 gap-x-5 text-gray-600 hover:bg-white hover:text-primary', isActive ? 'bg-white !text-primary font-grandview-bold drop-shadow' : undefined].join(' ') } to={ path }>
      <span className='text-primary-light select-none'>{ label }</span>
    </NavLink>
  )
}

export default SidebarDropdownLink