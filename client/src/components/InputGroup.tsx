import { forwardRef, ChangeEventHandler, ForwardedRef, KeyboardEventHandler } from "react"
import { FieldError } from "react-hook-form"

interface Props {
  error?: FieldError
  widthClass?: string
  focusPlaceholderColorClass: string
  focusBorderColorClass: string
  errorPlaceholderColorClass?: string
  errorBorderColorClass?: string
  type: "text" | "email" | "password"
  placeholder: string
  autoFocus?: boolean
  autoComplete?: "on" | "off"
  onChange?: ChangeEventHandler
  onKeyPress?: KeyboardEventHandler
}

function InputGroup({ error, widthClass, focusPlaceholderColorClass, focusBorderColorClass, errorPlaceholderColorClass, errorBorderColorClass, ...rest }: Props, ref: ForwardedRef<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-y-2.5">
      <input className={ `text-black ${ focusPlaceholderColorClass } ${ error ? errorPlaceholderColorClass : undefined } rounded border border-black focus:outline-none ${ focusBorderColorClass } ${ error ? errorBorderColorClass : undefined } hover:scale-[102.5%] focus:scale-[102.5%] ${ widthClass || "w-[300px]" } px-2.5 py-1.5` } { ...rest } ref={ ref } />
      { error && <span className="text-sm text-red-500">{ error.message }</span> }
    </div>
  )
}

export default forwardRef(InputGroup)