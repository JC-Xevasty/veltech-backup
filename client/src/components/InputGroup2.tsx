import { faWarning } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { forwardRef, ForwardedRef } from "react"
import { FieldError } from "react-hook-form"
import { v4 } from "uuid"

interface Props {
  type: "text" | "email" | "password"
  label: string
  error?: FieldError
}

function InputGroup({ label, error, ...rest }: Props, ref: ForwardedRef<HTMLInputElement>) {
  const id = v4()

  return (
    <div className="flex flex-col items-start gap-y-2.5">
      <label className={ `font-grandview-bold` } htmlFor={ id }>{ label }</label>

      <input className={ `rounded-sm border border-accent focus-within:outline-none w-full px-2.5 py-1` } id={ id } ref={ ref } { ...rest } />

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

export default forwardRef(InputGroup)