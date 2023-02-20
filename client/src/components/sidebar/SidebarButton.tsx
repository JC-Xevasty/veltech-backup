import { MouseEventHandler } from "react"
import { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props {
  text: string
  icon: IconDefinition
  textIsBold?: boolean
  textColorClass: string
  hoverTextColorClass: string
  hoverBackgroundColorClass: string
  onClick: MouseEventHandler
}

function SidebarLink({ text, icon, textColorClass, textIsBold, hoverTextColorClass, hoverBackgroundColorClass, ...rest }: Props) {
  return (
    <button className={ `transition-all ease-in-out duration-300 flex items-center gap-x-5 ${ textColorClass } ${ textIsBold ? "font-bold" : undefined } ${ hoverTextColorClass } ${ hoverBackgroundColorClass } rounded-sm px-2 py-1` } { ...rest }>
      <FontAwesomeIcon icon={ icon } size="lg" fixedWidth />
      <span>{ text }</span>
    </button>
  )
}

export default SidebarLink