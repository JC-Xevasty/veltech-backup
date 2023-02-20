import { forwardRef, HTMLAttributes, ForwardedRef } from "react"
import { FieldError } from "react-hook-form"
import { faWarning } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props extends HTMLAttributes<HTMLTextAreaElement> {
   id: string
   label?: string
   error?: FieldError
   disabled?: boolean
   readOnly?: boolean
   rows?: number
}

function TextAreaGroup({ id, error, label, rows = 5, disabled = false, readOnly = false, ...props }: Props, ref: ForwardedRef<HTMLTextAreaElement>) {
   return (
      <div className="flex flex-col justify-start items-start gap-y-1.5 w-full">
         {
            label && (
               <label className={ `text-sm text-[#133061] font-grandview-bold ${ error && "text-[#DE2B2B]" }` } htmlFor={ id }>{ label }</label>
            )
         }
         
         <div className="relative w-full">
            <textarea className={ `appearance-none rounded-sm border border-[#B1C2DE] bg-transparent resize-none w-full px-2.5 py-1 focus-within:outline-none  ${ error && "border-[#DE2B2B] text-[#DE2B2B]" }` } rows={ rows } id={ id } ref={ ref } disabled={ disabled } readOnly={ readOnly } { ...props } />
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

export default forwardRef(TextAreaGroup)