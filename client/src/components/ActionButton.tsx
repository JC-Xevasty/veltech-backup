import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'

interface Props {
    icon: IconDefinition
    label: string
    hoverClasses: {
        foreground: string
        background: string
        border: string
    }
    path: string
}

const ActionButton = ({ icon, label, hoverClasses, path = '', ...props }:Props) => {
  if (path) {
    return (
      <Link className={ `flex items-center gap-x-1.5 w-fit transition-all ease-in-out duration-300 text-[#737373] ${hoverClasses?.foreground} border border-r-0 last:border-r first:rounded-l last:rounded-r border-[#737373] ${hoverClasses?.border} bg-[#F1F1F1] ${hoverClasses?.background} px-1.5 py-0.5` } to={ path } { ...props }>
      <FontAwesomeIcon icon={ icon } size="xs" fixedWidth />
        <span className='text-xs'>{ label }</span>
      </Link>
    )
  }

  return (
    <button className={ `flex items-center gap-x-1.5 w-fit transition-all ease-in-out duration-300 text-[#737373] ${hoverClasses?.foreground} border border-r-0 last:border-r first:rounded-l last:rounded-r border-[#737373] ${hoverClasses?.border} bg-[#F1F1F1] ${hoverClasses?.background} px-1.5 py-0.5` } { ...props }>
      <FontAwesomeIcon icon={ icon } size="xs" fixedWidth />
      <span className='text-xs'>{ label }</span>
    </button>
  )
}

export default ActionButton