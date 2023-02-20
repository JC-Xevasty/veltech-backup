import { HTMLAttributes } from "react"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props extends HTMLAttributes<HTMLButtonElement> {
   text: string
}

const AddButton = ({ text, ...props }: Props) => {
   return (
      <button className="self-start transition-all ease-in-out duration-300 flex flex-row justify-center items-center gap-x-3 text-white tracking-wide rounded-sm border-2 border-accent bg-accent px-2.5 py-0.5 hover:scale-105" { ...props }>
         <FontAwesomeIcon icon={ faPlus } fixedWidth />

         <span>{ text }</span>
      </button>
   )
}

export default AddButton