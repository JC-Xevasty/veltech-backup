import { forwardRef, useState, ChangeEventHandler, HTMLAttributes, ForwardedRef, KeyboardEventHandler } from "react"
import { FieldError } from "react-hook-form"
import { v4 } from "uuid"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props extends HTMLAttributes<HTMLInputElement> {
  type: "text" | "email" | "password"
  label: string
  currentValue: string
  error?: FieldError
  widthClassName?: string
  hideable?: boolean
  autoFocus?: boolean
  autoComplete?: "on" | "off"
}

function FloatingLabelInputGroup({ type, label, currentValue, error, widthClassName = "w-full", hideable, ...rest }: Props, ref: ForwardedRef<HTMLInputElement>) {
  const id = v4()

  const [passwordToggle, setPasswordToggle] = useState<boolean>(true)

  const togglePassword = () => setPasswordToggle(toggle => !toggle)

  return (
    <div className="relative flex flex-col gap-y-2.5">
      <input className={ `peer rounded-sm border-[1.5px] border-[#B1C2DE] focus-within:border-[#3073E2] focus-within:outline-none px-2.5 py-2 ${ widthClassName } ${ hideable && "pr-10" } ${ error && "border-red-700" }` } type={ hideable ? (passwordToggle ? "password" : "text") : type } id={ id } ref={ ref } { ...rest } />
      
      <label className={ `transition-all ease-in-out duration-300 absolute left-2.5 top-2.5 peer-focus-within:-top-1.5 peer-focus-within:text-xs text-[#B1C2DE] peer-focus-within:text-[#3073E2] whitespace-nowrap select-none peer-focus-within:bg-white peer-focus-within:px-1.5 ${ currentValue && "-top-1.5 text-xs bg-white px-1.5" } ${ error && "text-red-700" }` } htmlFor={ id }>{ label }</label>
      
      {
        hideable && (
          <button className={ `absolute right-2.5 top-2.5 text-[#B1C2DE] peer-focus-within:text-[#3073E2] ${ error && "text-red-700" }` } type="button" tabIndex={ -1 } onClick={ togglePassword }>
            <FontAwesomeIcon icon={ passwordToggle ? faEye : faEyeSlash } size="1x" fixedWidth />
          </button>
        )
      }

      {
        error && (
          <span className="text-xs text-red-700">{ error.message }</span>
        )
      }
    </div>
  )
}

export default forwardRef(FloatingLabelInputGroup)