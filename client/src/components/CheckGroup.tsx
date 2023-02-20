import { faWarning } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { forwardRef, ChangeEventHandler, ForwardedRef, KeyboardEventHandler } from "react"
import { FieldError } from "react-hook-form"

interface Props {
  id:string
  options: string[]
  values: string[]  
  label: string
  error?: FieldError
  onChange?: ChangeEventHandler
  onKeyPress?: KeyboardEventHandler
}

function CheckGroup({label, id, options, values, error, ...props }: Props, ref: ForwardedRef<HTMLInputElement>) {
  return (
    <div className="flex flex-col justify-start items-start gap-y-1.5 w-full">
        {
            label && (
                <label className={ `text-sm font-grandview-bold ${ error && "text-[#DE2B2B]" }` } htmlFor={ id }>{ label }</label>
            )
        }

        <div className="flex w-full gap-x-3">
            {
                options.map((option, index) => (
                    <label className="group  hover:cursor-pointer" htmlFor={values[index]} key={option[index]}>
                        <input className="peer hidden"  id={values[index]} type="checkbox" key={ option } value={ values[index] || option } ref={ ref } { ...props }/>

                        <span className="transition-all ease-in-out duration-300 text-[#B1C2DE] font-grandview-bold rounded border border-[#B1C2DE] px-5 py-2 group-hover:text-white group-hover:border-primary group-hover:bg-primary peer-checked:text-white peer-checked:border-primary peer-checked:bg-primary">
                            {option}
                        </span>
                    </label>                
                ))
            }
        </div>

        {/* <div className="flex flex-row gap-y-4">
            
        </div> */}

        {
            error && (
               <div className="flex flex-row justify-start items-center gap-x-3">
                  <FontAwesomeIcon className="text-xs" icon={ faWarning } fixedWidth />

                  <span className="text-xs text-[#DE2B2B]">{ error.message }</span>
               </div>
            )
         }
    </div>
    
  )
}

export default forwardRef(CheckGroup)