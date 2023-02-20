import { forwardRef, HTMLAttributes, ForwardedRef } from "react"
import { FieldError } from "react-hook-form"
import { faChevronDown, faWarning } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props extends HTMLAttributes<HTMLSelectElement> {
   id: string
   options: string[]
   values: string[] | number[]
   label: string
   error?: any
   disabled?: boolean
}

function SelectGroup({ id, options, values, error, label, disabled = false, ...props }: Props, ref: ForwardedRef<HTMLSelectElement>) {
   return (
      <div className="flex flex-col justify-start items-start gap-y-1.5 w-full">
         {
            label && (
               <label className={ `text-sm text-[#133061] font-grandview-bold ${ error && "text-[#DE2B2B]" }` } htmlFor={ id }>{ label }</label>
            )
         }
         
         <div className="relative w-full">
            <FontAwesomeIcon className={ `absolute top-2 right-2.5 text-[#B1C2DE] ${ error && "text-[#DE2B2B]" }` } icon={ faChevronDown } fixedWidth />
            
            <select className={ `appearance-none rounded-sm border border-[#B1C2DE] bg-transparent w-full px-2.5 py-1 focus-within:outline-none ${ error && "border-[#DE2B2B] text-[#DE2B2B]" }` } id={ id } ref={ ref } defaultValue="" disabled={ disabled } { ...props }>
               {
                  options.map((option, index) => (
                     <option key={ option } value={ values[index] != null ? values[index] : option } disabled={ index === 0 }>{ option }</option>
                  ))
               }
            </select>
         </div>

         {
            error && (
               <div className="flex flex-row justify-start items-center gap-x-3">
                  <FontAwesomeIcon className="text-xs text-[#DE2B2B]" icon={ faWarning } fixedWidth />

                  <span className="text-xs text-[#DE2B2B]">{ error.message }</span>
               </div>
            )
         }
      </div>     
   )
}

export default forwardRef(SelectGroup)