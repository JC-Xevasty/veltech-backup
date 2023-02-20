
import { forwardRef, useState, ForwardedRef, HTMLProps } from "react"
import { FieldError } from "react-hook-form"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { v4 } from "uuid"

interface InputProps extends HTMLProps<HTMLInputElement>  {
  label?: string
  error?: FieldError
  hideable?: boolean
}

function TextField({ label, error, className, hideable, type, ...rest }: InputProps, ref: ForwardedRef<HTMLInputElement>) {
  const id = v4()

  const [passwordToggle, setPasswordToggle] = useState<boolean>(true)

  const togglePassword = () => setPasswordToggle(toggle => !toggle)
  
  return (
    <div className="flex flex-col justify-start items-start gap-y-1.5 w-full">
      <div className="group flex flex-col-reverse gap-y-1.5 w-full">
        <div className="relative w-full">
          <input className={ `text-accent rounded-sm border border-[#B1C2DE] w-full px-1.5 py-1 placeholder:text-[#B1C2DE] group-focus-within:outline-none group-focus-within:border-primary group-focus-within:placeholder:text-primary ${ hideable && "pr-9" } ${ error && "text-[#FF9494] border-[#FF9494]" } ${ className }` } type={ hideable ? (passwordToggle ? "password" : "text") : type } id={ id } ref={ ref } { ...rest } />

          {
            hideable && (
              <button className={ `absolute right-2.5 top-2 text-[#B1C2DE] group-focus-within:text-primary ${ error && "text-[#FF9494]" }` } type="button" tabIndex={ -1 } onClick={ togglePassword }>
                <FontAwesomeIcon icon={ passwordToggle ? faEye : faEyeSlash } size="1x" fixedWidth />
              </button>
            )
          }
        </div>

        { label && <label className="text-[#B1C2DE] group-focus-within:text-primary" htmlFor={ id }>{ label }</label> }
      </div>
      
      { error && <span className="text-sm text-[#FF9494]">{ error.message }</span> }
    </div>
  )
}

export default forwardRef(TextField)