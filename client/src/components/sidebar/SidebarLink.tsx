import { NavLink } from "react-router-dom"
import { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props {
  text: string
  icon: IconDefinition
  path: string
  textIsBold?: boolean
  textColorClass: string
  activeTextColorClass: string
  activeBackgroundColorClass: string
  hoverTextColorClass: string
  hoverBackgroundColorClass: string
}

function SidebarLink({ text, icon, path, textColorClass, textIsBold, activeTextColorClass, activeBackgroundColorClass, hoverTextColorClass, hoverBackgroundColorClass }: Props) {
  return (  
    <NavLink className={ ({ isActive }) => `transition-all ease-in-out duration-300 flex items-center gap-x-5 ${ textColorClass } ${ textIsBold ? "font-grandview-bold" : undefined } ${ isActive ? `${ activeTextColorClass } ${ activeBackgroundColorClass } drop-shadow font-grandview-bold` : undefined } ${ hoverTextColorClass } ${ hoverBackgroundColorClass } rounded-sm px-2 py-1` } to={ path }>
      <FontAwesomeIcon icon={ icon } size="lg" fixedWidth />
      <span>{ text }</span>
    </NavLink>
  )
}

export default SidebarLink