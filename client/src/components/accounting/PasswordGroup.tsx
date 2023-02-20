import { useState, forwardRef, HTMLAttributes, ForwardedRef } from "react"
import { FieldError } from "react-hook-form"
import { faWarning, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props extends HTMLAttributes<HTMLInputElement> {
   id: string
   label?: string
   error?: FieldError
   disabled?: boolean
}

function PasswordGroup({ id, error, label, disabled = false, ...props }: Props, ref: ForwardedRef<HTMLInputElement>) {
   const [passwordToggle, setPasswordToggle] = useState<boolean>(true)

  const togglePassword = () => setPasswordToggle(toggle => !toggle)
   
   return (
      <div className="flex flex-col justify-start items-start gap-y-1.5 w-full">
         {
            label && (
               <label className={ `text-sm text-[#133061] font-grandview-bold ${ error && "text-[#DE2B2B]" }` } htmlFor={ id }>{ label }</label>
            )
         }
         
         <div className="relative w-full">
            <input className={ `appearance-none rounded-sm border border-[#B1C2DE] bg-transparent w-full px-2.5 py-1 focus-within:outline-none  ${ error && "border-[#DE2B2B] text-[#DE2B2B]" }` } autoComplete="new-password" id={ id } type={ passwordToggle ? "password" : "text" } ref={ ref } disabled={ disabled } { ...props } />

            <button className={ `absolute right-2.5 top-1.5 text-[#B1C2DE] group-focus-within:text-primary ${ error && "text-[#FF9494]" }` } type="button" tabIndex={ -1 } onClick={ togglePassword }>
               <FontAwesomeIcon icon={ passwordToggle ? faEye : faEyeSlash } size="1x" fixedWidth />
            </button>
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

export default forwardRef(PasswordGroup)