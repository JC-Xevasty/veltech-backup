import React from 'react'
import { motion } from 'framer-motion'
import { faChevronLeft, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
  icon: IconDefinition
  label: string
  isToggled? : boolean
  setToggled : any
  sidebar : any
}

const SidebarDropdownToggler = ({ icon, label, isToggled, setToggled, sidebar }: Props) => {
  const toggleDropdown = () => {
    if (!sidebar.isToggled) {
      sidebar.setToggled(true)
      setToggled(true)
      return
    }
    
    setToggled(!isToggled)
  }

  const variants = {
    hidden: {
      fontSize: "0px",
      display: "none"
    },
    visible: {
      fontSize: "1em",
      display: "block"
    }
  }

  return (
    <button className={ ['transition-all ease-in-out duration-300 flex items-center rounded focus:outline-none hover:!text-primary hover:bg-white h-[27.5px] px-2 py-5', sidebar.isToggled ? 'justify-between' : 'justify-center'].join(' ') } onClick={ toggleDropdown }>
      <div className={ ['flex items-center  gap-x-5 text-gray-600', !sidebar.isToggled ? 'justify-center' : undefined].join(' ') }>
        <FontAwesomeIcon icon={icon} size="lg" fixedWidth/>
        <motion.span
          variants={ variants }
          initial="visible"
          animate={ sidebar.isToggled ? "visible" : "hidden" }
          transition={{ duration: 0.33 }}
          className='select-none whitespace-nowrap'
        >
          { label }
        </motion.span>
      </div>

      <div className={ !sidebar.isToggled ? 'hidden' : undefined }>
        <motion.i
          animate={{ rotate: isToggled ? "270deg" : "180deg" }}
          transition={{ type: "spring", stiffness: 200 }}
          className='text-gray-600'
        ><FontAwesomeIcon icon={faChevronLeft} fixedWidth/></motion.i>
      </div>
    </button>
  )
}

export default SidebarDropdownToggler