import { forwardRef, useRef, HTMLAttributes, ForwardedRef } from "react"
import { FieldError } from "react-hook-form"
import { faWarning } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props extends HTMLAttributes<HTMLInputElement> {
   id: string
   label: string
   error?: FieldError
   disabled?: boolean
   maxDate?: string
}

function DateGroup({ id, error, label, disabled = false, maxDate, ...props }: Props, ref: ForwardedRef<HTMLInputElement>) {
   const inputRef = useRef<HTMLInputElement | null>(null)

   return (
      <div className="flex flex-col justify-start items-start gap-y-1.5 w-full">
         {
            label && (
               <label className={`text-sm text-[#133061] font-grandview-bold ${error && "text-[#DE2B2B]"}`} htmlFor={id}>{label}</label>
            )
         }

         <div className="relative w-full">
            <input className={`appearance-none rounded-sm border border-[#B1C2DE] bg-transparent w-full px-2.5 py-1 focus-within:outline-none  ${error && "border-[#DE2B2B] text-[#DE2B2B]"}`} max={maxDate} id={id} type="text" ref={(elem) => { inputRef.current = elem; if (typeof ref === "function") { ref(elem) } else { ref!.current = elem } }} onFocus={ (evt) => { console.log("focused"); evt.target.type = "date"; } } onBlur={ (evt) => { console.log("blurred"); evt.target.type = "text"; } } disabled={disabled} {...props} />
         </div>

         {
            error && (
               <div className="flex flex-row justify-start items-center gap-x-3">
                  <FontAwesomeIcon className="text-xs text-[#DE2B2B]" icon={faWarning} fixedWidth />

                  <span className="text-xs text-[#DE2B2B]">{error.message}</span>
               </div>
            )
         }
      </div>
   )
}

export default forwardRef(DateGroup)