import { HTMLAttributes } from "react"
import { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props extends HTMLAttributes<HTMLButtonElement> {
   text: string
   icon: IconDefinition
   textHoverColor: string
   backgroundHoverColor: string
   disabled?: boolean
}

const TableAction = ({ text, icon, textHoverColor, backgroundHoverColor, disabled, ...props }: Props) => {
   return (
      <button className={ `disabled:bg-[#A3A3A3] disabled:text-[#494949] transition-all ease-in-out duration-300 flex flex-row justify-center items-center gap-x-1.5 text-[#494949] border-0 border-r border-r-[#494949] bg-[#EBEBEB] px-2.5 py-0.5 first:rounded-l-sm last:rounded-r-sm last:border-r-0 ${ textHoverColor } ${ backgroundHoverColor } ` } disabled={ disabled } type="button" { ...props }>
         <span>{ text }</span>

         <FontAwesomeIcon icon={ icon } fixedWidth />
      </button>
   )
}

export default TableAction