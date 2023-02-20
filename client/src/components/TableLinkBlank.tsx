import { HTMLAttributes } from "react"
import { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props extends HTMLAttributes<HTMLAnchorElement> {
   text: string
   to: string
   icon: IconDefinition
   textHoverColor: string
   backgroundHoverColor: string
}

const TableAction = ({ text, to, icon, textHoverColor, backgroundHoverColor, ...props }: Props) => {
   return (
      <a href={ to } target="_blank" rel="noreferrer" className={ `transition-all ease-in-out duration-300 flex flex-row justify-center items-center gap-x-1.5 text-[#494949] border-0 border-r border-r-[#494949] bg-[#EBEBEB] px-2.5 py-0.5 first:rounded-l-sm last:rounded-r-sm last:border-r-0 ${ textHoverColor } ${ backgroundHoverColor }` } { ...props }>
         <span>{ text }</span>

         <FontAwesomeIcon icon={ icon } fixedWidth />
      </a>
   )
}

export default TableAction