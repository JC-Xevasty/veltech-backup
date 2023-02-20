import React from 'react'
import { motion } from 'framer-motion'
import SidebarDropdownLink from './SidebarDropdownLink'

interface Props{
  isDropped? : boolean
  sidebarIsInflated? : boolean
  routes : {
    path: string
    label: string
  }[]
}

const SidebarDropdown = ({ isDropped, sidebarIsInflated, routes} : Props) => {
  const variants = {
    dropped: {
      opacity: 1,
      y: 0,
      display: "block"
    },
    floating: {
      opacity: 0,
      y: -20,
      display: "none"
    }
  }

  return (
    <motion.button
      variants={ variants }
      initial='floating'
      animate={ sidebarIsInflated && isDropped ? 'dropped' : 'floating' }
      transition={{ duration: 0.33 }}
      className='flex flex-col gap-y-5'
    >
      {
        routes.map(route => {
          return <SidebarDropdownLink
            path={ route.path }
            label={ route.label }
            key={ route.label }
          />
        })
      }
    </motion.button>
  )
}

export default SidebarDropdown